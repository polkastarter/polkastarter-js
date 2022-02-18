import { fixednftswap } from "../interfaces";
import ERC20TokenContract from "./ERC20TokenContract";
import Numbers from "../utils/Numbers";
import _ from "lodash";
import moment from 'moment';
import { deploy } from '../services/DeploymentService';
import BaseSwapContract from './BaseSwapContract';

/**
 * Fixed NFT Swap Object
 * @constructor FixedNFTSwapContract
 * @param {Web3} web3
 * @param {Address} contractAddress ? (opt)
 * @extends BaseSwapContract
 */
class FixedNFTSwapContract extends BaseSwapContract {
	constructor({
		web3,
		contractAddress = null /* If not deployed */,
		acc,
	}) {
		super({ web3, contractAddress, acc, contractInterface: fixednftswap });
	}

	/**
	 * 
	 * @function deploy 
	 * @description Deploy the NFT swap contract
	 * @param {String} startDate Start date
	 * @param {String} endDate End date
	 * @param {String} distributionDate Distribution date
	 * @param {Float=} individualMaximumAmount Max cap per wallet. 0 to disable it. (Default: 0)
	 * @param {Float=} minimumRaise Soft cap (Default: 0)
	 * @param {Float=} feePercentage Fee percentage (Default: 1)
	 * @param {Boolean=} hasWhitelisting Has White Listing. (Default: false)
	 * @param {String=} ERC20TradingAddress Token to use in the swap (Default: 0x0000000000000000000000000000000000000000)
	 * @param {Number[]} categoryIds Ids of the NFT categories
	 * @param {Number[]} categoriesSupply Supply of every category of NFT in same order than Ids
	 * @param {Float[]} categoriesPrice Price per unit of a category item, in same order than Ids  
	 * @param {Number=} tradingDecimals To be the decimals of the currency in case (ex : USDT -> 9; ETH -> 18) (Default: 0)

	*/

	deploy = async ({
		startDate,
		endDate,
		distributionDate,
		individualMaximumAmount = 0,
		minimumRaise = 0,
		feePercentage = 1,
		hasWhitelisting = false,
		ERC20TradingAddress = '0x0000000000000000000000000000000000000000',
		categoryIds,
		categoriesSupply,
		categoriesPrice,
		tradingDecimals = 0, /* To be the decimals of the currency in case (ex : USDT -> 9; ETH -> 18) */
		callback
	}) => {
		if (feePercentage < 1) {
			throw new Error("Fee Amount has to be >= 1");
		}


		if (ERC20TradingAddress != '0x0000000000000000000000000000000000000000' && (tradingDecimals == 0)) {
			throw new Error("If an ERC20 Trading Address please add the 'tradingDecimals' field to the trading address (Ex : USDT -> 6)");
		} else {
			/* is ETH Trade */
			tradingDecimals = 18;
		}

		let totalRaise = 0;
		let finalcategoriesPrice = [];
		for (let i = 0; i < categoriesSupply.length; i++) {
			totalRaise += categoriesSupply[i] * categoriesPrice[i];
			finalcategoriesPrice[i] = Numbers.toSmartContractDecimals(
				categoriesPrice[i],
				tradingDecimals
			)
		};
		if (minimumRaise != 0 && (minimumRaise > totalRaise)) {
			throw new Error("Minimum Raise has to be smaller than total Raise")
		}
		if (Date.parse(startDate) >= Date.parse(endDate)) {
			throw new Error("Start Date has to be smaller than End Date")
		}
		if (Date.parse(endDate) >= Date.parse(distributionDate)) {
			throw new Error("End Date has to be smaller than Distribution Date")
		}
		if (Date.parse(startDate) <= Date.parse(moment(Date.now()).add(2, 'm').toDate())) {
			throw new Error("Start Date has to be higher (at least 2 minutes) than now")
		}
		if (individualMaximumAmount < 0) {
			throw new Error("Individual Maximum Amount should be bigger than 0")
		}

		if (individualMaximumAmount > 0) {
			/* If exists individualMaximumAmount */
			if (individualMaximumAmount > totalRaise) {
				throw new Error("Individual Maximum Amount should be smaller than total Tokens For Sale")
			}
		}

		if (individualMaximumAmount == 0) {
			individualMaximumAmount = totalRaise; /* Set Max Amount to Unlimited if 0 */
		}

		let params = [
			Numbers.timeToSmartContractTime(startDate),
			Numbers.timeToSmartContractTime(endDate),
			Numbers.timeToSmartContractTime(distributionDate),
			Numbers.toSmartContractDecimals(
				individualMaximumAmount,
				await this.getTradingDecimals()
			),
			Numbers.toSmartContractDecimals(minimumRaise, await this.getTradingDecimals()),
			parseInt(feePercentage),
			hasWhitelisting,
			ERC20TradingAddress,
			categoryIds,
			categoriesSupply,
			finalcategoriesPrice
		];
		let res = await deploy(
			this.acc,
			this.params.contract,
			params,
			callback
		);
		this.params.contractAddress = res.contractAddress;
		/* Call to Backend API */

		this.__assert();
		return res;
	};

	/**
	 * @function swap
	 * @description Swap tokens by Ethereum or ERC20
	 * @param {Integer} tokenAmount
	 * @param {Integer} categoryId
	 * @param {Integer} maxAllocation
	 * @param {string=} signature Signature for the offchain whitelist
	 */

	swap = async ({ tokenAmount, categoryId, maxAllocation, callback, signature }) => {

		let cost = await this.getCost({
			amount: tokenAmount,
			categoryId
		});

		let costToDecimals = Numbers.toSmartContractDecimals(cost, await this.getTradingDecimals());

		if (!signature) {
			signature = '0x00';
		}

		return await this.executeContractMethod(
			this.getContractMethods().swapWithSig(tokenAmount, categoryId, maxAllocation, signature),
			false,
			await this.isETHTrade() ? costToDecimals : 0,
			callback
		);
	};

	/**************************************
	 * DATE METHODS
	 **************************************/

	/**
	 * @function setDistributionDate
	 * @type admin
	 * @param {Date} distributionDate
	 * @description Modifies the distribution date for the pool
	 */
	setDistributionDate = async ({ distributionDate }) => {
		return await this.executeContractMethod(
			this.getContractMethods().setDistributionDate(Numbers.timeToSmartContractTime(distributionDate))
		);
	}

	/**
	 * @function distributionDate
	 * @description Get Distribution Date of NFT
	 * @returns {Date}
	 */
	async distributionDate() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.getContractMethods().distributionDate().call()
		);
	}

	/**
	 * @function hasDistributed
	 * @description Verify if the NFTs are up for distribution, if the current date is after distributionDate
	 * @returns {Boolean}
	 */
	async hasDistributed() {
		return await this.params.contract
			.getContract()
			.methods.hasDistributed()
			.call();
	}

	/**************************************
	 * TOKEN METHODS
	 **************************************/

	/**
	 * @function tokensForSale
	 * @description Get Total tokens for sale by category
	 * @param {Integer} categoryId
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensForSale({ categoryId }) {
		return (await this.params.contract
			.getContract()
			.methods.categories(categoryId)
			.call()).supply;
	}

	/**
	 * @function soldByCategoryId
	 * @description Get Total tokens for sold by category
	 * @param {Integer} categoryId
	 * @returns {Integer} Amount in Tokens
	 */
	async soldByCategoryId({ categoryId }) {
		return await this.params.contract
			.getContract()
			.methods.soldByCategoryId(categoryId)
			.call();
	}

	/**
	 * @function tokensLeft
	 * @description Get Total tokens owned by category
	 * @param {Integer} categoryId
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensLeft({ categoryId }) {
		return await this.params.contract
			.getContract()
			.methods.tokensLeft(categoryId)
			.call();
	}

	/**
	 * @function totalCost
	 * @description Get Total cost for buying all the nfts
	 * @returns {Integer} Amount in Tokens
	 */
	async totalCost() {
		return await this.params.contract
			.getContract()
			.methods.maximumRaise()
			.call();
	}

	/**
	 * @function getCost
	 * @description Get Cost for category and amount
	 * @param {Integer} amount
	 * @param {Integer} categoryId
	 * @returns {Integer} costAmount
	 */
	getCost = async ({ amount, categoryId }) => {

		return Numbers.fromDecimals(
			await this.params.contract
				.getContract()
				.methods.cost(amount, categoryId)
				.call(),
			await this.getTradingDecimals()
		);
	};

	/**
	 * @function safePullTradeToken
	 * @description Safe Pull all trading tokens
	 */
	safePullTradeToken = async () => {
		return await this.executeContractMethod(
			this.getContractMethods().safePullTradeToken(),
			null,
			0
		);
	};

	/* Legacy Call */
	getETHCostFromTokens = () => { throw new Error("Please use 'getCost' instead") };

	/**************************************
	 * PURCHASE METHODS
	 **************************************/

	/**
	 * @function getUserPurchases
	 * @param {Address} address
	 * @returns {Object[]} purchases
	 */
	getUserPurchases = async ({ address }) => {
		let purchaseIds = await this.params.contract
			.getContract()
			.methods
			.getMyPurchases(address)
			.call();
		let purchases = [];

		for (let id of purchaseIds) {
			if (id != undefined) {
				purchases.push(
					await this.getPurchase({ purchaseId: Number(id) })
				);
			}
		};
		return purchases;
	};

	/**
	 * @function getPurchase
	 * @description Get Purchase based on ID
	 * @param {Integer} purchaseId
	 * @returns {Integer} _id
	 * @returns {Integer} categoryId
	 * @returns {Integer} amount
	 * @returns {Integer} amountContributed
	 * @returns {Address} purchaser
	 * @returns {Date} timestamp
	 * @returns {Boolean} reverted
	 */
	getPurchase = async ({ purchaseId }) => {
		let res = await this.params.contract
			.getContract()
			.methods.getPurchase(purchaseId)
			.call();

		let amountContributed = Numbers.fromDecimals(res.amountContributed, await this.getTradingDecimals());

		return {
			_id: purchaseId,
			categoryId: Number(res.categoryId),
			amount: Number(res.amountPurchased),
			amountContributed,
			purchaser: res.purchaser,
			timestamp: Numbers.fromSmartContractTimeToMinutes(res.timestamp),
			reverted: res.reverted,
		};
	};

	/**
	 * @function getBuyers
	 * @description Get Buyers
	 * @returns {Array | Integer} _ids
	 */

	getBuyers = async () =>
		await this.getContractMethods().getBuyers().call();

	/**
	 * @function getPurchaseIds
	 * @description Get All Purchase Ids
	 * @returns {(Array | Integer)} _ids
	 */
	getPurchaseIds = async () => {
		let res = await this.params.contract
			.getContract()
			.methods.getPurchasesCount()
			.call();
		let ids = [];
		for (let i = 0; i < res; i++) {
			ids.push(i);
		}
		return ids;
	};

	/**
	 * @function getPurchaseIds
	 * @description Get All Purchase Ids filter by Address/Purchaser
	 * @param {Address} address
	 * @returns {Array | Integer} _ids
	 */
	getAddressPurchaseIds = async ({ address }) => {
		let res = await this.executeContractMethod(
			this.getContractMethods().getMyPurchases(address),
			true
		);
		return res.map((id) => Numbers.fromHex(id));
	};


	/**************************************
	 * CATEGORIES METHODS
	 **************************************/

	/**
	 * @function getIsClaimedCategoryForUser
	 * @param {Address} address
	 * @param {Number} categoryId
	 * @returns {boolean} claimed 
	 */
	getIsClaimedCategoryForUser = async ({ address, categoryId }) => {
		return await this.executeContractMethod(
			this.getContractMethods().getIsClaimedCategoryForUser(address, categoryId),
			true
		);
	}

	/**
	 * @function setUserClaimedCategory
	 * @type admin
	 * @param {Address} address
	 * @param {Number} categoryId
	 * @description Sets user claimed category
	 */
	setUserClaimedCategory = async ({ address, categoryId }) => {
		await this.executeContractMethod(
			this.getContractMethods().setUserClaimedCategory(address, categoryId)
		);
	};

	/**
	 * @function categoryIds
	 * @returns {Number[]} an array containig all category ids
	 */
	async categoryIds() {
		return await this.params.contract
			.getContract()
			.methods
			.getCategoryIds()
			.call();
	}

	/**
	 * @function setCategories
	 * @type admin
	 * @param {Number[]} categoryIds Ids of the NFT categories
	 * @param {Number[]} categoriesSupply Supply of every category of NFT in same order than Ids
	 * @param {Float[]} categoriesPrice Price per unit of a category item, in same order than Ids  
	   * @param {Number} tradingDecimals To be the decimals of the currency in case (ex : USDT -> 9; ETH -> 18)
	 * @description Modifies the categories oon the contract
	 */
	setCategories = async ({ categoryIds, categoriesSupply, categoriesPrice }) => {
		let finalcategoriesPrice = [];
		for (let i = 0; i < categoriesPrice.length; i++) {
			finalcategoriesPrice[i] = Numbers.toSmartContractDecimals(
				categoriesPrice[i],
				await this.getTradingDecimals()
			)
		};
		return await this.executeContractMethod(
			this.getContractMethods().setCategories(
				categoryIds,
				categoriesSupply,
				categoriesPrice
			)
		);
	}

}

export default FixedNFTSwapContract;
