import { fixedswap } from "../interfaces";
import Contract from "./Contract";
import ERC20TokenContract from "./ERC20TokenContract";
import Numbers from "../utils/Numbers";
import _ from "lodash";
import moment from 'moment';
const RESIDUAL_ETH = 0.00001;
import { Decimal } from 'decimal.js';
import * as ethers from 'ethers';

/**
 * Fixed Swap Object
 * @constructor FixedSwapContract
 * @param {Web3} web3
 * @param {Address} tokenAddress
 * @param {Address} contractAddress ? (opt)
 */
class FixedSwapContract {
	constructor({
		web3,
		tokenAddress,
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
				contract: new Contract(web3, fixedswap, contractAddress),
			};

			
			if(tokenAddress){
				this.params.erc20TokenContract = new ERC20TokenContract({
					web3: web3,
					contractAddress: tokenAddress,
					acc
				});
			}else{
				if(!contractAddress){throw new Error("Please provide a contractAddress if already deployed")}
			}
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
		let tokenAddress = await this.erc20();
		this.params.erc20TokenContract = new ERC20TokenContract({
			web3: this.web3,
			contractAddress: tokenAddress,
			acc : this.acc
		});
		if(!(await this.isETHTrade())){
			this.params.tradingERC20Contract = new ERC20TokenContract({
				web3: this.web3,
				contractAddress: await this.getTradingERC20Address(),
				acc : this.acc
			});	
		};
	}

	__metamaskCall = async ({ f, acc, value, callback=()=> {} }) => {
		return new Promise( (resolve, reject) => {
			// Detect possible error on tx
			f.estimateGas({gas: 5000000}, (error, gasAmount) => {
				//if(error){reject("Transaction will fail : " + error);}
				if(gasAmount >= 5000000){
					reject("Transaction will fail, too much gas");
				}

				// all alright
				f.send({
					from: acc,
					value: value,
				})
				.on("confirmation", (confirmationNumber, receipt) => {
					callback(confirmationNumber)
					if (confirmationNumber > 0) {
						resolve(receipt);
					}
				})
				.on("error", (err) => {
					reject(err);
				});
			});
		});
	};

	__sendTx = async (f, call = false, value, callback=()=>{}) => {
		var res;
		if (!this.acc && !call) {
			const accounts = await this.params.web3.eth.getAccounts();
			res = await this.__metamaskCall({ f, acc: accounts[0], value, callback });
		} else if (this.acc && !call) {
			let data = f.encodeABI();
			res = await this.params.contract.send(
				this.acc.getAccount(),
				data,
				value
			);
		} else if (this.acc && call) {
			res = await f.call({ from: this.acc.getAddress() });
		} else {
			res = await f.call();
		}
		return res;
	};

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
			return await this.__sendTx(
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
			return await this.__sendTx(
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
	isBlacklisted = async ({address}) => {
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
		return await this.__sendTx(
			this.params.contract.getContract().methods.pause()
		);
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

	/**
	 * @function unpauseContract
	 * @type admin
	 * @description Unpause Contract
	 */
	async unpauseContract() {
		return await this.__sendTx(
			this.params.contract.getContract().methods.unpause()
		);
	}

	/* Get Functions */
	/**
	 * @function tradeValue
	 * @description Get swapratio for the pool
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
	 * @function startDate
	 * @description Get Start Date of Pool
	 * @returns {Date}
	 */
	async startDate() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.params.contract.getContract().methods.startDate().call()
		);
	}

	/**
	 * @function endDate
	 * @description Get End Date of Pool
	 * @returns {Date}
	 */
	async endDate() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.params.contract.getContract().methods.endDate().call()
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
			await this.getDecimals()
		);
	}

	/**
	 * @function tokensAllocated
	 * @description Get Total tokens Allocated already, therefore the tokens bought until now
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
	 * @function hasMinimumRaise
	 * @description See if hasMinimumRaise 
	 * @returns {Boolea} 
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
	async wasMinimumRaiseReached() {
		let hasMinimumRaise = await this.hasMinimumRaise();
		if(hasMinimumRaise){
			let tokensAllocated = await this.tokensAllocated();
			let minimumRaise = await this.minimumRaise();
			return parseFloat(tokensAllocated) > parseFloat(minimumRaise);
		}else{
			return true;
		}
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
	 * @function setSignerPublicAddress
	 * @description Set the public address of the signer
	 * @param {string} address
	 */
	 setSignerPublicAddress = async ({ address }) => {
		try {
			return await this.__sendTx(
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
	 * @function withdrawableUnsoldTokens
	 * @description Get Total tokens available to be withdrawn by the admin
	 * @returns {Integer} Amount in Tokens
	 */
	async withdrawableUnsoldTokens() {
		var res = 0;
		if(await this.hasFinalized()
		&& !(await this.wereUnsoldTokensReedemed())
		){
			if(await this.wasMinimumRaiseReached()){
				/* Minimum reached */
				res = (await this.tokensForSale()) - (await this.tokensAllocated());
			}else{
				/* Minimum reached */
				res = await this.tokensForSale();
			}
		}
		return res;
	}

	/**
	 * @function withdrawableFunds
	 * @description Get Total funds raised to be withdrawn by the admin
	 * @returns {Integer} Amount in ETH
	 */
	async withdrawableFunds() {
		var res = 0;
		var hasFinalized = await this.hasFinalized();
		var wasMinimumRaiseReached = await this.wasMinimumRaiseReached();
		if(hasFinalized && wasMinimumRaiseReached){
			res = await this.getBalance();
		}
		return res;
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
	async isWhitelisted({address}) {
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

		}
		return await this.params.contract
			.getContract()
			.methods.unsoldTokensReedemed()
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
	async isAddressPOLSWhitelisted(){
		return await this.params.contract
		.getContract()
		.methods.isAddressPOLSWhitelisted()
		.call();
	}

	/**
	 * @function getTradingDecimals
	 * @description Get Trading Decimals (18 if isETHTrade, X if not)
	 * @returns {Integer}
	 */
	async getTradingDecimals(){
		const tradeAddress = await this.getTradingERC20Address();
		if (tradeAddress == '0x0000000000000000000000000000000000000000') {
			return 18;
		}
		const contract = new ERC20TokenContract({
			web3: this.web3,
			contractAddress: tradeAddress,
			acc : this.acc
		});
		return await contract.getDecimals();
	}

	/**
	 * @function getTradingERC20Address
	 * @description Get Trading Address if ERC20
	 * @returns {Address}
	 */
	async getTradingERC20Address(){
		return await this.params.contract
		.getContract()
		.methods.erc20TradeIn()
		.call();
	}

	/**
	 * @function isPreStart
	 * @description Verify if the Token Sale in not open yet, where the admin can fund the pool
	 * @returns {Boolean}
	 */
	async isPreStart() {
		return await this.params.contract
			.getContract()
			.methods.isPreStart()
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
	async getVestingSchedule({position}) {
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
		let amountLeftToRedeem = amount-amountReedemed;

		let isFinalized = await this.hasFinalized();

		// ToDo add a test for amountToReedemNow
		return {
			_id: purchase_id,
			amount: amount,
			purchaser: res.purchaser,
			costAmount: costAmount,
			timestamp: Numbers.fromSmartContractTimeToMinutes(res.timestamp),
			amountReedemed : amountReedemed,
			amountLeftToRedeem : amountLeftToRedeem,
			amountToReedemNow : isFinalized ? (await this.params.contract
				.getContract()
				.methods.getRedeemableTokensAmount(purchase_id).call()).amount : 0,
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
		// return res.map((id) => Numbers.fromHex(id));
	};

	/**
	 * @function getPurchaseIds
	 * @description Get All Purchase Ids filter by Address/Purchaser
	 * @param {Address} address
	 * @returns {Array | Integer} _ids
	 */
	getAddressPurchaseIds = async ({ address }) => {
		let res = await this.__sendTx(
			this.params.contract.getContract().methods.getMyPurchases(address),
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
	 */
	getDistributionInformation = async () => {
		
		let currentSchedule = 0;
		if(await this.hasStarted()){
			currentSchedule = parseInt(await this.getCurrentSchedule());
		}
		let vestingTime = parseInt(await this.params.contract.getContract().methods.vestingTime().call());
		let vestingSchedule = [];

		for(var i = 1; i <= vestingTime; i++){
			let a = parseInt(await this.getVestingSchedule({position: i}));
			vestingSchedule.push(a);
		}

		return {
			currentSchedule,
			vestingTime,
			vestingSchedule
		}
	}

	

	/* Legacy Call */
	getETHCostFromTokens = () => {throw new Error("Please use 'getCostFromTokens' instead")};

	/* POST User Functions */

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

		return await this.__sendTx(
			this.params.contract.getContract().methods.swap(amountWithDecimals, signature),
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
	 */

	redeemTokens = async ({ purchase_id }) => {
		return await this.__sendTx(
			this.params.contract.getContract().methods.redeemTokens(purchase_id)
		);
	};

	/**
	 * @function redeemGivenMinimumGoalNotAchieved
	 * @variation isStandard
	 * @description Reedem Ethereum from sale that did not achieve minimum goal
	 * @param {Integer} purchase_id
	 */
	redeemGivenMinimumGoalNotAchieved = async ({ purchase_id }) => {
		return await this.__sendTx(
			this.params.contract
				.getContract()
				.methods.redeemGivenMinimumGoalNotAchieved(purchase_id)
		);
	};

	/**
	 * @function withdrawUnsoldTokens
	 * @description Withdraw unsold tokens of sale
	 */

	withdrawUnsoldTokens = async () => {
		return await this.__sendTx(
			this.params.contract.getContract().methods.withdrawUnsoldTokens()
		);
	};

	/**
	 * @function withdrawFunds
	 * @description Withdraw all funds from tokens sold
	 */
	withdrawFunds = async () => {
		return await this.__sendTx(
			this.params.contract.getContract().methods.withdrawFunds()
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
	 * @function editIndividualMaximumAmount
	 * @type admin
	 * @param {Integer} individualMaximumAmount
	 * @description Modifies the max allocation
	 */
	editIndividualMaximumAmount = async ( { individualMaximumAmount } ) => {
		const maxAmount = Numbers.toSmartContractDecimals(
			individualMaximumAmount,
			await this.getDecimals()
		);
		return await this.__sendTx(
			this.params.contract.getContract().methods.setIndividualMaximumAmount(maxAmount)
		);
	};

	/**
	 * @function editEndDate
	 * @type admin
	 * @param {Date} endDate
	 * @description Modifies the end date for the pool
	 */
	editEndDate = async ( { endDate } ) => {
		return await this.__sendTx(
			this.params.contract.getContract().methods.editEndDate(Numbers.timeToSmartContractTime(endDate))
		);
	};

	/**
	 * @function approveSwapERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the investor to use approved tokens for the sale
	 */
	approveSwapERC20 = async ({ tokenAmount, callback }) => {
		if(await this.isETHTrade()){throw new Error("Funcion only available to ERC20 Trades")};
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
		if(await this.isETHTrade()){throw new Error("Funcion only available to ERC20 Trades")};
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
	 * @function fund
	 * @description Send tokens to pool for sale, fund the sale
	 * @param {Integer} tokenAmount
	 */
	fund = async ({ tokenAmount, callback }) => {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			await this.getDecimals()
		);

		return await this.__sendTx(
			this.params.contract.getContract().methods.fund(amountWithDecimals),
			null,
			null,
			callback
		);
	};

	/**
	 * @function addWhitelistedAddress
	 * @description add WhiteListed Address
	 * @param { Array | Addresses} Addresses
	 */
	addWhitelistedAddress = async ({addresses}) => {
		
		if(!addresses || !addresses.length || addresses.length == 0){
			throw new Error("Addresses not well setup");
		}

		let oldAddresses = await this.getWhitelistedAddresses();
		addresses = addresses.map( a => String(a).toLowerCase())
		oldAddresses = oldAddresses.map( a => String(a).toLowerCase());
		var addressesClean = [];
		
		addresses = addresses.filter( (item) => {
			if(
				(oldAddresses.indexOf(item) < 0) && 
				(addressesClean.indexOf(item) < 0)
				){
				// Does not exist
				addressesClean.push(item);
			}
		})

		return await this.__sendTx(
			this.params.contract.getContract().methods.add(addressesClean)
		);
	};

	/**
	 * @function removeWhitelistedAddress
	 * @param { Array | Addresses} addresses
	 * @param {Integer} index
	 * @description remove WhiteListed Address
	 */
	removeWhitelistedAddress = async ({address, index}) => {
		return await this.__sendTx(
			this.params.contract.getContract().methods.remove(address, index)
		);
	};


	/**
	 * @function safePull
	 * @description Safe Pull all tokens & ETH
	 */
	safePull = async () => {
		return await this.__sendTx(
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
		return await this.__sendTx(
			this.params.contract
				.getContract()
				.methods.removeOtherERC20Tokens(tokenAddress, toAddress)
		);
	};

	__assert() {
		this.params.contract.use(fixedswap, this.getAddress());
	}

	getDecimals = async () => {
		return await this.getTokenContract().getDecimals();
	}

	/**
	* @function deploy
	* @description Deploy the Pool Contract
	* @param {Float} tradeValue Buy price
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
	* @param {Array<Integer>=} vestingSchedule Vesting schedule in %
	* @param {String=} vestingStart Vesting start date (Default: endDate)
	* @param {Number=} vestingCliff Seconds between every vesting schedule (Default: 0)
	* @param {Number=} vestingDuration Vesting duration (Default: 0)
	*/
	deploy = async ({
		tradeValue,
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
		vestingSchedule=[],
		vestingStart,
		vestingCliff = 0,
		vestingDuration = 0
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
		if(minimumRaise != 0 && (minimumRaise > tokensForSale)) {
			throw new Error("Minimum Raise has to be smaller than total Raise")
		}
		if(Date.parse(startDate) >= Date.parse(endDate)) {
			throw new Error("Start Date has to be smaller than End Date")
		}
		if(Date.parse(startDate) <= Date.parse(moment(Date.now()).add(2, 'm').toDate())) {
			throw new Error("Start Date has to be higher (at least 2 minutes) than now")
		}
		if(individualMaximumAmount < 0) {
			throw new Error("Individual Maximum Amount should be bigger than 0")
		}
		if(individualMinimumAmount < 0) {
			throw new Error("Individual Minimum Amount should be bigger than 0")
		}

		if(individualMaximumAmount > 0){
			/* If exists individualMaximumAmount */
			if(individualMaximumAmount <= individualMinimumAmount) {
				throw new Error("Individual Maximum Amount should be bigger than Individual Minimum Amount")
			}
			if(individualMaximumAmount > tokensForSale) {
				throw new Error("Individual Maximum Amount should be smaller than total Tokens For Sale")
			}
		}

		if(ERC20TradingAddress != '0x0000000000000000000000000000000000000000' && (tradingDecimals == 0)){
			throw new Error("If an ERC20 Trading Address please add the 'tradingDecimals' field to the trading address (Ex : USDT -> 6)");
		}else{
			/* is ETH Trade */
			tradingDecimals = 18;
		}
	
		if(individualMaximumAmount == 0){
			individualMaximumAmount = tokensForSale; /* Set Max Amount to Unlimited if 0 */
		}
		
		if(vestingSchedule.length > 0 && vestingSchedule.reduce((a, b) => a + b, 0) != 100){
			throw new Error("'vestingSchedule' sum has to be equal to 100")
		}
		
		const DECIMALS_PERCENT_MUL = 10**12;
		vestingSchedule = vestingSchedule.map( a => String(new Decimal(a).mul(DECIMALS_PERCENT_MUL)).toString());

		const FLAG_isTokenSwapAtomic = 1; // Bit 0
		const FLAG_hasWhitelisting = 2; // Bit 1
		const FLAG_isPOLSWhitelisted = 4; // Bit 2 - true => user must have a certain amount of POLS staked to participate

		if (vestingSchedule.length == 0) {
			vestingCliff = 0;
		}
		if (!vestingStart) {
			vestingStart = endDate;
		}
		let params = [
			this.getTokenAddress(),
			Numbers.toSmartContractDecimals(tradeValue, tradingDecimals),
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
			(isTokenSwapAtomic ? FLAG_isTokenSwapAtomic : 0) | (hasWhitelisting ? FLAG_hasWhitelisting : 0) | (isPOLSWhitelist ? FLAG_isPOLSWhitelisted : 0), // Flags
			ERC20TradingAddress,
			Numbers.timeToSmartContractTime(vestingStart),
			vestingCliff,
			vestingDuration,
			vestingSchedule,
			
		];
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
		return this.params.erc20TokenContract;
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
		if(await this.isETHTrade()){
			let wei = await this.web3.eth.getBalance(this.getAddress());
			return this.web3.utils.fromWei(wei, 'ether');
		}else{
			return await this.getTokenContract().getTokenAmount(this.getAddress());
		}
	
	};
}

export default FixedSwapContract;
