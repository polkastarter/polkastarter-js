import { fixedswap } from "../interfaces";
import Contract from "./Contract";
import ERC20TokenContract from "./ERC20Contract";
import Numbers from "../utils/Numbers";
import _ from "lodash";


/**
 * Fixed Swap Object
 * @constructor FixedSwapContract
 * @param {Web3} web3
 * @param {Address} tokenAddress
 * @param {Integer} decimals
 * @param {Address} contractAddress ? (opt)
 */
class FixedSwapContract {
	constructor({
		web3,
		tokenAddress,
		decimals,
		contractAddress = null /* If not deployed */,
		acc,
	}) {
		try {
			if (!tokenAddress && !decimals) {
				throw new Error(
					"Please provide a Token Address and the decimals of this Tokens"
				);
			}

			if (!web3) {
				throw new Error("Please provide a valid web3 provider");
			}
			if (acc) {
				this.acc = acc;
			}
			this.params = {
				web3: web3,
				contractAddress: contractAddress,
				contract: new Contract(web3, fixedswap, contractAddress),
				erc20TokenContract: new ERC20TokenContract({
					web3: web3,
					decimals: decimals,
					contractAddress: tokenAddress,
					acc,
				}),
			};

			this.decimals = decimals;
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
	}

	__sendTx = async (f, call = false, value) => {
		var res;
		if (!this.acc) {
			const accounts = await this.params.web3.eth.getAccounts();
			res = await f.send({
				from: accounts[0],
				value: value,
			});
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

	__deploy = async (params) => {
		return await this.params.contract.deploy(
			this.acc,
			this.params.contract.getABI(),
			this.params.contract.getJSON().bytecode,
			params
		);
	};

	/**
	 * @function setNewOwner
	 * @description Set New Owner of the Contract
	 * @param {string} address 
	 */
	setNewOwner = async ({ address }) => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.transferOwnership(address)
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	* @function owner
	* @description Get Owner of the Contract
	* @returns {string} address 
	*/

	async owner() {
		try {
			return await this.params.contract
				.getContract()
				.methods.owner()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function isPaused
	* @description Get Owner of the Contract
	* @returns {boolean} 
	*/

	async isPaused() {
		try {
			return await this.params.contract
				.getContract()
				.methods.paused()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function pauseContract
	* @type admin
	* @description Pause Contract
	*/
	async pauseContract() {
		try {
			return await this.__sendTx(
				this.params.contract.getContract().methods.pause()
			);
		} catch (err) {
			throw err;
		}
	}

	/**
	* @function unpauseContract
	* @type admin
	* @description Unpause Contract
	*/
	async unpauseContract() {
		try {
			return await this.__sendTx(
				this.params.contract.getContract().methods.unpause()
			);
		} catch (err) {
			throw err;
		}
	}

	/* Get Functions */
	/**
	* @function tradeValue
	* @description Get swapratio for the pool
	* @returns {Integer} trade value against ETH 
	*/
	async tradeValue() {
		try {
			return Numbers.fromDecimals(
				(await this.params.contract
					.getContract()
					.methods.tradeValue()
					.call(),
				this.getDecimals())
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function startDate
	* @description Get Start Date of Pool
	* @returns {Date} 
	*/
	async startDate() {
		try {
			return Numbers.fromSmartContractTimeToMinutes(
				await this.params.contract
					.getContract()
					.methods.startDate()
					.call()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function endDate
	* @description Get End Date of Pool
	* @returns {Date} 
	*/
	async endDate() {
		try {
			return Numbers.fromSmartContractTimeToMinutes(
				await this.params.contract
					.getContract()
					.methods.endDate()
					.call()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function individualMinimumAmount
	* @description Get Individual Minimum Amount for each address 
	* @returns {Integer} 
	*/
	async individualMinimumAmount() {
		try {
			return Numbers.fromDecimals(
				await this.params.contract
					.getContract()
					.methods.individualMinimumAmount()
					.call(),
				this.getDecimals()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function individualMaximumAmount
	* @description Get Individual Maximum Amount for each address 
	* @returns {Integer} 
	*/
	async individualMaximumAmount() {
		try {
			return Numbers.fromDecimals(
				await this.params.contract
					.getContract()
					.methods.individualMaximumAmount()
					.call(),
				this.getDecimals()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function minimumRaise
	* @description Get Minimum Raise amount for Token Sale
	* @returns {Integer} Amount in Tokens
	*/
	async minimumRaise() {
		try {
			return Numbers.fromDecimals(
				await this.params.contract
					.getContract()
					.methods.minimumRaise()
					.call(),
				this.getDecimals()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function tokensAllocated
	* @description Get Total tokens Allocated already, therefore the tokens bought until now
	* @returns {Integer} Amount in Tokens
	*/
	async tokensAllocated() {
		try {
			return Numbers.fromDecimals(
				await this.params.contract
					.getContract()
					.methods.tokensAllocated()
					.call(),
				this.getDecimals()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function tokensForSale
	* @description Get Total tokens Allocated/In Sale for the Pool
	* @returns {Integer} Amount in Tokens
	*/
	async tokensForSale() {
		try {
			return Numbers.fromDecimals(
				await this.params.contract
					.getContract()
					.methods.tokensForSale()
					.call(),
				this.getDecimals()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function tokensAvailable
	* @description Get Total tokens owned by the Pool 
	* @returns {Integer} Amount in Tokens
	*/
	async tokensAvailable() {
		try {
			return Numbers.fromDecimals(
				await this.params.contract
					.getContract()
					.methods.availableTokens()
					.call(),
				this.getDecimals()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function tokensLeft
	* @description Get Total tokens available to be sold in the pool
	* @returns {Integer} Amount in Tokens
	*/
	async tokensLeft() {
		try {
			return Numbers.fromDecimals(
				await this.params.contract
					.getContract()
					.methods.tokensLeft()
					.call(),
				this.getDecimals()
			);
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function isTokenSwapAtomic
	* @description Verify if the Token Swap is atomic on this pool
	* @returns {Boolean}
	*/
	async isTokenSwapAtomic() {
		try {
			return await this.params.contract
				.getContract()
				.methods.isTokenSwapAtomic()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function isFunded
	* @description Verify if the Token Sale is Funded with all Tokens proposed in tokensForSale
	* @returns {Boolean}
	*/
	async isFunded() {
		try {
			return await this.params.contract
				.getContract()
				.methods.isSaleFunded()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function isOpen
	* @description Verify if the Token Sale is Open for Swap
	* @returns {Boolean}
	*/
	async isOpen() {
		try {
			return await this.params.contract
				.getContract()
				.methods.isOpen()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function hasStarted
	* @description Verify if the Token Sale has started the Swap
	* @returns {Boolean}
	*/
	async hasStarted() {
		try {
			return await this.params.contract
				.getContract()
				.methods.hasStarted()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function hasFinalized
	* @description Verify if the Token Sale has finalized, if the current date is after endDate
	* @returns {Boolean}
	*/
	async hasFinalized() {
		try {
			return await this.params.contract
				.getContract()
				.methods.hasFinalized()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function isPreStart
	* @description Verify if the Token Sale in not open yet, where the admin can fund the pool
	* @returns {Boolean}
	*/
	async isPreStart() {
		try {
			return await this.params.contract
				.getContract()
				.methods.isPreStart()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	/**
	* @function getPurchase
	* @description Get Purchase based on ID
	* @param {Integer} purchase_id 
	* @returns {Integer} _id
	* @returns {Integer} amount
	* @returns {Address} purchaser
	* @returns {Integer} ethAmount
	* @returns {Date} timestamp
	* @returns {Boolean} wasFinalized
	* @returns {Boolean} reverted
	*/

	getPurchase = async ({ purchase_id }) => {
		let res = await this.params.contract
			.getContract()
			.methods.getPurchase(purchase_id)
			.call();
		return {
			_id: purchase_id,
			amount: Numbers.fromDecimals(res[0], this.getDecimals()),
			purchaser: res[1],
			ethAmount: Numbers.fromDecimals(res[2], 18),
			timestamp: Numbers.fromSmartContractTimeToMinutes(res[3]),
			wasFinalized: res[4],
			reverted: res[5],
		};
	};

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
			.methods.getPurchaseIds()
			.call();
		return res.map((id) => Numbers.fromHex(id));
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
	* @function getETHCostFromTokens
	* @description Get ETH Cost from Tokens Amount
	* @param {Integer} tokenAmount
	* @returns {Integer} ethAmount
	*/
	getETHCostFromTokens = async ({ tokenAmount }) => {
		try {
			return Numbers.fromDecimals(
				await this.params.contract
					.getContract()
					.methods.cost(tokenAmount)
					.call(),
				18
			);
		} catch (err) {
			return "N/A";
		}
	};

	/* POST User Functions */

	/**
	* @function swap
	* @description Swap tokens by Ethereum
	* @param {Integer} tokenAmount
	*/

	swap = async ({ tokenAmount }) => {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			this.getDecimals()
		);
		console.log("amountWithDecimals", amountWithDecimals)
		let ETHCost = await this.getETHCostFromTokens({
			tokenAmount: amountWithDecimals,
		});
		console.log("ETHCost", ETHCost)
		let ETHToWei = Numbers.toSmartContractDecimals(ETHCost, 18);
		console.log("ETHToWei", ETHToWei)
		return await this.__sendTx(
			this.params.contract.getContract().methods.swap(amountWithDecimals),
			false,
			ETHToWei
		);
	};

	/**
	* @function redeemTokens
	* @variation isStandard
	* @description Reedem tokens bought
	* @param {Integer} purchase_id
	*/

	redeemTokens = async ({ purchase_id }) => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.redeemTokens(purchase_id)
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	* @function redeemGivenMinimumGoalNotAchieved
	* @variation isStandard
	* @description Reedem Ethereum from sale that did not achieve minimum goal
	* @param {Integer} purchase_id
	*/
	redeemGivenMinimumGoalNotAchieved = async ({ purchase_id }) => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.redeemGivenMinimumGoalNotAchieved(purchase_id)
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	* @function withdrawUnsoldTokens
	* @description Withdraw unsold tokens of sale
	*/

	withdrawUnsoldTokens = async () => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.withdrawUnsoldTokens()
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	* @function withdrawFunds
	* @description Withdraw all funds from tokens sold
	*/
	withdrawFunds = async () => {
		try {
			return await this.__sendTx(
				this.params.contract.getContract().methods.withdrawFunds()
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	* @function approveFundERC20
	* @description Approve the pool to use approved tokens for sale
	*/
	approveFundERC20 = async ({ tokenAmount }) => {
		return await this.params.erc20TokenContract.approve({
			address: this.getAddress(),
			amount: tokenAmount,
		});
	};

	/**
	* @function isApproved
	* @description Verify if the Admin has approved the pool to use receive the tokens for sale
	* @param {Integer} tokenAmount
	* @param {Address} address
	* @returns {Boolean}
	*/
	isApproved = async ({tokenAmount, address}) => {
		console.log("address", address, tokenAmount)
		return await this.params.erc20TokenContract.isApproved({address : address, amount : tokenAmount, spenderAddress : this.getAddress()});
	}

	/**
	* @function fund
	* @description Send tokens to pool for sale, fund the sale
	* @param {Integer} tokenAmount
	*/
	fund = async ({tokenAmount}) => {
		try {
			let amountWithDecimals = Numbers.toSmartContractDecimals(
				tokenAmount,
				this.getDecimals()
			);

			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.fund(amountWithDecimals)
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	* @function removeOtherERC20Tokens
	* @description Remove Tokens from other ERC20 Address (in case of accident)
	* @param {Address} tokenAddress
    * @param {Address} toAddress
	*/
	removeOtherERC20Tokens = async ({tokenAddress, toAddress}) => {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.removeOtherERC20Tokens(tokenAddress, toAddress)
			);
		} catch (err) {
			throw err;
		}
	};

	__assert() {
		this.params.contract.use(fixedswap, this.getAddress());
	}

	getDecimals = () => this.decimals || 18;

	fromIntToFloatEthereum(int) {
		return Math.round(int * 100);
	}

	/**
	* @function deploy
	* @description Deploy the Pool Contract

	*/
	deploy = async ({
		tradeValue,
		tokensForSale,
		startDate,
		endDate,
		individualMinimumAmount = 0,
		individualMaximumAmount = 0,
		isTokenSwapAtomic = true,
		minimumRaise = 0,
		feeAmount = 1,
	}) => {
		try {
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

			let params = [
				this.getTokenAddress(),
				Numbers.toSmartContractDecimals(tradeValue, 18) /* to wei */,
				Numbers.toSmartContractDecimals(
					tokensForSale,
					this.getDecimals()
				),
				Numbers.timeToSmartContractTime(startDate),
				Numbers.timeToSmartContractTime(endDate),
				Numbers.toSmartContractDecimals(
					individualMinimumAmount,
					this.getDecimals()
				),
				Numbers.toSmartContractDecimals(
					individualMaximumAmount,
					this.getDecimals()
				),
				isTokenSwapAtomic,
				Numbers.toSmartContractDecimals(
					minimumRaise,
					this.getDecimals()
				),
				parseInt(feeAmount),
			];
			console.log("params", params);
			let res = await this.__deploy(params);
			this.params.contractAddress = res.contractAddress;
			/* Call to Backend API */

			this.__assert({ contractAddress: res.contractAddress });
			return res;
		} catch (err) {
			throw err;
		}
	};

	getAddress() {
		return this.params.contractAddress;
	}

	getTokenAddress() {
		return this.params.erc20TokenContract.getAddress();
	}

	getTokenContract() {
		return this.params.erc20TokenContract;
	}

	/**
	* @function getOwner
	* @description Get owner address of contract
	* @param {Address} Address
	*/
	getOwner = async () => {
		try {
			return await this.params.contract
				.getContract()
				.methods.owner()
				.call();
		} catch (err) {
			return "N/A";
		}
	};
	/* Backend API */
}

export default FixedSwapContract;
