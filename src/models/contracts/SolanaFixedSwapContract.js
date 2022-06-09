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
		const feeAddress = undefined; // ToDo

		// ToDo Check swap ratio

		let [deployInstruction, expectedAddress, id] = await FixedSwapContract.FixedSwapContract.deploy(
			this.connection, this.acc.payer.publicKey, tradeValue, tokensForSale, startDate, endDate, individualMinimumAmount,
			individualMaximumAmount, isTokenSwapAtomic, minimumRaise, feeAmount, hasWhitelisting, callback, this.tokenAddress,
			this.anchor.web3.PublicKey.default,
			isPOLSWhitelist, vestingSchedule, vestingStart, new this.anchor.BN(vestingCliff), new this.anchor.BN(vestingDuration), undefined, feeAddress
		)

		console.log(deployInstruction, expectedAddress, id);
        let tx = new this.anchor.web3.Transaction();
        tx.add(deployInstruction);
        let txsig = await this.solanaWallet.signAndSendTx(tx, this.acc.payer);
        await this.connection.confirmTransaction(txsig, 'finalized');
		this.params.contractAddress = expectedAddress;
		this.contractAddress = this.params.contractAddress;
		this.params.id = id;
        this.params.solanaSwap = await FixedSwapContract.FixedSwapContract.fromAddress(this.connection, expectedAddress, id, this.provider, this.acc.payer, 'finalized');
		return this.params.solanaSwap;
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
		return await this.params.solanaSwap.hasWhitelisting();
	}

	/**
	 * @function isWhitelisted
	 * @description Verify if address is whitelisted
	 * @param {string} address
	 * @returns {Boolean}
	 */
	async isWhitelisted({ address }) {
		return await this.params.solanaSwap.isWhitelisted(new this.anchor.web3.PublicKey(address));
	}

	/**
	 * @function setHasWhitelisting
	 * @type admin
	 * @param {boolean} hasWhitelist
	 * @description Modifies if the pool has whitelisting or not
	 */
	setHasWhitelisting = async ({ hasWhitelist }) => {
		return await this.params.solanaSwap.setHasWhitelisting(hasWhitelist);
	}

	/**
	 * @function addWhitelistedAddress
	 * @description add WhiteListed Address
	 * @param { Address} address
	 */
	addWhitelistedAddress = async ({ address }) => {
		return await this.params.solanaSwap.addWhitelistedAddress(new this.anchor.web3.PublicKey(address));
	};

	/**
	 * @function removeWhitelistedAddress
	 * @param { Array | Addresses} addresses
	 * @param {Integer} index
	 * @description remove WhiteListed Address
	 */
	removeWhitelistedAddress = async ({ address, index }) => {
		return await this.params.solanaSwap.removeWhitelistedAddress(new this.anchor.web3.PublicKey(address));
	};

	/**
	 * @function setSignerPublicAddress
	 * @description Set the public address of the signer
	 * @param {string} address
	 */
	setSignerPublicAddress = async ({ address }) => {
		return await this.params.solanaSwap.setSignerPublicAddress(address);
	};

	/**
	 * @function signerPublicAddress
	 * @description Get the public address of the signer
	 * @returns {string} address
	 */

	async signerPublicAddress() {
		return await this.params.solanaSwap.signerPublicAddress();
	}

	/**
	 * @function getWhiteListedAddresses
	 * @description Get Whitelisted Addresses
	 * @returns {Array | Address} addresses
	 */

	getWhitelistedAddresses = async () => {
		return await this.params.solanaSwap.getWhitelistedAddresses();
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
		return await this.params.solanaSwap.getBalance();
	}

	/**
	 * @function removeOtherERC20Tokens
	 * @description Remove Tokens from other ERC20 Address (in case of accident)
	 * @param {Address} tokenAddress
	 * @param {Address} toAddress
	 */
	removeOtherERC20Tokens = async ({ tokenAddress, toAddress }) => {
		throw new Error('Not implemented');
	};

	/**
	 * @function minimumRaise
	 * @description Get Minimum Raise amount for Token Sale
	 * @returns {Integer} Amount in Tokens
	 */
	async minimumRaise() {
		return await this.params.solanaSwap.minimumRaise();
	}

	/**
	 * @function hasMinimumRaise
	 * @description See if hasMinimumRaise 
	 * @returns {Boolean} 
	 */
	async hasMinimumRaise() {
		return await this.params.solanaSwap.hasMinimumRaise();
	}

	/**
	 * @function minimumReached
	 * @description See if minimumRaise was Reached
	 * @returns {Boolean}
	 */
	async minimumReached() {
		return await this.params.solanaSwap.minimumReached();
	}

	/**
	 * @function safePull
	 * @description Safe Pull all tokens & ETH
	 */
	safePull = async () => {
		throw new Error('Not implemented');
	};

	/**
	 * @function withdrawFunds
	 * @description Withdraw all funds from tokens sold
	 */
	withdrawFunds = async () => {
		return await this.params.solanaSwap.withdrawFunds();
	};

	/**
	 * @function withdrawableFunds
	 * @description Get Total funds raised to be withdrawn by the admin
	 * @returns {Integer} Amount in ETH
	 */
	async withdrawableFunds() {
		return await this.params.solanaSwap.withdrawableFunds();
	}

	/**
	 * @function wereUnsoldTokensReedemed
	 * @description Verify if the admin already reemeded unsold tokens
	 * @returns {Boolean}
	 */
	async wereUnsoldTokensReedemed() {
		return await this.params.solanaSwap.wereUnsoldTokensReedemed();
	}

	/**
	 * @function redeemGivenMinimumGoalNotAchieved
	 * @variation isStandard
	 * @description Reedem Ethereum from sale that did not achieve minimum goal
	 * @param {Integer} purchaseId
	 */
	redeemGivenMinimumGoalNotAchieved = async ({ purchaseId }) => {
		return await this.params.solanaSwap.redeemGivenMinimumGoalNotAchieved(purchaseId);
	};

	/**
	 * @function setIndividualMaximumAmount
	 * @type admin
	 * @param {Integer} individualMaximumAmount
	 * @description Modifies the max allocation
	 */
	setIndividualMaximumAmount = async ({ individualMaximumAmount }) => {
		return await this.params.solanaSwap.setIndividualMaximumAmount(individualMaximumAmount);
	};

	/**
	 * @function individualMaximumAmount
	 * @description Get Individual Maximum Amount for each address
	 * @returns {Integer}
	 */
	async individualMaximumAmount() {
		return await this.params.solanaSwap.individualMaximumAmount();
	}

	/**
	 * @function isApproved
	 * @description Verify if the Admin has approved the pool to use receive the tokens for sale
	 * @param {Integer} tokenAmount
	 * @param {Address} address
	 * @returns {Boolean}
	 */
	isApproved = async ({ tokenAmount, address }) => {
		return true;
	};

	/**
	 * @function isApprovedSwapERC20
	 * @param {Integer} tokenAmount
	 * @param {Address} address
	 * @description Verify if it is approved to invest
	 */
	isApprovedSwapERC20 = async ({ tokenAmount, address, callback }) => {
		return true;
	};

	/**
	 * @function approveSwapERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the investor to use approved tokens for the sale
	 */
	approveSwapERC20 = async ({ tokenAmount, callback }) => {
		throw new Error('Not implemented');
	};

	/**
	 * @function getTradingERC20Address
	 * @description Get Trading Address if ERC20
	 * @returns {Address}
	 */
	async getTradingERC20Address() {
		return await this.params.solanaSwap.getTradingERC20Address();
	}

	/**
	 * @function isETHTrade
	 * @description Verify if Token Sale is against Ethereum
	 * @returns {Boolean}
	 */
	async isETHTrade() {
		return await this.params.solanaSwap.isETHtrade();
	}

	/**
	 * @function getTradingDecimals
	 * @description Get Trading Decimals (18 if isETHTrade, X if not)
	 * @returns {Integer}
	 */
	async getTradingDecimals() {
		return await this.params.solanaSwap.getTradingDecimals();
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
		return await this.params.solanaSwap.startDate();
	}

	/**
	 * @function endDate
	 * @description Get End Date of Change
	 * @returns {Date}
	 */
	async endDate() {
		return await this.params.solanaSwap.endDate();
	}

	/**
	 * @function setEndDate
	 * @type admin
	 * @param {Date} endDate
	 * @description Modifies the end date for the pool
	 */
	setEndDate = async ({ endDate }) => {
		return await this.params.solanaSwap.setEndDate(endDate);
	};

	/**
	 * @function setStartDate
	 * @type admin
	 * @param {Date} startDate
	 * @description Modifies the start date for the pool
	 */
	setStartDate = async ({ startDate }) => {
		return await this.params.solanaSwap.setStartDate(startDate);
	}

	/**
	 * @function isFinalized
	 * @description To see if contract was finalized
	 * @returns {Boolean}
	 */
	async isFinalized() {
		return await this.params.solanaSwap.hasFinalized();
	}

	/**
	 * @function isOpen
	 * @description Verify if the Token Sale is Open for Swap
	 * @returns {Boolean}
	 */
	async isOpen() {
		return await this.params.solanaSwap.isOpen();
	}

	/**
	 * @function hasStarted
	 * @description Verify if the Token Sale has started the Swap
	 * @returns {Boolean}
	 */
	async hasStarted() {
		return await this.params.solanaSwap.hasStarted();
	}

	/**
	 * @function hasFinalized
	 * @description Verify if the Token Sale has finalized, if the current date is after endDate
	 * @returns {Boolean}
	 */
	async hasFinalized() {
		return await this.params.solanaSwap.hasFinalized();
	}

	/**
	 * @function isPreStart
	 * @description Verify if the Token Sale in not open yet
	 * @returns {Boolean}
	 */
	async isPreStart() {
		return await this.params.solanaSwap.isPreStart();
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
		return await this.params.solanaSwap.addToBlacklist(new this.anchor.web3.PublicKey(address));
	};

	/**
	 * @function removeFromBlacklist
	 * @description Removes an address from the blacklist
	 * @param {string} address
	 */
	removeFromBlacklist = async ({ address }) => {
		return await this.params.solanaSwap.removeFromBlacklist(new this.anchor.web3.PublicKey(address));
	};

	/**
	 * @function isBlackListed
	 * @description Returns true if the address is in the blacklist
	 * @param {string} address
	 * @returns {boolean} isBlackListed
	 */
	isBlacklisted = async ({ address }) => {
		return await this.params.solanaSwap.isBlacklisted(new this.anchor.web3.PublicKey(address));
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
		return await this.params.solanaSwap.isPaused();
	}

	/**
	 * @function pauseContract
	 * @type admin
	 * @description Pause Contract
	 */
	async pauseContract() {
		return await this.params.solanaSwap.pauseContract();
	}

	/**
	 * @function unpauseContract
	 * @type admin
	 * @description Unpause Contract
	 */
	async unpauseContract() {
		return await this.params.solanaSwap.unpauseContract();
	}

	/**
	 * @function getSmartContractVersion
	 * @description Returns the version of the smart contract that is currently inside psjs
	 * @param {Address} Address
	 */
	getSmartContractVersion = async () => {
		return 3100000;
	}

	getContractMethods() {
		throw new Error('Not implemented');
	}

	getDecimals = async () => {
		return await this.params.solanaSwap.getDecimals();
	}

	getAddress() {
		return this.params.contractAddress;
	}

	getTokenAddress() {
		return this.params.solanaSwap.getTokenAddress();
	}

	getTokenContract() {
		return this.params.solanaSwap.getTokenContract();
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
		return await this.params.solanaSwap.erc20();
	}

	/* Get Functions */
	/**
	 * @function tradeValue
	 * @description Get trade value for the pool
	 * @returns {Integer} trade value against ETH
	 */
	async tradeValue() {
		return await this.params.solanaSwap.tradeValue();
	}

	/**
	 * @function swapRatio
	 * @description Get swap ratio for the pool
	 * @returns {Integer} trade value against 1 ETH
	 */
	 async swapRatio() {
		return await this.params.solanaSwap.swapRatio();
	}

	/**
	 * @function vestingStart
	 * @description Get Start Date of the Vesting
	 * @returns {Date}
	 */
	async vestingStart() {
		return await this.params.solanaSwap.vestingStart();
	}

	/**
	 * @function individualMinimumAmount
	 * @description Get Individual Minimum Amount for each address
	 * @returns {Integer}
	 */
	async individualMinimumAmount() {
		return await this.params.solanaSwap.individualMinimumAmount();
	}

	/**
	 * @function tokensForSale
	 * @description Get Total tokens Allocated/In Sale for the Pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensForSale() {
		return await this.params.solanaSwap.tokensForSale();
	}

	/**
	 * @function tokensAvailable
	 * @description Get Total tokens owned by the Pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensAvailable() {
		return await this.params.solanaSwap.tokensAvailable();
	}

	/**
	 * @function tokensLeft
	 * @description Get Total tokens available to be sold in the pool
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensLeft() {
		return await this.params.solanaSwap.tokensLeft();
	}

	/**
	 * @function individualMaximumAmount
	 * @description Get Individual Maximum Amount for each address
	 * @returns {Integer}
	 */
	 async individualMaximumAmount() {
		return await this.params.solanaSwap.individualMaximumAmount();
	}

	/**
	 * @function withdrawableUnsoldTokens
	 * @description Get Total tokens available to be withdrawn by the admin
	 * @returns {Integer} Amount in Tokens
	 */
	async withdrawableUnsoldTokens() {
		return await this.params.solanaSwap.withdrawableUnsoldTokens();
	}
	
	/**
	 * @function tokensAllocated
	 * @description Get Total tokens spent in the contract, therefore the tokens bought until now
	 * @returns {Integer} Amount in Tokens
	 */
	async tokensAllocated() {
		return await this.params.solanaSwap.tokensAllocated();
	}

	/**
	 * @function isTokenSwapAtomic
	 * @description Verify if the Token Swap is atomic on this pool
	 * @returns {Boolean}
	 */
	async isTokenSwapAtomic() {
		return await this.params.solanaSwap.isTokenSwapAtomic();
	}

	/**
	 * @function isFunded
	 * @description Verify if the Token Sale is Funded with all Tokens proposed in tokensForSale
	 * @returns {Boolean}
	 */
	async isFunded() {
		return await this.params.solanaSwap.isFunded();
	}

	/**
	 * @function isPOLSWhitelisted
	 * @description Verify if Token Sale is POLS Whitelisted
	 * @returns {Boolean}
	 */
	async isPOLSWhitelisted() {
		return false;
	}

	/**
	 * @function isAddressPOLSWhitelisted
	 * @description Verify if Address is Whitelisted by POLS (returns false if not needed)
	 * @returns {Boolean}
	 */
	async isAddressPOLSWhitelisted() {
		return false;
	}

	/**
	 * @function getCurrentSchedule
	 * @description Gets Current Schedule
	 * @returns {Integer}
	 */
	async getCurrentSchedule() {
		return await this.params.solanaSwap.getCurrentSchedule();
	}

	/**
	 * @function getVestingSchedule
	 * @description Gets Vesting Schedule
	 * @param {Integer} Position Get Position of Integer 
	 * @returns {Array | Integer}
	 */
	async getVestingSchedule({ position }) {
		return await this.params.solanaSwap.getVestingSchedule(position);
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
		// ToDo
	};

	/**
	 * @function getWhiteListedAddresses
	 * @description Get Whitelisted Addresses
	 * @returns {Array | Address} addresses
	 */

	getWhitelistedAddresses = async () => {
		return await this.params.solanaSwap.getWhitelistedAddresses();
	}

	/**
	 * @function getBuyers
	 * @description Get Buyers
	 * @returns {Array | Integer} _ids
	 */

	getBuyers = async () => {
		return await this.params.solanaSwap.getBuyers();
	}

	/**
	 * @function getPurchaseIds
	 * @description Get All Purchase Ids
	 * @returns {(Array | string)} _ids
	 */
	getPurchaseIds = async () => {
		return (await this.params.solanaSwap.getPurchaseIds()).map(id => id.toBase58());
	};

	/**
	 * @function getPurchaseIds
	 * @description Get All Purchase Ids filter by Address/Purchaser
	 * @param {Address} address
	 * @returns {Array | Integer} _ids
	 */
	getAddressPurchaseIds = async ({ address }) => {
		return await this.params.solanaSwap.getAddressPurchaseIds(new this.anchor.web3.PublicKey(address));
	};

	/**
	 * @function getCostFromTokens
	 * @description Get Cost from Tokens Amount
	 * @param {Integer} tokenAmount
	 * @returns {Integer} costAmount
	 */
	getCostFromTokens = async ({ tokenAmount }) => {
		return await this.params.solanaSwap.getCostFromTokens(tokenAmount);
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
		return await this.params.solanaSwap.getDistributionInformation();
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
		return await this.params.solanaSwap.swapWithSig(tokenAmount, callback, signature, new this.anchor.BN(accountMaxAmount))
	}

	/**
	 * @function swap
	 * @description Swap tokens by Ethereum or ERC20
	 * @param {Integer} tokenAmount
	 * @param {string=} signature Signature for the offchain whitelist
	*/
	swap = async ({ tokenAmount, callback, signature }) => {
		return await this.params.solanaSwap.swap(tokenAmount, callback, signature);
	};

	/**
	 * @function redeemTokens
	 * @variation isStandard
	 * @description Reedem tokens bought
	 * @param {string} purchase_id
	 */
	redeemTokens = async ({ purchase_id }) => {
		return await this.params.solanaSwap.swap(new this.anchor.web3.PublicKey(purchase_id));
	};

	/**
	 * @function withdrawUnsoldTokens
	 * @description Withdraw unsold tokens of sale
	 */

	withdrawUnsoldTokens = async () => {
		return await this.params.solanaSwap.withdrawUnsoldTokens();
	};

	/**
	 * @function approveFundERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the pool to use approved tokens for sale
	 */
	approveFundERC20 = async ({ tokenAmount, callback }) => {
		throw new Error('Not implemented');
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
		return await this.params.solanaSwap.setVesting(vestingSchedule, vestingStart, vestingCliff, vestingDuration);
	}

	/**
	 * @function fund
	 * @description Send tokens to pool for sale, fund the sale
	 * @param {Integer} tokenAmount
	 */
	fund = async ({ tokenAmount, callback }) => {
		return await this.params.solanaSwap.fund(tokenAmount);
	};

}

export default SolanaFixedSwapContract;
