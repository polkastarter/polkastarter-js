import Contract from "./Contract";
import { staking } from "../interfaces";
import Numbers from "../utils/Numbers";
import ERC20TokenContract from "./ERC20TokenContract";

/**
 * Staking Object
 * @constructor Staking
 * @param {Web3} web3
 * @param {string=} contractAddress The staking contract address. (Default: Predefined addresses depending on the network)
 * @param {Account} acc
 * @param {string=} tokenAddress The staking token address. (Default: Predefined addresses depending on the network)
 * @param {(ETH|BSC|MATIC|DOT)=} network The network where the staking contract is. (Default: ETH)
 * @param {Boolean=} test ? Specifies if we're on test env (Default: false)
 */
 class Staking {

    stakingAddresses = {};
    tokenAddresses = {};
    stakingTestAddresses = {
        'BSC': '0x20c48C19Ca7079Ed8E7CD317829d4ebf75125390',
        'ETH': '0x2F5E00fB8d2cd712Cc64343c6E13eD0dD966AFDD'
    };
    tokenTestAddresses = {
        'BSC': '0xcfd314B14cAB8c3e36852A249EdcAa1D3Dd05055',
        'ETH': '0x03EF180c07D30E46CAc83e5b9E282a9B295ca8A9'
    };

	constructor({
		web3,
		contractAddress,
		acc,
        tokenAddress,
        network = 'ETH',
        test = false
	}) {
        if (!web3) {
            throw new Error("Please provide a valid web3 provider");
        }
        if((network != 'ETH') && (network != 'DOT') && (network != 'BSC') && (network !='MATIC')){
			throw new Error("Network has to be ETH or DOT or BSC or MATIC");
		}
        this.web3 = web3;
        this.version = "2.0";
        if (acc) {
            this.acc = acc;
        }

        if (!contractAddress) {
            let stakingAddresses = this.stakingAddresses;
            if (test) {
                stakingAddresses = this.stakingTestAddresses;
            }
            contractAddress = stakingAddresses[network];
            if (!contractAddress) {
                throw new Error('Staking not available on the network ' + network);
            }
        }

        this.params = {
            web3: web3,
            contractAddress: contractAddress,
            contract: new Contract(web3, staking, contractAddress),
        };

        if (!tokenAddress) {
            let tokenAddresses = this.tokenAddresses;
            if (test) {
                tokenAddresses = this.tokenTestAddresses;
            }
            tokenAddress = tokenAddresses[network];
            if (!tokenAddress) {
                throw new Error('Token not available on the network ' + network);
            }
        }

        this.params.erc20TokenContract = new ERC20TokenContract({
            web3: web3,
            contractAddress: tokenAddress,
            acc
        });
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
		return await this.getTokenContract().approve({
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
		return await this.getTokenContract().isApproved({
			address: address,
			amount: tokenAmount,
			spenderAddress: this.params.contractAddress
		});
	};

    /**
	 * @function withdraw
	 * @description Withdraw tokens from the stake contract
	 */
	 withdraw = async () => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.withdraw()
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
					.methods.claim()
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
		return await this.params.contract.getContract().methods.userAccumulatedRewards(address).call();
	}

	/**
	 * @function stakeTime
	 * @description Returns the stake time for a wallet
	 * @param {string} address
	 * @returns {Integer} stakeTime
	*/
    stakeTime = async ({address}) => {
		return await this.params.contract.getContract().methods.stakeTime(address).call();
	}

    /**
	 * @function lockTimePeriod
	 * @description Returns the lock time perdio
	 * @returns {Integer} lockTimePeriod
	*/
    getLockTimePeriod = async () => {
		return await this.params.contract.getContract().methods.lockTimePeriod().call();
	}
    
    /**
	 * @function getUnlockTime
	 * @description Returns the stake time for a wallet
	 * @param {string} address
	 * @returns {Integer} unlockTime
	*/
    getUnlockTime = async ({address}) => {
		return await this.params.contract.getContract().methods.getUnlockTime(address).call();
	}

    /**
	 * @function stakeAmount
	 * @description Returns the stake amount for a wallet
	 * @param {string} address
	 * @returns {Integer} stakeAmount
	*/
    stakeAmount = async ({address}) => {
		return Numbers.fromDecimals(
            await this.params.contract.getContract().methods.stakeAmount(address).call(),
            await this.getDecimals()
        );
	}

    getDecimals = async () => {
		return 18;
	}

    getTokenContract() {
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

export default Staking;
