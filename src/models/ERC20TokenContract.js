import contract from "./Contract";
import { ierc20 } from "../interfaces";
import Numbers from "../utils/Numbers";
import Client from "../utils/Client";
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
	
	getContract() {
		return this.params.contract.getContract();
	}

	getAddress() {
		return this.params.contractAddress;
	}

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

	async getTokenAmount(address) {
		return Numbers.fromDecimals(
			await this.getContract().methods.balanceOf(address).call(),
			await this.getDecimals()
		);
	}

	async totalSupply() {
		return await this.getContract().methods.totalSupply().call();
	}

	getABI() {
		return self.contract;
	}

	async getDecimals(){
		if (!this.params.decimals) {
			this.params.decimals = parseInt(await this.getContract().methods.decimals().call());
		}
		return this.params.decimals;
	}

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
