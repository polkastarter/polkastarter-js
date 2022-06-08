import ERC20TokenContract from "../base/ERC20TokenContract";
import Numbers from "../../utils/Numbers";
import moment from 'moment';
import { Decimal } from 'decimal.js';
import * as ethers from 'ethers';
import * as FixedSwapContract from '../../solana-sdk/src/models/FixedSwap';
import SolanaWallet from "../../utils/SolanaWallet";
import * as anchor from '@project-serum/anchor';

/**
 * Fixed Swap Object
 * @constructor SolanaFixedSwapContract
 * @param {Address} tokenAddress
 * @param {Address} contractAddress ? (opt)
 * @extends BaseSwapContract
 */
class SolanaFixedSwapContract {
	constructor({
		tokenAddress,
		contractAddress = null, /* If not deployed */
		acc
	}) {
		this.anchor = anchor;
		this.connection = new anchor.web3.Connection(
			'http://127.0.0.1:8899', // ToDo
			{
				commitment: 'finalized'
			}
		);
		this.provider = new anchor.AnchorProvider(this.connection, acc, { commitment: 'finalized' });
		anchor.setProvider(this.provider);

		this.tokenAddress = tokenAddress;
		this.contractAddress = contractAddress;
		this.params = {};
		this.solanaWallet = new SolanaWallet(this.connection);
		this.acc = acc;
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
	* @param {Array<Integer>=} vestingSchedule Vesting schedule in %
	* @param {String=} vestingStart Vesting start date (Default: endDate)
	* @param {Number=} vestingCliff Seconds to wait for the first unlock after the vesting start (Default: 0)
	* @param {Number=} vestingDuration Seconds to wait between every unlock (Default: 0)
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
		vestingSchedule = [],
		vestingStart,
		vestingCliff = 0,
		vestingDuration = 0
	}) => {
		console.log('Deploying!');
		console.log(this.acc);
		console.log(this.anchor.web3.PublicKey.default);
		// ToDo Check all params

		const tokenFundAmount = 3;
		tradeValue = 1;
		startDate = new Date(Date.now() + 1 * 60 * 1000);
        endDate = new Date(Date.now() + 4 * 60 * 1000);
		let [deployInstruction, expectedAddress, id] = await FixedSwapContract.FixedSwapContract.deploy(
			this.connection, this.acc.payer.publicKey, tradeValue, tokenFundAmount, startDate, endDate, 0,
			tokenFundAmount, false, undefined, undefined, false, () => { }, this.tokenAddress,
			this.anchor.web3.PublicKey.default, // ToDo
			false, [], undefined, undefined, undefined
		)

		console.log(deployInstruction, expectedAddress, id);
        let tx = new this.anchor.web3.Transaction();
        tx.add(deployInstruction);
        let txsig = await this.solanaWallet.signAndSendTx(tx, this.acc.payer);
        await this.connection.confirmTransaction(txsig, 'finalized');
		this.params.contractAddress = expectedAddress;
		this.contractAddress = this.params.contractAddress;
		this.params.id = id;
        return await FixedSwapContract.FixedSwapContract.fromAddress(this.connection, expectedAddress, id, this.provider, this.acc.payer, 'finalized');
	};


	/**************************************
	 * WHITELIST METHODS
	 **************************************/

	/**
	 * @function hasWhitelisting
	 * @description Verify if swap has whitelisting
	 * @returns {Boolean}
	 */
	async hasWhitelisting() {
	}

	/**
	 * @function isWhitelisted
	 * @description Verify if address is whitelisted
	 * @param {string} address
	 * @returns {Boolean}
	 */
	async isWhitelisted({ address }) {
	}

	/**
	 * @function setHasWhitelisting
	 * @type admin
	 * @param {boolean} hasWhitelist
	 * @description Modifies if the pool has whitelisting or not
	 */
	setHasWhitelisting = async ({ hasWhitelist }) => {
	}

	/**
	 * @function addWhitelistedAddress
	 * @description add WhiteListed Address
	 * @param { Address} address
	 */
	addWhitelistedAddress = async ({ address }) => {
	};

	/**
	 * @function removeWhitelistedAddress
	 * @param { Array | Addresses} addresses
	 * @param {Integer} index
	 * @description remove WhiteListed Address
	 */
	removeWhitelistedAddress = async ({ address, index }) => {
	};

	/**
	 * @function setSignerPublicAddress
	 * @description Set the public address of the signer
	 * @param {string} address
	 */
	setSignerPublicAddress = async ({ address }) => {
	};

	/**
	 * @function signerPublicAddress
	 * @description Get the public address of the signer
	 * @returns {string} address
	 */

	async signerPublicAddress() {
	}

	/**
	 * @function getWhiteListedAddresses
	 * @description Get Whitelisted Addresses
	 * @returns {Array | Address} addresses
	 */

	getWhitelistedAddresses = async () => {

	}

	/**************************************
	 * TOKEN METHODS
	 **************************************/

	/**
	 * @function getBalance
	 * @description Get Balance of Contract
	 * @param {Integer} Balance
	 */
	getBalance = async () => {
	}

	/**
	 * @function removeOtherERC20Tokens
	 * @description Remove Tokens from other ERC20 Address (in case of accident)
	 * @param {Address} tokenAddress
	 * @param {Address} toAddress
	 */
	removeOtherERC20Tokens = async ({ tokenAddress, toAddress }) => {
	};

	/**
	 * @function minimumRaise
	 * @description Get Minimum Raise amount for Token Sale
	 * @returns {Integer} Amount in Tokens
	 */
	async minimumRaise() {
	}

	/**
	 * @function hasMinimumRaise
	 * @description See if hasMinimumRaise 
	 * @returns {Boolean} 
	 */
	async hasMinimumRaise() {
	}

	/**
	 * @function minimumReached
	 * @description See if minimumRaise was Reached
	 * @returns {Boolean}
	 */
	async minimumReached() {
	}

	/**
	 * @function safePull
	 * @description Safe Pull all tokens & ETH
	 */
	safePull = async () => {
	};

	/**
	 * @function withdrawFunds
	 * @description Withdraw all funds from tokens sold
	 */
	withdrawFunds = async () => {
	};

	/**
	 * @function withdrawableFunds
	 * @description Get Total funds raised to be withdrawn by the admin
	 * @returns {Integer} Amount in ETH
	 */
	async withdrawableFunds() {
	}

	/**
	 * @function wereUnsoldTokensReedemed
	 * @description Verify if the admin already reemeded unsold tokens
	 * @returns {Boolean}
	 */
	async wereUnsoldTokensReedemed() {
	}

	/**
	 * @function redeemGivenMinimumGoalNotAchieved
	 * @variation isStandard
	 * @description Reedem Ethereum from sale that did not achieve minimum goal
	 * @param {Integer} purchaseId
	 */
	redeemGivenMinimumGoalNotAchieved = async ({ purchaseId }) => {
	};

	/**
	 * @function setIndividualMaximumAmount
	 * @type admin
	 * @param {Integer} individualMaximumAmount
	 * @description Modifies the max allocation
	 */
	setIndividualMaximumAmount = async ({ individualMaximumAmount }) => {
	};

	/**
	 * @function individualMaximumAmount
	 * @description Get Individual Maximum Amount for each address
	 * @returns {Integer}
	 */
	async individualMaximumAmount() {
	}

	/**
	 * @function isApproved
	 * @description Verify if the Admin has approved the pool to use receive the tokens for sale
	 * @param {Integer} tokenAmount
	 * @param {Address} address
	 * @returns {Boolean}
	 */
	isApproved = async ({ tokenAmount, address }) => {
	};

	/**
	 * @function isApprovedSwapERC20
	 * @param {Integer} tokenAmount
	 * @param {Address} address
	 * @description Verify if it is approved to invest
	 */
	isApprovedSwapERC20 = async ({ tokenAmount, address, callback }) => {
	};

	/**
	 * @function approveSwapERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the investor to use approved tokens for the sale
	 */
	approveSwapERC20 = async ({ tokenAmount, callback }) => {
	};

	/**
	 * @function getTradingERC20Address
	 * @description Get Trading Address if ERC20
	 * @returns {Address}
	 */
	async getTradingERC20Address() {
	}

	/**
	 * @function isETHTrade
	 * @description Verify if Token Sale is against Ethereum
	 * @returns {Boolean}
	 */
	async isETHTrade() {
		return true; // ToDo
	}

	/**
	 * @function getTradingDecimals
	 * @description Get Trading Decimals (18 if isETHTrade, X if not)
	 * @returns {Integer}
	 */
	async getTradingDecimals() {
	}

	/**************************************
	 * DATE METHODS
	 **************************************/

	/**
	 * @function startDate
	 * @description Get Start Date of Change
	 * @returns {Date}
	 */
	async startDate() {
	}

	/**
	 * @function endDate
	 * @description Get End Date of Change
	 * @returns {Date}
	 */
	async endDate() {
	}

	/**
	 * @function setEndDate
	 * @type admin
	 * @param {Date} endDate
	 * @description Modifies the end date for the pool
	 */
	setEndDate = async ({ endDate }) => {
	};

	/**
	 * @function setStartDate
	 * @type admin
	 * @param {Date} startDate
	 * @description Modifies the start date for the pool
	 */
	setStartDate = async ({ startDate }) => {
	}

	/**
	 * @function isFinalized
	 * @description To see if contract was finalized
	 * @returns {Boolean}
	 */
	async isFinalized() {
	}

	/**
	 * @function isOpen
	 * @description Verify if the Token Sale is Open for Swap
	 * @returns {Boolean}
	 */
	async isOpen() {
	}

	/**
	 * @function hasStarted
	 * @description Verify if the Token Sale has started the Swap
	 * @returns {Boolean}
	 */
	async hasStarted() {
	}

	/**
	 * @function hasFinalized
	 * @description Verify if the Token Sale has finalized, if the current date is after endDate
	 * @returns {Boolean}
	 */
	async hasFinalized() {
	}

	/**
	 * @function isPreStart
	 * @description Verify if the Token Sale in not open yet
	 * @returns {Boolean}
	 */
	async isPreStart() {
	}

	/**************************************
	 * BLACKLIST METHODS
	 **************************************/

	/**
	 * @function addToBlacklist
	 * @description Adds an address to the blacklist
	 * @param {string} address
	 */
	addToBlacklist = async ({ address }) => {
	};

	/**
	 * @function removeFromBlacklist
	 * @description Removes an address from the blacklist
	 * @param {string} address
	 */
	removeFromBlacklist = async ({ address }) => {
	};

	/**
	 * @function isBlackListed
	 * @description Returns true if the address is in the blacklist
	 * @param {string} address
	 * @returns {boolean} isBlackListed
	 */
	isBlacklisted = async ({ address }) => {
	}

	/**************************************
	 * PAUSABLE METHODS
	 **************************************/

	/**
	 * @function isPaused
	 * @description Returns if the contract is paused or not
	 * @returns {boolean}
	 */

	async isPaused() {
	}

	/**
	 * @function pauseContract
	 * @type admin
	 * @description Pause Contract
	 */
	async pauseContract() {
	}

	/**
	 * @function unpauseContract
	 * @type admin
	 * @description Unpause Contract
	 */
	async unpauseContract() {
	}

	/**
	 * @function getSmartContractVersion
	 * @description Returns the version of the smart contract that is currently inside psjs
	 * @param {Address} Address
	 */
	getSmartContractVersion = async () => {
	}

	getContractMethods() {

	 }

	getDecimals = async () => {
	}

	getAddress() {
		return this.params.contractAddress;
	}

	getTokenAddress() {
	}

	getTokenContract() {
	}


	assertERC20Info = async () => {
		// ToDo
		if (!(await this.isETHTrade())) {
			this.params.erc20TokenContract = new ERC20TokenContract({
				web3: this.web3,
				contractAddress: await this.getTradingERC20Address(),
				acc: this.acc
			});
		};
	}

	assertERC20Info = async () => {
		// ToDo
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
	 * @function erc20
	 * @description Get Token Address
	 * @returns {Address} Token Address
	 */
	async erc20() {
	}

	/* Get Functions */
	/**
	 * @function tradeValue
	 * @description Get trade value for the pool
	 * @returns {Integer} trade value against ETH
	 */
	async tradeValue() {
	}

	/**
	 * @function swapRatio
	 * @description Get swap ratio for the pool
	 * @returns {Integer} trade value against 1 ETH
	 */
	 async swapRatio() {
	}

	/**
	 * @function vestingStart
	 * @description Get Start Date of the Vesting
	 * @returns {Date}
	 */
	async vestingStart() {
	}

	/**
	 * @function individualMinimumAmount
	 * @description Get Individual Minimum Amount for each address
	 * @returns {Integer}
	 */
	async individualMinimumAmount() {
	}

	/**
	 * @function tokensForSale
	 * @description Get Total tokens Allocated/In Sale for the Pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensForSale() {
	}

	/**
	 * @function tokensAvailable
	 * @description Get Total tokens owned by the Pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensAvailable() {
	}

	/**
	 * @function tokensLeft
	 * @description Get Total tokens available to be sold in the pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensLeft() {
	}

	/**
	 * @function individualMaximumAmount
	 * @description Get Individual Maximum Amount for each address
	 * @returns {Integer}
	 */
	 async individualMaximumAmount() {
	}

	/**
	 * @function withdrawableUnsoldTokens
	 * @description Get Total tokens available to be withdrawn by the admin
	 * @returns {Integer} Amount in Tokens
	 */
	async withdrawableUnsoldTokens() {
	}
	
	/**
	 * @function tokensAllocated
	 * @description Get Total tokens spent in the contract, therefore the tokens bought until now
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensAllocated() {
	}

	/**
	 * @function isTokenSwapAtomic
	 * @description Verify if the Token Swap is atomic on this pool
	 * @returns {Boolean}
	 */
	async isTokenSwapAtomic() {
	}

	/**
	 * @function isFunded
	 * @description Verify if the Token Sale is Funded with all Tokens proposed in tokensForSale
	 * @returns {Boolean}
	 */
	async isFunded() {
	}

	/**
	 * @function isPOLSWhitelisted
	 * @description Verify if Token Sale is POLS Whitelisted
	 * @returns {Boolean}
	 */
	async isPOLSWhitelisted() {
	}

	/**
	 * @function isAddressPOLSWhitelisted
	 * @description Verify if Address is Whitelisted by POLS (returns false if not needed)
	 * @returns {Boolean}
	 */
	async isAddressPOLSWhitelisted() {
	}

	/**
	 * @function getCurrentSchedule
	 * @description Gets Current Schedule
	 * @returns {Integer}
	 */
	async getCurrentSchedule() {
	}

	/**
	 * @function getVestingSchedule
	 * @description Gets Vesting Schedule
	 * @param {Integer} Position Get Position of Integer 
	 * @returns {Array | Integer}
	 */
	async getVestingSchedule({ position }) {
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
	};

	/**
	 * @function getWhiteListedAddresses
	 * @description Get Whitelisted Addresses
	 * @returns {Array | Address} addresses
	 */

	getWhitelistedAddresses = async () =>

	/**
	 * @function getBuyers
	 * @description Get Buyers
	 * @returns {Array | Integer} _ids
	 */

	getBuyers = async () => {

	}

	/**
	 * @function getPurchaseIds
	 * @description Get All Purchase Ids
	 * @returns {(Array | Integer)} _ids
	 */
	getPurchaseIds = async () => {
	};

	/**
	 * @function getPurchaseIds
	 * @description Get All Purchase Ids filter by Address/Purchaser
	 * @param {Address} address
	 * @returns {Array | Integer} _ids
	 */
	getAddressPurchaseIds = async ({ address }) => {
	};

	/**
	 * @function getCostFromTokens
	 * @description Get Cost from Tokens Amount
	 * @param {Integer} tokenAmount
	 * @returns {Integer} costAmount
	 */
	getCostFromTokens = async ({ tokenAmount }) => {
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
	}

	/**
	 * @function swap
	 * @description Swap tokens by Ethereum or ERC20
	 * @param {Integer} tokenAmount
	 * @param {string=} signature Signature for the offchain whitelist
	*/
	swap = async ({ tokenAmount, callback, signature }) => {
	};

	/**
	 * @function redeemTokens
	 * @variation isStandard
	 * @description Reedem tokens bought
	 * @param {Integer} purchase_id
	 */
	redeemTokens = async ({ purchase_id }) => {
	};

	/**
	 * @function withdrawUnsoldTokens
	 * @description Withdraw unsold tokens of sale
	 */

	withdrawUnsoldTokens = async () => {
	};

	/**
	 * @function approveFundERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the pool to use approved tokens for sale
	 */
	approveFundERC20 = async ({ tokenAmount, callback }) => {
	};

	/**
	 * @function setVesting
	 * @type admin
	 * @param {Array<Integer>=} vestingSchedule Vesting schedule in %
	 * @param {String=} vestingStart Vesting start date (Default: endDate)
	 * @param {Number=} vestingCliff Seconds between every vesting schedule (Default: 0)
	 * @param {Number=} vestingDuration Vesting duration (Default: 0)
	 * @description Modifies the current vesting config
	 */
	setVesting = async ({
		vestingSchedule = [],
		vestingStart,
		vestingCliff = 0,
		vestingDuration = 0
	}) => {
	}

	/**
	 * @function fund
	 * @description Send tokens to pool for sale, fund the sale
	 * @param {Integer} tokenAmount
	 */
	fund = async ({ tokenAmount, callback }) => {
	};

}

export default SolanaFixedSwapContract;
