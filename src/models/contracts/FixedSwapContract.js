import { fixedswap } from "../../interfaces";
import Contract from "../base/Contract";
import ERC20TokenContract from "../base/ERC20TokenContract";
import IDOStaking from "./IDOStaking";
import Numbers from "../../utils/Numbers";
import _ from "lodash";
import moment from 'moment';
const RESIDUAL_ETH = 0.00001;
import { Decimal } from 'decimal.js';
import * as ethers from 'ethers';
import Client from "../../utils/Client";
import DeploymentService from "../../services/DeploymentService";
import BaseSwapContract from "./base/BaseSwapContract";

/**
 * Fixed Swap Object
 * @constructor FixedSwapContract
 * @param {Web3} web3
 * @param {Address} tokenAddress
 * @param {Address} contractAddress ? (opt)
 * @extends BaseSwapContract
 */
class FixedSwapContract extends BaseSwapContract {
	constructor({
		web3,
		tokenAddress,
		contractAddress = null /* If not deployed */,
		acc,
	}) {
		super({ web3, contractAddress, acc, contractInterface: fixedswap });
		try {
			if (tokenAddress) {
				this.params.erc20TokenContract = new ERC20TokenContract({
					web3: web3,
					contractAddress: tokenAddress,
					acc
				});
			}
		} catch (err) {
			throw err;
		}
	}

	/**
	* @function deploy
	* @description Deploy the Pool Contract
	* @param {Float} tradeValue Buy price
	* @param {Float=} swapRatio Instead of the tradeValue you can optionally send the swap ratio, how much tokens for 1 eth/bnb (Default: null)
	* @param {Float} tokensForSale Tokens for sale
	* @param {String} endDate End date
	* @param {String} startDate Start date
	* @param {String=} ERC20TradingAddress Token to use in the swap (Default: 0x0000000000000000000000000000000000000000)
	* @param {Float=} individualMinimumAmount Min cap per wallet. 0 to disable it. (Default: 0)
	* @param {Float=} individualMaximumAmount Max cap per wallet. 0 to disable it. (Default: 0)
	* @param {Boolean=} isTokenSwapAtomic Receive tokens right after the swap. (Default: false)
	* @param {Float=} minimumRaise Soft cap (Default: 0)
	* @param {Float=} feeAmount Fee amount (Default: 1)
	* @param {Number=} tradingDecimals To be the decimals of the currency in case (ex : USDT -> 9; ETH -> 18) (Default: 0)
	* @param {Boolean=} hasWhitelisting Has White Listing. (Default: false)
	* @param {Boolean=} isPOLSWhitelist Has White Listing. (Default: false)
	* @param {Boolean=} allowSaleStartWithoutFunding Allow Funding after sale starts. (Default: false)
	* @param {Boolean=} allowLateVestingChange Allow vesting changes after sale starts. (Default: false)
	*/
	deploy = async ({
		tradeValue,
		swapRatio = null,
		tokensForSale,
		startDate,
		endDate,
		individualMinimumAmount = 0,
		individualMaximumAmount = 0,
		isTokenSwapAtomic = false,
		minimumRaise = 0,
		feeAmount = 1,
		hasWhitelisting = false,
		callback,
		ERC20TradingAddress = '0x0000000000000000000000000000000000000000',
		isPOLSWhitelist = false,
		tradingDecimals = 0, /* To be the decimals of the currency in case (ex : USDT -> 9; ETH -> 18) */
		allowSaleStartWithoutFunding = false,
		allowLateVestingChange = false,
	}) => {

		if (_.isEmpty(this.getTokenAddress())) {
			throw new Error("Token Address not provided");
		}
		if (tradeValue <= 0) {
			throw new Error("Trade Value has to be > 0");
		}
		if (tokensForSale <= 0) {
			throw new Error("Tokens for Sale has to be > 0");
		}
		if (feeAmount < 1) {
			throw new Error("Fee Amount has to be >= 1");
		}
		if (minimumRaise != 0 && (minimumRaise > tokensForSale)) {
			throw new Error("Minimum Raise has to be smaller than total Raise")
		}
		if (Date.parse(startDate) >= Date.parse(endDate)) {
			throw new Error("Start Date has to be smaller than End Date")
		}
		if (Date.parse(startDate) <= Date.parse(moment(Date.now()).add(2, 'm').toDate())) {
			throw new Error("Start Date has to be higher (at least 2 minutes) than now")
		}
		if (individualMaximumAmount < 0) {
			throw new Error("Individual Maximum Amount should be bigger than 0")
		}
		if (individualMinimumAmount < 0) {
			throw new Error("Individual Minimum Amount should be bigger than 0")
		}

		if (individualMaximumAmount > 0) {
			/* If exists individualMaximumAmount */
			if (individualMaximumAmount <= individualMinimumAmount) {
				throw new Error("Individual Maximum Amount should be bigger than Individual Minimum Amount")
			}
			if (individualMaximumAmount > tokensForSale) {
				throw new Error("Individual Maximum Amount should be smaller than total Tokens For Sale")
			}
		}

		if (ERC20TradingAddress != '0x0000000000000000000000000000000000000000' && tradingDecimals == 0) {
			throw new Error("If an ERC20 Trading Address please add the 'tradingDecimals' field to the trading address (Ex : USDT -> 6)");
		} else if (ERC20TradingAddress == '0x0000000000000000000000000000000000000000'){
			/* is ETH Trade */
			tradingDecimals = 18;
		}

		if (individualMaximumAmount == 0) {
			individualMaximumAmount = tokensForSale; /* Set Max Amount to Unlimited if 0 */
		}

		const FLAG_isTokenSwapAtomic = 1;            // Bit 0
		const FLAG_hasWhitelisting = 2;              // Bit 1
		const FLAG_isPOLSWhitelisted = 4;            // Bit 2 - true => user must have a certain amount of POLS staked to participate
		const FLAG_allowSaleStartWithoutFunding = 8; // Bit 3 - true => sale can start before the contract is funded
		const FLAG_allowLateVestingChanged = 16;     // Bit 4 - true => vesting can be changed after sale start

		const flags = (isTokenSwapAtomic ? FLAG_isTokenSwapAtomic : 0) | 
									(hasWhitelisting ? FLAG_hasWhitelisting : 0) | 
									(isPOLSWhitelist ? FLAG_isPOLSWhitelisted : 0) |
									(allowSaleStartWithoutFunding ? FLAG_allowSaleStartWithoutFunding : 0) |
									(allowLateVestingChange ? FLAG_allowLateVestingChanged : 0)

		let params = [
			this.getTokenAddress(),
			swapRatio != null ? Numbers.toSmartContractDecimals(Numbers.safeDivide(1, swapRatio), tradingDecimals) : Numbers.toSmartContractDecimals(tradeValue, tradingDecimals),
			Numbers.toSmartContractDecimals(tokensForSale, await this.getDecimals()),
			Numbers.timeToSmartContractTime(startDate),
			Numbers.timeToSmartContractTime(endDate),
			Numbers.toSmartContractDecimals(
				individualMinimumAmount,
				await this.getDecimals()
			),
			Numbers.toSmartContractDecimals(
				individualMaximumAmount,
				await this.getDecimals()
			),
			true, // ignored
			Numbers.toSmartContractDecimals(minimumRaise, await this.getDecimals()),
			parseInt(feeAmount),
			flags,
			ERC20TradingAddress,
		];

		let res = await new DeploymentService().deploy(
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

	assertERC20Info = async () => {
		let tokenAddress = await this.erc20();
		this.params.erc20TokenContract = new ERC20TokenContract({
			web3: this.web3,
			contractAddress: tokenAddress,
			acc: this.acc
		});
		if (!(await this.isETHTrade())) {
			this.params.tradingERC20Contract = new ERC20TokenContract({
				web3: this.web3,
				contractAddress: await this.getTradingERC20Address(),
				acc: this.acc
			});
		};
	}

	/**
	 * @function setStakingRewards
	 * @type admin
	 * @description Sets the staking rewards address
	 * @param {string} address
	 */
	async setStakingRewards({ address }) {
		await this.executeContractMethod(
			this.getContractMethods().setStakingRewards(address)
		);
		return true;
	}

	/**
	 * @function getIDOStaking
	 * @description Returns the contract for the ido staking
	 * @returns {IDOStaking}
	 */
	async getIDOStaking() {
		const contractAddr = await this.getContractMethods().stakingRewardsAddress().call();
		if (contractAddr == '0x0000000000000000000000000000000000000000') {
			return null;
		}
		return new IDOStaking({
			acc: this.acc,
			web3: this.web3,
			contractAddress: contractAddr
		});
	}

	/**
	 * @function erc20
	 * @description Get Token Address
	 * @returns {Address} Token Address
	 */
	async erc20() {
		return await this.params.contract
			.getContract()
			.methods.erc20()
			.call();
	}

	/* Get Functions */
	/**
	 * @function tradeValue
	 * @description Get trade value for the pool
	 * @returns {Integer} trade value against ETH
	 */
	async tradeValue() {
		return Numbers.fromDecimals(
			(await this.params.contract
				.getContract()
				.methods.tradeValue()
				.call()),
			await this.getTradingDecimals()
		);
	}

	/**
	 * @function swapRatio
	 * @description Get swap ratio for the pool
	 * @returns {Integer} trade value against 1 ETH
	 */
	 async swapRatio() {
		return Numbers.safeDivide(1, Numbers.fromDecimals(
			(await this.params.contract
				.getContract()
				.methods.tradeValue()
				.call()),
			await this.getTradingDecimals()
		));
	}

	/**
	 * @function refundPeriodStart
	 * @description Get Refund Start Date
	 * @returns {Date}
	 */
	async refundPeriodStart() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.getContractMethods().refundPeriodStart().call()
		);
	}

	/**
	 * @function refundPeriodEnd
	 * @description Get Refund Start Date
	 * @returns {Date}
	 */
	async refundPeriodEnd() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.getContractMethods().refundPeriodEnd().call()
		);
	}

	/**
	 * @function refundPercentage
	 * @description Get Penalty Percentage
	 * @returns {Integer}
	 */
	async refundPercentage() {
		return await this.getContractMethods().refundPercentage().call()
	}

	/**
	 * @function vestingStart
	 * @description Get Start Date of the Vesting
	 * @returns {Date}
	 */
	async vestingStart() {
		try {
			return Numbers.fromSmartContractTimeToMinutes(
				await this.getContractMethods().vestingStart().call()
			);
		} catch (e) {
			// Swap v2
			return await this.endDate();
		}
	}

	/**
	 * @function individualMinimumAmount
	 * @description Get Individual Minimum Amount for each address
	 * @returns {Integer}
	 */
	async individualMinimumAmount() {
		return Numbers.fromDecimals(
			await this.params.contract
				.getContract()
				.methods.individualMinimumAmount()
				.call(),
			await this.getDecimals()
		);
	}

	/**
	 * @function tokensForSale
	 * @description Get Total tokens Allocated/In Sale for the Pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensForSale() {
		return Numbers.fromDecimals(
			await this.params.contract
				.getContract()
				.methods.tokensForSale()
				.call(),
			await this.getDecimals()
		);
	}

	/**
	 * @function tokensAvailable
	 * @description Get Total tokens owned by the Pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensAvailable() {
		return Numbers.fromDecimals(
			await this.params.contract
				.getContract()
				.methods.availableTokens()
				.call(),
			await this.getDecimals()
		);
	}

	/**
	 * @function tokensLeft
	 * @description Get Total tokens available to be sold in the pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensLeft() {
		return Numbers.fromDecimals(
			await this.params.contract
				.getContract()
				.methods.tokensLeft()
				.call(),
			await this.getDecimals()
		);
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
			await this.getDecimals()
		);
	}

	/**
	 * @function withdrawableUnsoldTokens
	 * @description Get Total tokens available to be withdrawn by the admin
	 * @returns {Integer} Amount in Tokens
	 */
	async withdrawableUnsoldTokens() {
		var res = 0;
		if (await this.hasFinalized()
			&& !(await this.wereUnsoldTokensReedemed())
		) {
			if (await this.minimumReached()) {
				/* Minimum reached */
				res = (await this.tokensForSale()) - (await this.tokensAllocated());
			} else {
				/* Minimum reached */
				res = await this.tokensForSale();
			}
		}
		return res;
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
			await this.getDecimals()
		);
	}

	/**
	 * @function isTokenSwapAtomic
	 * @description Verify if the Token Swap is atomic on this pool
	 * @returns {Boolean}
	 */
	async isTokenSwapAtomic() {
		return await this.params.contract
			.getContract()
			.methods.isTokenSwapAtomic()
			.call();
	}

	/**
	 * @function isFunded
	 * @description Verify if the Token Sale is Funded with all Tokens proposed in tokensForSale
	 * @returns {Boolean}
	 */
	async isFunded() {
		return await this.params.contract
			.getContract()
			.methods.isSaleFunded()
			.call();
	}

	/**
	 * @function isPOLSWhitelisted
	 * @description Verify if Token Sale is POLS Whitelisted
	 * @returns {Boolean}
	 */
	async isPOLSWhitelisted() {
		return await this.params.contract
			.getContract()
			.methods.isPOLSWhitelisted()
			.call();
	}

	/**
	 * @function isAddressPOLSWhitelisted
	 * @description Verify if Address is Whitelisted by POLS (returns false if not needed)
	 * @returns {Boolean}
	 */
	async isAddressPOLSWhitelisted() {
		return await this.params.contract
			.getContract()
			.methods.isAddressPOLSWhitelisted()
			.call();
	}

	/**
	 * @function getCurrentSchedule
	 * @description Gets Current Schedule
	 * @returns {Integer}
	 */
	async getCurrentSchedule() {
		return parseInt(await this.params.contract
			.getContract()
			.methods.getCurrentSchedule()
			.call());
	}

	/**
	 * @function getVestingSchedule
	 * @description Gets Vesting Schedule
	 * @param {Integer} Position Get Position of Integer 
	 * @returns {Array | Integer}
	 */
	async getVestingSchedule({ position }) {
		return parseInt(await this.params.contract
			.getContract()
			.methods.vestingSchedule(position)
			.call());
	}

	/**
	 * @function getPurchase
	 * @description Get Purchase based on ID
	 * @param {Integer} purchase_id
	 * @returns {Integer} _id
	 * @returns {Integer} amount
	 * @returns {Address} purchaser
	 * @returns {Integer} costAmount
	 * @returns {Date} timestamp
	 * @returns {Integer} amountReedemed
	 * @returns {Boolean} wasFinalized
	 * @returns {Boolean} reverted
	 */

	getPurchase = async ({ purchase_id }) => {
		let res = await this.params.contract
			.getContract()
			.methods.getPurchase(purchase_id)
			.call();

		let amount = Numbers.fromDecimals(res.amount, await this.getDecimals());
		let costAmount = Numbers.fromDecimals(res.costAmount, await this.getTradingDecimals());
		let amountReedemed = Numbers.fromDecimals(res.amountRedeemed, await this.getDecimals());
		let amountLeftToRedeem = amount - amountReedemed;

		let isFinalized = await this.hasFinalized();
		let amountToReedemNow = 0;
		try {
			amountToReedemNow = isFinalized ? Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.getRedeemableTokensAmount(purchase_id).call()).amount, await this.getDecimals()) : 0
		} catch (e) {
			// Swap v2
			const abi = JSON.parse('[{ "inputs": [ { "internalType": "uint256", "name": "purchase_id", "type": "uint256" } ], "name": "getPurchase", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "bool" }, { "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }]');
			const contract = new Contract(this.web3, { abi }, this.params.contractAddress);
			res = await contract
				.getContract()
				.methods.getPurchase(purchase_id)
				.call();

			lastTrancheSent = parseInt(res[5]);
			amount = Numbers.fromDecimals(res[0], await this.getDecimals());
			costAmount = Numbers.fromDecimals(res[2], await this.getTradingDecimals());
			amountReedemed = Numbers.fromDecimals(res[4], await this.getDecimals());
			amountLeftToRedeem = amount - amountReedemed;

			let currentSchedule = await this.getCurrentSchedule();
			let lastTrancheSent = parseInt(res[5]);
			for (var i = lastTrancheSent + 1; i <= currentSchedule; i++) {
				amountToReedemNow = amountToReedemNow + amount * (await this.getVestingSchedule({ position: i })) / 10000
			}
			return {
				_id: purchase_id,
				amount: amount,
				purchaser: res[1],
				costAmount: costAmount,
				timestamp: Numbers.fromSmartContractTimeToMinutes(res[3]),
				amountReedemed: amountReedemed,
				amountLeftToRedeem: amountLeftToRedeem,
				amountToReedemNow: isFinalized ? amountToReedemNow : 0,
				lastTrancheSent: lastTrancheSent,
				wasFinalized: res[6],
				reverted: res[7],
			};
		}

		// ToDo add a test for amountToReedemNow
		return {
			_id: purchase_id,
			amount: amount,
			purchaser: res.purchaser,
			costAmount: costAmount,
			timestamp: Numbers.fromSmartContractTimeToMinutes(res.timestamp),
			amountReedemed: amountReedemed,
			amountLeftToRedeem: amountLeftToRedeem,
			amountToReedemNow,
			wasFinalized: res.wasFinalized,
			reverted: res.reverted,
		};
	};

	/**
	 * @function getWhiteListedAddresses
	 * @description Get Whitelisted Addresses
	 * @returns {Array | Address} addresses
	 */

	getWhitelistedAddresses = async () =>
		await this.getContractMethods().getWhitelistedAddresses().call();

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
		try {
			let res = await this.params.contract
				.getContract()
				.methods.getPurchasesCount()
				.call();
			let ids = [];
			for (let i = 0; i < res; i++) {
				ids.push(i);
			}
			return ids;
		} catch (e) {
			// Swap v2
			// ToDo Refactor
			const abi = JSON.parse('[{ "constant": true, "inputs": [], "name": "getPurchaseIds", "outputs": [ { "name": "", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }]');
			const contract = new Contract(this.web3, { abi }, this.params.contractAddress);
			let res = await contract
				.getContract()
				.methods.getPurchaseIds()
				.call();
			return res.map((id) => Numbers.fromHex(id))
		}
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

	/**
	 * @function getCostFromTokens
	 * @description Get Cost from Tokens Amount
	 * @param {Integer} tokenAmount
	 * @returns {Integer} costAmount
	 */
	getCostFromTokens = async ({ tokenAmount }) => {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			await this.getDecimals()
		);

		return Numbers.fromDecimals(
			await this.params.contract
				.getContract()
				.methods.cost(amountWithDecimals)
				.call(),
			await this.getTradingDecimals()
		);
	};

	/**
	 * @function getDistributionInformation
	 * @description Get Distribution Information
	 * @returns {Integer} currentSchedule (Ex : 1)
	 * @returns {Integer} vestingTime (Ex : 1)
	 * @returns {Array | Integer} vestingSchedule (Ex : [100])
	 * @returns {Date} vestingStart
	 */
	getDistributionInformation = async () => {

		let currentSchedule = 0;
		if (await this.hasStarted()) {
			currentSchedule = parseInt(await this.getCurrentSchedule());
		}
		let vestingTime = parseInt(await this.getContractMethods().vestingTime().call());
		let legacy = false;
		try {
			await this.getSmartContractVersion();
		} catch (e) {
			legacy = true;
		}

		let vestingSchedule = [];

		if (legacy) {
			for (var i = 1; i <= vestingTime; i++) {
				let a = parseInt(await this.getVestingSchedule({ position: i }));
				vestingSchedule.push(a);
			}
		} else {
			for (var i = 1; i < vestingTime; i++) {
				let a = parseInt(await this.getVestingSchedule({ position: i - 1 }));
				vestingSchedule.push(a);
			}
		}

		const vestingStart = await this.vestingStart();


		return {
			currentSchedule,
			vestingTime,
			vestingSchedule,
			vestingStart
		}
	}



	/* Legacy Call */
	getETHCostFromTokens = () => { throw new Error("Please use 'getCostFromTokens' instead") };

	/* POST User Functions */

	/**
	 * @function swapWithSig
	 * @description Swap tokens by Ethereum or ERC20
	 * @param {Integer} tokenAmount
	 * @param {string} accountMaxAmount Max alloc in wei
	 * @param {string=} signature Signature for the offchain whitelist
	*/
	swapWithSig = async ({ tokenAmount, callback, signature, accountMaxAmount }) => {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			await this.getDecimals()
		);

		let cost = await this.getCostFromTokens({
			tokenAmount,
		});

		let costToDecimals = Numbers.toSmartContractDecimals(cost, await this.getTradingDecimals());

		if (!signature) {
			signature = '0x00';
		}
		
		return await this.executeContractMethod(
			this.getContractMethods().swapWithSig(amountWithDecimals, accountMaxAmount, signature),
			false,
			await this.isETHTrade() ? costToDecimals : 0,
			callback
		);
	}

	/**
	 * @function swap
	 * @description Swap tokens by Ethereum or ERC20
	 * @param {Integer} tokenAmount
	 * @param {string=} signature Signature for the offchain whitelist
	*/
	swap = async ({ tokenAmount, callback, signature }) => {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			await this.getDecimals()
		);

		let cost = await this.getCostFromTokens({
			tokenAmount,
		});

		let costToDecimals = Numbers.toSmartContractDecimals(cost, await this.getTradingDecimals());

		if (!signature) {
			signature = '0x00';
		}

		return await this.executeContractMethod(
			this.getContractMethods().swap(amountWithDecimals, signature),
			false,
			await this.isETHTrade() ? costToDecimals : 0,
			callback
		);
	};

	__oldSwap = async ({ tokenAmount, callback }) => {
		console.log("swap (tokens Amount)", tokenAmount);
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			await this.getDecimals()
		);

		let cost = await this.getCostFromTokens({
			tokenAmount,
		});
		console.log("cost in ETH (after getCostFromTokens) ", cost);

		let costToDecimals = Numbers.toSmartContractDecimals(cost, await this.getTradingDecimals());

		console.log("swap (amount in decimals) ", amountWithDecimals);
		console.log("cost (amount in decimals) ", costToDecimals);

		const abi = JSON.parse('[{ "constant": false, "inputs": [ { "name": "_amount", "type": "uint256" } ], "name": "swap", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }]');
		const contract = new Contract(this.web3, { abi }, this.params.contractAddress);

		return await this.executeContractMethod(
			contract.getContract().methods.swap(amountWithDecimals),
			false,
			await this.isETHTrade() ? costToDecimals : 0,
			callback
		);
	};

	/**
	 * @function redeemTokens
	 * @variation isStandard
	 * @description Reedem tokens bought
	 * @param {Integer} purchase_id
	 * @param {Boolean=} stake If true send token to the ido staking contract
	 */
	redeemTokens = async ({ purchase_id, stake = false }) => {
		let legacy = false;
		try {
			await this.getSmartContractVersion();
		} catch (e) {
			legacy = true;
		}
		if (legacy) {
			// Swap v2
			const abi = JSON.parse('[{ "constant": false, "inputs": [ { "name": "purchase_id", "type": "uint256" } ], "name": "redeemTokens", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]');
			const contract = new Contract(this.web3, { abi }, this.params.contractAddress);
			return await this.executeContractMethod(
				contract.getContract().methods.redeemTokens(purchase_id)
			);
		}
		return await this.executeContractMethod(
			this.getContractMethods().transferTokens(purchase_id, stake)
		);
	};

	/**
	 * @function withdrawUnsoldTokens
	 * @description Withdraw unsold tokens of sale
	 */

	withdrawUnsoldTokens = async () => {
		return await this.executeContractMethod(
			this.getContractMethods().withdrawUnsoldTokens()
		);
	};

	/**
	 * @function approveFundERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the pool to use approved tokens for sale
	 */
	approveFundERC20 = async ({ tokenAmount, callback }) => {
		return await this.getTokenContract().approve({
			address: this.getAddress(),
			amount: tokenAmount,
			callback
		});
	};

	/**
	 * @function setVesting
	 * @type admin
   * @param {Number=} tgeAllocation % of allocation (12 fixed point decimals) at tgeTime (only linear vesting)
   * @param {Number=} tgeTime time of TGE (Token Generation Event) (only linear vesting)
	 * @param {Array<Integer>=} vestingSchedule Vesting schedule in %
	 * @param {String=} vestingStart Vesting start date (Default: endDate)
	 * @param {Number=} vestingCliff Seconds between every vesting schedule (Default: 0)
	 * @param {Number=} vestingDuration Vesting duration (Default: 0)
	 * @description Modifies the current vesting config
	 */
	setVesting = async ({
		tgeAllocation = 0,
		tgeTime,
		vestingSchedule = [],
		vestingStart,
		vestingCliff = 0,
		vestingDuration = 0,
		callback
	}) => {

		if (vestingSchedule.length > 0 && vestingSchedule.reduce((a, b) => a + b, 0) != 100) {
			throw new Error("'vestingSchedule' sum has to be equal to 100")
		}

		const DECIMALS_PERCENT_MUL = 10 ** 12;
		vestingSchedule = vestingSchedule.map(a => String(new Decimal(a).mul(DECIMALS_PERCENT_MUL)).toString());
		tgeAllocation =  String(new Decimal(tgeAllocation).mul(DECIMALS_PERCENT_MUL)).toString();

		return await this.executeContractMethod(
			this.getContractMethods().setVesting(
				tgeAllocation, 
				Numbers.timeToSmartContractTime(tgeTime), 
				Numbers.timeToSmartContractTime(vestingStart),	
				vestingCliff, 
				vestingDuration,
				vestingSchedule),
				null,
				null,
				callback
		);
	}

	/**
	 * @function fund
	 * @description Send tokens to pool for sale, fund the sale
	 * @param {Integer} tokenAmount
	 */
	fund = async ({ tokenAmount, callback }) => {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			await this.getDecimals()
		);

		return await this.executeContractMethod(
			this.getContractMethods().fund(amountWithDecimals),
			null,
			null,
			callback
		);
	};

	/**
	 * @function setTokenAddress
	 * @type admin
	 * @param {String} tokenAddress
	 * @description Sets a new token address
	 */
	setTokenAddress = async ({ tokenAddress }) => {
		return await this.executeContractMethod(
			this.getContractMethods().setSaleTokenAddress(tokenAddress)
		);
	};

	/**
	 * @function setRefundPeriod
	 * @type admin
	 * @param {Date} refundPeriodStart
	 * @param {Date} refundPeriodEnd
	 * @param {Integer} refundPercentage
	 * @description Sets (and enables) the refund period between 2 dates. Dates must be after Sale End Date. Prcentage should be between 0 and 100.
	 */
	setRefundPeriod = async ({ refundPeriodStart, refundPeriodEnd, refundPercentage }) => {
		let percentageWithDecimals = Numbers.toSmartContractDecimals(refundPercentage, 12);

		return await this.executeContractMethod(
			this.getContractMethods().setRefundPeriod(
				Numbers.timeToSmartContractTime(refundPeriodStart),
				Numbers.timeToSmartContractTime(refundPeriodEnd),
				percentageWithDecimals
			)
		);
	};


}

export default FixedSwapContract;
