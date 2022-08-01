import contract from "./Contract";
import { ierc20 } from "../../interfaces";
import Numbers from "../../utils/Numbers";
import Client from "../../utils/Client";
let self;

class ERC20TokenContract {
	constructor({contractAddress, web3, acc}) {
		if(acc){
			this.acc = acc;
		}
		this.params = {
			web3 : web3,
			contractAddress : contractAddress,
			contract: new contract(web3, ierc20, contractAddress),
			decimals : null
		};
		self = {
			contract: new contract(web3, ierc20, contractAddress)
		};
		this.client = new Client();
	}

	__assert() {
		this.params.contract.use(ierc20, this.getAddress());
	}

    /**
     * @function getContract
     * @description Get an instance of this contract
     * @returns {Contract}
     */
	getContract() {
		return this.params.contract.getContract();
	}

    /**
     * @function getAddress
     * @description Get address of this contract
     * @returns {Address}
     */
	getAddress() {
		return this.params.contractAddress;
	}

    /**
     * @function setNewOwner
     * @description Set new owner
     * @param {Address} address
     */
	setNewOwner = async ({ address }) => {
		try {
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
				.getContract()
				.methods.transferOwnership(address)
			);
		} catch (err) {
			console.log(err);
		}
	};

    /**
     * @function transferTokenAmount
     * @description Transfer tokens
     * @param {Address} toAddress
     */
	async transferTokenAmount({ toAddress, tokenAmount}) {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			await this.getDecimals()
		);
		return await this.client.sendTx(

			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract
			.getContract()
			.methods.transfer(toAddress, amountWithDecimals)
		);
	}

    /**
     * @function getTokenAmount
     * @description Get token amount for a given address
     * @param {Address} address
     * @returns {Integer} Token amount
     */
	async getTokenAmount(address) {
		return Numbers.fromDecimals(
			await this.getContract().methods.balanceOf(address).call(),
			await this.getDecimals()
		);
	}

	/**
     * @function totalSupply
     * @description Get the token total supply
     * @returns {Integer}
     */
	async totalSupply() {
		return await this.getContract().methods.totalSupply().call();
	}

    /**
     * @function getABI
     * @description Get ABI token contract
     * @returns {Object} ABI object
     */
	getABI() {
		return self.contract;
	}

    /**
     * @function getDecimals
     * @description Returns number of decimals of this token
     * @returns {Integer}
     */
	async getDecimals(){
		if (!this.params.decimals) {
			this.params.decimals = parseInt(await this.getContract().methods.decimals().call());
		}
		return this.params.decimals;
	}

    /**
     * @function isApproved
     * @description Check the allowance for these given parameters
     * @param {Address} address
	 * @param {Integer} amount
	 * @param {Address} spenderAddress
	 * @param {Function} callback
     * @returns {Boolean}
     */
	async isApproved({ address, amount, spenderAddress, callback }) {
		try {
			let res =  await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
				.getContract()
				.methods.allowance(address, spenderAddress),
				true,
				null,
				callback
			);

			let approvedAmount = Numbers.fromDecimals(res, await this.getDecimals());
			if (typeof amount === 'string' || amount instanceof String) {
				amount = parseFloat(amount);
			}
			return (approvedAmount >= amount);
		} catch (err) {
			throw err;
		}
	}

    /**
     * @function approve
     * @description Requests approvement for for these given parameters
     * @param {Address} address
	 * @param {Integer} amount
	 * @param {Function} callback
     * @returns {Boolean}
     */
	async approve({ address, amount, callback }) {
		try {
			let amountWithDecimals = Numbers.toSmartContractDecimals(
				amount,
				await this.getDecimals()
			);
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
				.getContract()
				.methods.approve(address, amountWithDecimals),
				null,
				null,
				callback
			);
		} catch (err) {
			throw err;
		}
	}
}

export default ERC20TokenContract;
