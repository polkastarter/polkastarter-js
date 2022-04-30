import Contract from "../../base/Contract";
import Client from "../../../utils/Client";
import Numbers from "../../../utils/Numbers";
import ERC20TokenContract from "../../base/ERC20TokenContract";

/**
 * Base Swap Contract Object
 * @constructor BaseSwapContract
 * @param {Web3} web3
 * @param {Address} contractAddress ? (opt)
 */

class BaseSwapContract {
	constructor({
		web3,
		contractAddress = null /* If not deployed */,
		acc,
		contractInterface,
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
				contract: new Contract(web3, contractInterface, contractAddress),
			};
			this.contractInterface = contractInterface;
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

	/**************************************
	 * WHITELIST METHODS
	 **************************************/

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
	 * @function setHasWhitelisting
	 * @type admin
	 * @param {boolean} hasWhitelist
	 * @description Modifies if the pool has whitelisting or not
	 */
	setHasWhitelisting = async ({ hasWhitelist }) => {
		return await this.executeContractMethod(
			this.getContractMethods().setHasWhitelisting(hasWhitelist)
		);
	}

	/**
	 * @function addWhitelistedAddress
	 * @description add WhiteListed Address
	 * @param { Address} address
	 */
	addWhitelistedAddress = async ({ address }) => {
		let addresses = [address];
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

		return await this.executeContractMethod(
			this.getContractMethods().addToWhitelist(address)
		);
	};

	/**
	 * @function removeWhitelistedAddress
	 * @param { Array | Addresses} addresses
	 * @param {Integer} index
	 * @description remove WhiteListed Address
	 */
	removeWhitelistedAddress = async ({ address, index }) => {
		return await this.executeContractMethod(
			this.getContractMethods().remove(address, index)
		);
	};

	/**
	 * @function setSignerPublicAddress
	 * @description Set the public address of the signer
	 * @param {string} address
	 */
	setSignerPublicAddress = async ({ address }) => {
		try {
			return await this.executeContractMethod(
				this.getContractMethods().setSignerPublicAddress(address)
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
		return await this.getContractMethods().signerPublicAddress().call();
	}

	/**
	 * @function getWhiteListedAddresses
	 * @description Get Whitelisted Addresses
	 * @returns {Array | Address} addresses
	 */

	getWhitelistedAddresses = async () =>
		await this.getContractMethods().getWhitelistedAddresses().call();

	/**************************************
	 * TOKEN METHODS
	 **************************************/

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
	}

	/**
	 * @function removeOtherERC20Tokens
	 * @description Remove Tokens from other ERC20 Address (in case of accident)
	 * @param {Address} tokenAddress
	 * @param {Address} toAddress
	 */
	removeOtherERC20Tokens = async ({ tokenAddress, toAddress }) => {
		return await this.executeContractMethod(
			this.params.contract
				.getContract()
				.methods.removeOtherERC20Tokens(tokenAddress, toAddress)
		);
	};

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
	 * @returns {Boolean}
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
	 * @function safePull
	 * @description Safe Pull all tokens & ETH
	 */
	safePull = async () => {
		return await this.executeContractMethod(
			this.getContractMethods().safePull(),
			null,
			0
		);
	};

	/**
	 * @function withdrawFunds
	 * @description Withdraw all funds from tokens sold
	 */
	withdrawFunds = async () => {
		return await this.executeContractMethod(
			this.getContractMethods().withdrawFunds()
		);
	};

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
	 * @function redeemGivenMinimumGoalNotAchieved
	 * @variation isStandard
	 * @description Reedem Ethereum from sale that did not achieve minimum goal
	 * @param {Integer} purchaseId
	 */
	redeemGivenMinimumGoalNotAchieved = async ({ purchaseId }) => {
		return await this.executeContractMethod(
			this.getContractMethods().redeemGivenMinimumGoalNotAchieved(purchaseId)
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
		return await this.executeContractMethod(
			this.getContractMethods().setIndividualMaximumAmount(maxAmount)
		);
	};

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
	 * @function isApprovedSwapERC20
	 * @param {Integer} tokenAmount
	 * @param {Address} address
	 * @description Verify if it is approved to invest
	 */
	isApprovedSwapERC20 = async ({ tokenAmount, address, callback }) => {
		if (await this.isETHTrade()) { throw new Error("Funcion only available to ERC20 Trades") };
		return await this.params.erc20TokenContract.isApproved({
			address,
			spenderAddress: this.getAddress(),
			amount: tokenAmount,
			callback
		});
	};

	/**
	 * @function approveSwapERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the investor to use approved tokens for the sale
	 */
	approveSwapERC20 = async ({ tokenAmount, callback }) => {
		if (await this.isETHTrade()) { throw new Error("Funcion only available to ERC20 Trades") };
		return await this.params.erc20TokenContract.approve({
			address: this.getAddress(),
			amount: tokenAmount,
			callback
		});
	};

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

	/**************************************
	 * DATE METHODS
	 **************************************/

	/**
	 * @function startDate
	 * @description Get Start Date of Change
	 * @returns {Date}
	 */
	async startDate() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.getContractMethods().startDate().call()
		);
	}

	/**
	 * @function endDate
	 * @description Get End Date of Change
	 * @returns {Date}
	 */
	async endDate() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.getContractMethods().endDate().call()
		);
	}

	/**
	 * @function setEndDate
	 * @type admin
	 * @param {Date} endDate
	 * @description Modifies the end date for the pool
	 */
	setEndDate = async ({ endDate }) => {
		return await this.executeContractMethod(
			this.getContractMethods().setEndDate(Numbers.timeToSmartContractTime(endDate))
		);
	};

	/**
	 * @function setStartDate
	 * @type admin
	 * @param {Date} startDate
	 * @description Modifies the start date for the pool
	 */
	setStartDate = async ({ startDate }) => {
		return await this.executeContractMethod(
			this.getContractMethods().setStartDate(Numbers.timeToSmartContractTime(startDate))
		);
	}

	/**
	 * @function isFinalized
	 * @description To see if contract was finalized
	 * @returns {Boolean}
	 */
	async isFinalized() {
		return await this.getContractMethods().hasFinalized().call()

	}

	/**
	 * @function isOpen
	 * @description Verify if the Token Sale is Open for Swap
	 * @returns {Boolean}
	 */
	async isOpen() {
		return await this.getContractMethods().isOpen().call();
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

	/**************************************
	 * BLACKLIST METHODS
	 **************************************/

	/**
	 * @function addToBlacklist
	 * @description Adds an address to the blacklist
	 * @param {string} address
	 */
	addToBlacklist = async ({ address }) => {
		try {
			return await this.executeContractMethod(
				this.params.contract
					.getContract()
					.methods
					.addToBlacklist(address)
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
			return await this.executeContractMethod(
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
		return await this.getContractMethods().isBlacklisted(address).call();
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
		return await this.getContractMethods().paused().call();
	}

	/**
	 * @function pauseContract
	 * @type admin
	 * @description Pause Contract
	 */
	async pauseContract() {
		return await this.executeContractMethod(
			this.getContractMethods().pause()
		);
	}

	/**
	 * @function unpauseContract
	 * @type admin
	 * @description Unpause Contract
	 */
	async unpauseContract() {
		return await this.executeContractMethod(
			this.getContractMethods().unpause()
		);
	}

	/**************************************
	 * UTILS
	 **************************************/

	__assert() {
		this.params.contract.use(this.contractInterface, this.getAddress());
	}

	/**
	 * @function getSmartContractVersion
	 * @description Returns the version of the smart contract that is currently inside psjs
	 * @param {Address} Address
	 */
	getSmartContractVersion = async () => {
		return await this.getContractMethods().getAPIVersion().call();
	}

	getContractMethods() { return this.params.contract.getContract().methods; }

	getDecimals = async () => {
		return await this.getTokenContract().getDecimals();
	}

	getAddress() {
		return this.params.contractAddress;
	}

	getTokenAddress() {
		return this.getTokenContract().getAddress();
	}

	getTokenContract() {
		return this.params.erc20TokenContract;
	}

	executeContractMethod = async (methodToExecute, call = false, value, callback) => {
		return await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			methodToExecute,
			call,
			value,
			callback
		);
	}

	assertERC20Info = async () => {
		if (!(await this.isETHTrade())) {
			this.params.erc20TokenContract = new ERC20TokenContract({
				web3: this.web3,
				contractAddress: await this.getTradingERC20Address(),
				acc: this.acc
			});
		};
	}

}

export default BaseSwapContract;