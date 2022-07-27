import Contract from "./Contract";
import { staking } from "../../interfaces";
import Numbers from "../../utils/Numbers";
import ERC20TokenContract from "./ERC20TokenContract";
import Client from "../../utils/Client";
import Addresses from "./Addresses";
import Chains from "../../utils/Chains";

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

    stakingAddresses = {
        'BSC': '0xD558675a8c8E1fd45002010BaC970B115163dE3a',
        'ETH': '0xc24A365A870821EB83Fd216c9596eDD89479d8d7'
	};
    stakingTestAddresses = {
        'BSC': '0x1621AEC5D5B2e6eC6D9B58399E9D5253AF86DF5f',
        'ETH': '0xa297c295aFcac59c749e25A02811a02B2f7D3Ab5'
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

		Chains.checkIfNetworkIsSupported(network);
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
            let tokenAddresses = Addresses.tokenAddresses;
            if (test) {
                tokenAddresses = Addresses.tokenTestAddresses;
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
        this.client = new Client();
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
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
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
	 * @param {Integer} amount
	 * @description Withdraw tokens from the stake contract
	 */
	 withdraw = async ({amount}) => {

        amount = Numbers.toSmartContractDecimals(
			amount,
			await this.getDecimals()
		)
		try {
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.withdraw(amount)
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
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
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
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
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
}

export default Staking;