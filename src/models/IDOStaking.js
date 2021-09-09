import Contract from "./Contract";
import { idostaking } from "../interfaces";
import Numbers from "../utils/Numbers";
import ERC20TokenContract from "./ERC20TokenContract";

/**
 * IDO Staking Object
 * @constructor IDOStaking
 * @param {Web3} web3
 * @param {string} contractAddress The staking contract address.
 * @param {Account} acc
 */
 class IDOStaking {

	constructor({
		web3,
		contractAddress,
		acc,
	}) {
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
            contract: new Contract(web3, idostaking, contractAddress),
        };
    }

    /**
	 * @function stake
	 * @description Stakes tokens inside the stake contract
	 * @param {Integer} amount Amount
	 */
	 stake = async ({ amount }) => {
        amount = Numbers.toSmartContractDecimals(
			amount,
			await this.getDecimals()
		)
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.stake(amount)
			);
		} catch (err) {
			throw err;
		}
	};

    /**
	 * @function approveStakeERC20
	 * @param {Integer} tokenAmount
	 * @description Approve the stake to use approved tokens
	 */
	approveStakeERC20 = async ({ tokenAmount, callback }) => {
		return await (await this.getTokenContract()).approve({
			address: this.params.contractAddress,
			amount: tokenAmount,
			callback
		});
	};

    /**
	 * @function isApproved
	 * @description Verify if the address has approved the staking to deposit
	 * @param {Integer} tokenAmount
	 * @param {Address} address
	 * @returns {Boolean}
	 */
	isApproved = async ({ tokenAmount, address }) => {
		return await (await this.getTokenContract()).isApproved({
			address: address,
			amount: tokenAmount,
			spenderAddress: this.params.contractAddress
		});
	};

    /**
	 * @function withdraw
	 * @param {Integer} amount
	 * @description Withdraw tokens from the stake contract
	 */
	 withdraw = async ({amount}) => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.withdraw(Numbers.toSmartContractDecimals(
						amount,
						await this.getDecimals()
					))
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	 * @function withdrawAll
	 * @description Withdraw all the tokens from the stake contract
	 */
	 withdrawAll = async () => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.withdrawAll()
			);
		} catch (err) {
			throw err;
		}
	};

    /**
	 * @function claim
	 * @description Claim rewards from the staking contract
	 */
	 claim = async () => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.getReward()
			);
		} catch (err) {
			throw err;
		}
	};

    /**
	 * @function userAccumulatedRewards
	 * @description Returns the accumulated rewards
	 * @param {string} address
	 * @returns {Integer} userAccumulatedRewards
	*/
    userAccumulatedRewards = async ({address}) => {
		return await this.params.contract.getContract().methods.earned(address).call();
	}

    /**
	 * @function stakeAmount
	 * @description Returns the stake amount for a wallet
	 * @param {string} address
	 * @returns {Integer} stakeAmount
	*/
    stakeAmount = async ({address}) => {
		return Numbers.fromDecimals(
            await this.params.contract.getContract().methods.balanceOf(address).call(),
            await this.getDecimals()
        );
	}

    getDecimals = async () => {
		return await (await this.getTokenContract()).getDecimals();
	}

    getTokenContract = async () => {
		if (!this.params.erc20TokenContract) {
			this.params.erc20TokenContract = new ERC20TokenContract({
				web3: web3,
				contractAddress: await this.params.contract.getContract().methods.stakingToken().call(),
				acc: this.acc
			});
		}
		return this.params.erc20TokenContract;
	}

    // ToDo Refactor
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
}

export default IDOStaking;
