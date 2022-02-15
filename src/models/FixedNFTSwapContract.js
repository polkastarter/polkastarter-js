import { fixednftswap } from "../interfaces";
import Contract from "./Contract";
import ERC20TokenContract from "./ERC20TokenContract";
import Numbers from "../utils/Numbers";
import _ from "lodash";
import moment from 'moment';
import Client from "../utils/Client";

/**
 * Fixed NFT Swap Object
 * @constructor FixedNFTSwapContract
 * @param {Web3} web3
 * @param {Address} contractAddress ? (opt)
 */
class FixedNFTSwapContract {
	constructor({
		web3,
		contractAddress = null /* If not deployed */,
		acc,
	}) {
		try {
			if (!web3) {
				throw new Error("Please provide a valid web3 provider");
			}
			this.web3 = web3;
			this.version = "2.0";
			if (acc) {
				this.acc = acc;
			}

			this.params = {
				web3: web3,
				contractAddress: contractAddress,
				contract: new Contract(web3, fixednftswap, contractAddress),
			};

			this.client = new Client();
		} catch (err) {
			throw err;
		}
	}

	__init__() {
		try {
			if (!this.getAddress()) {
				throw new Error("Please add a Contract Address");
			}

			this.__assert();
		} catch (err) {
			throw err;
		}
	};

	assertERC20Info = async () => {
		if (!(await this.isETHTrade())) {
			this.params.tradingERC20Contract = new ERC20TokenContract({
				web3: this.web3,
				contractAddress: await this.getTradingERC20Address(),
				acc: this.acc
			});
		};
	}

	__deploy = async (params, callback) => {
		return await this.params.contract.deploy(
			this.acc,
			this.params.contract.getABI(),
			this.params.contract.getJSON().bytecode,
			params,
			callback
		);
	};

	/**
	 * @function addToBlacklist
	 * @description Adds an address to the blacklist
	 * @param {string} address
	 */
	addToBlacklist = async ({ address }) => {
		try {
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.addToBlacklist(address)
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	 * @function removeFromBlacklist
	 * @description Removes an address from the blacklist
	 * @param {string} address
	 */
	removeFromBlacklist = async ({ address }) => {
		try {
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.removeFromBlacklist(address)
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	 * @function isBlackListed
	 * @description Returns true if the address is in the blacklist
	 * @param {string} address
	 * @returns {boolean} isBlackListed
	 */
	isBlacklisted = async ({ address }) => {
		return await this.params.contract.getContract().methods.isBlacklisted(address).call();
	}

	/**
	 * @function isPaused
	 * @description Returns if the contract is paused or not
	 * @returns {boolean}
	 */

	async isPaused() {
		return await this.params.contract.getContract().methods.paused().call();
	}

	/**
	 * @function pauseContract
	 * @type admin
	 * @description Pause Contract
	 */
	async pauseContract() {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.pause()
		);
	}

	/**
	 * @function unpauseContract
	 * @type admin
	 * @description Unpause Contract
	 */
	async unpauseContract() {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.unpause()
		);
	}

	/**
	 * @function startDate
	 * @description Get Start Date of Change
	 * @returns {Date}
	 */
	async startDate() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.params.contract.getContract().methods.startDate().call()
		);
	}

	/**
	 * @function endDate
	 * @description Get End Date of Change
	 * @returns {Date}
	 */
	async endDate() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.params.contract.getContract().methods.endDate().call()
		);
	}

	/**
	 * @function distributionDate
	 * @description Get Distribution Date of NFT
	 * @returns {Date}
	 */
	async distributionDate() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.params.contract.getContract().methods.distributionDate().call()
		);
	}

	/**
	 * @function isFinalized
	 * @description To see if contract was finalized
	 * @returns {Boolean}
	 */
	async isFinalized() {
		return await this.params.contract.getContract().methods.hasFinalized().call()

	}

	/**
	 * @function individualMaximumAmount
	 * @description Get Individual Maximum Amount for each address
	 * @returns {Integer}
	 */
	async individualMaximumAmount() {
		return Numbers.fromDecimals(
			(await this.params.contract
				.getContract()
				.methods.individualMaximumAmount()
				.call()),
			await this.getTradingDecimals()
		);
	}

	/**
	 * @function minimumRaise
	 * @description Get Minimum Raise amount for Token Sale
	 * @returns {Integer} Amount in Tokens
	 */
	async minimumRaise() {
		return Numbers.fromDecimals(
			(await this.params.contract
				.getContract()
				.methods.minimumRaise()
				.call()),
			await this.getTradingDecimals()
		);
	}

	/**
	 * @function hasMinimumRaise
	 * @description See if hasMinimumRaise 
	 * @returns {Boolean} 
	 */
	async hasMinimumRaise() {
		return await this.params.contract
			.getContract()
			.methods.hasMinimumRaise()
			.call();
	}

	/**
	 * @function minimumReached
	 * @description See if minimumRaise was Reached
	 * @returns {Integer}
	 */
	async minimumReached() {
		let hasMinimumRaise = await this.hasMinimumRaise();
		if (hasMinimumRaise) {
			let tokensAllocated = await this.tokensAllocated();
			let minimumRaise = await this.minimumRaise();
			return parseFloat(tokensAllocated) > parseFloat(minimumRaise);
		} else {
			return true;
		}
	}

	/**
	 * @function tokensAllocated
	 * @description Get Total tokens spent in the contract, therefore the tokens bought until now
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensAllocated() {
		return Numbers.fromDecimals(
			(await this.params.contract
				.getContract()
				.methods.tokensAllocated()
				.call()),
			await this.getTradingDecimals()
		);
	}

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
	 * @function withdrawFunds
	 * @description Withdraw all funds from tokens sold
	 */
	withdrawFunds = async () => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.withdrawFunds()
		);
	};

	/**
	 * @function setSignerPublicAddress
	 * @description Set the public address of the signer
	 * @param {string} address
	 */
	setSignerPublicAddress = async ({ address }) => {
		try {
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.setSignerPublicAddress(address)
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	 * @function signerPublicAddress
	 * @description Get the public address of the signer
	 * @returns {string} address
	 */

	async signerPublicAddress() {
		return await this.params.contract.getContract().methods.signerPublicAddress().call();
	}

	/**
	 * @function withdrawableFunds
	 * @description Get Total funds raised to be withdrawn by the admin
	 * @returns {Integer} Amount in ETH
	 */
	async withdrawableFunds() {
		var res = 0;
		var hasFinalized = await this.hasFinalized();
		var wasMinimumRaiseReached = await this.minimumReached();
		if (hasFinalized && wasMinimumRaiseReached) {
			res = await this.getBalance();
		}
		return res;
	}

	/**
	 * @function hasWhitelisting
	 * @description Verify if swap has whitelisting
	 * @returns {Boolean}
	 */
	async hasWhitelisting() {
		return await this.params.contract
			.getContract()
			.methods.hasWhitelisting()
			.call();
	}

	/**
	 * @function isWhitelisted
	 * @description Verify if address is whitelisted
	 * @param {string} address
	 * @returns {Boolean}
	 */
	async isWhitelisted({ address }) {
		let res = await this.params.contract
			.getContract()
			.methods.isWhitelisted(address)
			.call();
		return res == true ? true : false;
	}

	/**
	 * @function wereUnsoldTokensReedemed
	 * @description Verify if the admin already reemeded unsold tokens
	 * @returns {Boolean}
	 */
	async wereUnsoldTokensReedemed() {
		try {
			return await this.params.contract
				.getContract()
				.methods.unsoldTokensRedeemed()
				.call();
		} catch (e) {
			console.error(e);
		}
		return await this.params.contract
			.getContract()
			.methods.unsoldTokensReedemed()
			.call();
	}

	/**
	 * @function isOpen
	 * @description Verify if the Token Sale is Open for Swap
	 * @returns {Boolean}
	 */
	async isOpen() {
		return await this.params.contract.getContract().methods.isOpen().call();
	}

	/**
	 * @function hasStarted
	 * @description Verify if the Token Sale has started the Swap
	 * @returns {Boolean}
	 */
	async hasStarted() {
		return await this.params.contract
			.getContract()
			.methods.hasStarted()
			.call();
	}

	/**
	 * @function hasFinalized
	 * @description Verify if the Token Sale has finalized, if the current date is after endDate
	 * @returns {Boolean}
	 */
	async hasFinalized() {
		return await this.params.contract
			.getContract()
			.methods.hasFinalized()
			.call();
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
	/**
	 * @function isETHTrade
	 * @description Verify if Token Sale is against Ethereum
	 * @returns {Boolean}
	 */
	async isETHTrade() {
		return await this.params.contract
			.getContract()
			.methods.isETHTrade()
			.call();
	}

	/**
	 * @function getTradingDecimals
	 * @description Get Trading Decimals (18 if isETHTrade, X if not)
	 * @returns {Integer}
	 */
	async getTradingDecimals() {
		const tradeAddress = await this.getTradingERC20Address();
		if (tradeAddress == '0x0000000000000000000000000000000000000000') {
			return 18;
		}
		const contract = new ERC20TokenContract({
			web3: this.web3,
			contractAddress: tradeAddress,
			acc: this.acc
		});
		return await contract.getDecimals();
	}

	/**
	 * @function getTradingERC20Address
	 * @description Get Trading Address if ERC20
	 * @returns {Address}
	 */
	async getTradingERC20Address() {
		try {
			return await this.params.contract
				.getContract()
				.methods.erc20TradeIn()
				.call();
		} catch (e) {
			// Swap v2
			return '0x0000000000000000000000000000000000000000';
		}
	}

	/**
	 * @function isPreStart
	 * @description Verify if the Token Sale in not open yet
	 * @returns {Boolean}
	 */
	async isPreStart() {
		return await this.params.contract
			.getContract()
			.methods.isPreStart()
			.call();
	}

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
					await this.getPurchase({purchaseId: Number(id)})
				);
			}
		};
		return purchases;
	};

	/**
	 * @function getPurchase
	 * @description Get Purchase based on ID
	 * @param {Integer} purchase_id
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
	 * @function getWhiteListedAddresses
	 * @description Get Whitelisted Addresses
	 * @returns {Array | Address} addresses
	 */

	getWhitelistedAddresses = async () =>
		await this.params.contract.getContract().methods.getWhitelistedAddresses().call();

	/**
	 * @function getBuyers
	 * @description Get Buyers
	 * @returns {Array | Integer} _ids
	 */

	getBuyers = async () =>
		await this.params.contract.getContract().methods.getBuyers().call();

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
		let res = await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.getMyPurchases(address),
			true
		);
		return res.map((id) => Numbers.fromHex(id));
	};

	/**
	 * @function getIsClaimedCategoryForUser
	 * @param {Address} address
	 * @param {Number} categoryId
	 * @returns {boolean} claimed 
	 */
	getIsClaimedCategoryForUser = async ({ address, categoryId }) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.getIsClaimedCategoryForUser(address, categoryId),
			true
		);
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

	/* Legacy Call */
	getETHCostFromTokens = () => { throw new Error("Please use 'getCost' instead") };

	/* POST User Functions */

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

		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.swapWithSig(tokenAmount, categoryId, maxAllocation, signature),
			false,
			await this.isETHTrade() ? costToDecimals : 0,
			callback
		);
	};

	/**
	 * @function redeemGivenMinimumGoalNotAchieved
	 * @variation isStandard
	 * @description Reedem Ethereum from sale that did not achieve minimum goal
	 * @param {Integer} purchase_id
	 */
	redeemGivenMinimumGoalNotAchieved = async ({ purchase_id }) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract
				.getContract()
				.methods.redeemGivenMinimumGoalNotAchieved(purchase_id)
		);
	};


	/**
	 * @function setUserClaimedCategory
	 * @type admin
	 * @param {Address} address
	 * @param {Number} categoryId
	 * @description Sets user claimed category
	 */
	setUserClaimedCategory = async ({ address, categoryId }) => {
		await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.setUserClaimedCategory(address, categoryId)
		);
	};

	/**
	 * @function setIndividualMaximumAmount
	 * @type admin
	 * @param {Integer} individualMaximumAmount
	 * @description Modifies the max allocation
	 */
	setIndividualMaximumAmount = async ({ individualMaximumAmount }) => {
		const maxAmount = Numbers.toSmartContractDecimals(
			individualMaximumAmount,
			await this.getTradingDecimals()
		);
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.setIndividualMaximumAmount(maxAmount)
		);
	};

	/**
	 * @function setEndDate
	 * @type admin
	 * @param {Date} endDate
	 * @description Modifies the end date for the pool
	 */
	setEndDate = async ({ endDate }) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.setEndDate(Numbers.timeToSmartContractTime(endDate))
		);
	};

	/**
	 * @function setStartDate
	 * @type admin
	 * @param {Date} startDate
	 * @description Modifies the start date for the pool
	 */
	setStartDate = async ({ startDate }) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.setStartDate(Numbers.timeToSmartContractTime(startDate))
		);
	}

	/**
	 * @function setDistributionDate
	 * @type admin
	 * @param {Date} distributionDate
	 * @description Modifies the distribution date for the pool
	 */
	setDistributionDate = async ({ distributionDate }) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.setDistributionDate(Numbers.timeToSmartContractTime(distributionDate))
		);
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
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.setCategories(
				categoryIds,
				categoriesSupply,
				categoriesPrice
			)
		);
	}

	/**
	 * @function setHasWhitelisting
	 * @type admin
	 * @param {boolean} hasWhitelist
	 * @description Modifies if the pool has whitelisting or not
	 */
	setHasWhitelisting = async ({ hasWhitelist }) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.setHasWhitelisting(hasWhitelist)
		);
	}

	/**
	 * @function approveSwapERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the investor to use approved tokens for the sale
	 */
	approveSwapERC20 = async ({ tokenAmount, callback }) => {
		if (await this.isETHTrade()) { throw new Error("Funcion only available to ERC20 Trades") };
		return await this.params.tradingERC20Contract.approve({
			address: this.getAddress(),
			amount: tokenAmount,
			callback
		});
	};

	/**
	 * @function isApprovedSwapERC20
	 * @param {Integer} tokenAmount
	 * @param {Address} address
	 * @description Verify if it is approved to invest
	 */
	isApprovedSwapERC20 = async ({ tokenAmount, address, callback }) => {
		if (await this.isETHTrade()) { throw new Error("Funcion only available to ERC20 Trades") };
		return await this.params.tradingERC20Contract.isApproved({
			address,
			spenderAddress: this.getAddress(),
			amount: tokenAmount,
			callback
		});
	};

	/**
	 * @function isApproved
	 * @description Verify if the Admin has approved the pool to use receive the tokens for sale
	 * @param {Integer} tokenAmount
	 * @param {Address} address
	 * @returns {Boolean}
	 */
	isApproved = async ({ tokenAmount, address }) => {
		return await this.getTokenContract().isApproved({
			address: address,
			amount: tokenAmount,
			spenderAddress: this.getAddress()
		});
	};

	/**
	 * @function addWhitelistedAddress
	 * @description add WhiteListed Address
	 * @param { Array | Addresses} Addresses
	 */
	addWhitelistedAddress = async ({ addresses }) => {

		if (!addresses || !addresses.length || addresses.length == 0) {
			throw new Error("Addresses not well setup");
		}

		let oldAddresses = await this.getWhitelistedAddresses();
		addresses = addresses.map(a => String(a).toLowerCase())
		oldAddresses = oldAddresses.map(a => String(a).toLowerCase());
		var addressesClean = [];

		addresses = addresses.filter((item) => {
			if (
				(oldAddresses.indexOf(item) < 0) &&
				(addressesClean.indexOf(item) < 0)
			) {
				// Does not exist
				addressesClean.push(item);
			}
		})

		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.add(addressesClean)
		);
	};

	/**
	 * @function removeWhitelistedAddress
	 * @param { Array | Addresses} addresses
	 * @param {Integer} index
	 * @description remove WhiteListed Address
	 */
	removeWhitelistedAddress = async ({ address, index }) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.remove(address, index)
		);
	};


	/**
	 * @function safePull
	 * @description Safe Pull all tokens & ETH
	 */
	safePull = async () => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract.getContract().methods.safePull(),
			null,
			0
		);
	};

	/**
	 * @function removeOtherERC20Tokens
	 * @description Remove Tokens from other ERC20 Address (in case of accident)
	 * @param {Address} tokenAddress
	 * @param {Address} toAddress
	 */
	removeOtherERC20Tokens = async ({ tokenAddress, toAddress }) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract
				.getContract()
				.methods.removeOtherERC20Tokens(tokenAddress, toAddress)
		);
	};

	__assert() {
		this.params.contract.use(fixednftswap, this.getAddress());
	}

	getDecimals = async () => {
		return await this.getTokenContract().getDecimals();
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
		console.log('Params', params);
		let res = await this.__deploy(params, callback);
		this.params.contractAddress = res.contractAddress;
		/* Call to Backend API */

		this.__assert();
		return res;
	};

	getAddress() {
		return this.params.contractAddress;
	}

	getTokenAddress() {
		return this.getTokenContract().getAddress();
	}

	getTokenContract() {
		return this.params.tradingERC20Contract;
	}

	/**
	 * @function getSmartContractVersion
	 * @description Returns the version of the smart contract that is currently inside psjs
	 * @param {Address} Address
	 */
	getSmartContractVersion = async () => {
		return await this.params.contract.getContract().methods.getAPIVersion().call();
	}

	/**
	 * @function getBalance
	 * @description Get Balance of Contract
	 * @param {Integer} Balance
	 */
	getBalance = async () => {
		if (await this.isETHTrade()) {
			let wei = await this.web3.eth.getBalance(this.getAddress());
			return this.web3.utils.fromWei(wei, 'ether');
		} else {
			return await this.getTokenContract().getTokenAmount(this.getAddress());
		}

	};
}

export default FixedNFTSwapContract;
