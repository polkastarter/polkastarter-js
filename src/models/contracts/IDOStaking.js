import Contract from "../base/Contract";
import { idostaking } from "../../interfaces";
import Numbers from "../../utils/Numbers";
import ERC20TokenContract from "../base/ERC20TokenContract";
import Client from "../../utils/Client";

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
		client
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
		this.client = client;
    }

	/**
	 * @function deploy
	 * @description Deploys the IDO Staking contracts
	 * @param {string} owner Address of the owner
	 * @param {string} rewardsDistribution Address of the distributor
	 * @param {string} rewardsToken Address of the token we want to reward
	 * @param {string} stakingToken Address of the token to be staked
	 * @param {Integer} rewardsDuration Duration of the rewards
	 * @param {string} tokenSaleAddress Address of the pool
	 * @returns {string} address The deployed contract address
	 */
	deploy = async ({
		owner,
        rewardsDistribution,
        rewardsToken,
        stakingToken,
        rewardsDuration,
		tokenSaleAddress = '0x0000000000000000000000000000000000000000',
		callback
	}) => {
		const params = [
			owner,
			rewardsDistribution,
			rewardsToken,
			stakingToken,
			rewardsDuration,
			tokenSaleAddress
		];
		const res = await this.__deploy(params, callback);
		this.params.contractAddress = res.contractAddress;
		return res.contractAddress;
	}

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
					.methods.stake(amount),
				false,
				undefined,
				this.params.contract
					.getContract()
					.methods.stake(amount).encodeABI()
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
	 * @function getAPY
	 * @description Returns the APY that this pool is giving
	 * @returns {Integer}
	 */
	getAPY = async () => {
		const oneYear = 31556952;
		const duration = await this.params.contract
				.getContract()
				.methods.rewardsDuration()
				.call();
		const rewardPerToken = await this.params.contract
			.getContract()
			.methods.rewardPerToken()
			.call();

		return parseInt((parseInt(rewardPerToken) * 100) / (parseInt(duration) / oneYear));
	}

    /**
	 * @function withdraw
	 * @param {Integer} amount
	 * @description Withdraw tokens from the stake contract
	 */
	 withdraw = async ({amount}) => {
		try {
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.withdraw(Numbers.toSmartContractDecimals(
						amount,
						await this.getDecimals()
					)),
				false,
				undefined,
				this.params.contract
					.getContract()
					.methods.withdraw(Numbers.toSmartContractDecimals(
						amount,
						await this.getDecimals()
					)).encodeABI()
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
					.methods.withdrawAll(),
				false,
				undefined,
				this.params.contract
					.getContract()
					.methods.withdrawAll().encodeABI()
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	 * @function exit
	 * @description Claims all the rewards and withdraws all the staked tokens
	 */
	exit = async () => {
		try {
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.exit(),
				false,
				undefined,
				this.params.contract
					.getContract()
					.methods.exit().encodeABI()
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
					.methods.getReward(),
				false,
				undefined,
				this.params.contract
					.getContract()
					.methods.getReward().encodeABI()
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	 * @function notifyRewardAmountSamePeriod
	 * @description add (more) rewards token to current/future period
	 * @param {Integer} amount
	 */
	notifyRewardAmountSamePeriod = async ({reward}) => {
		try {
			const amount = Numbers.toSmartContractDecimals(
				reward,
				await this.getRewardsDecimals()
			);
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.notifyRewardAmountSamePeriod(amount),
				false,
				undefined,
				this.params.contract
					.getContract()
					.methods.notifyRewardAmountSamePeriod(amount).encodeABI()
			);
		} catch (err) {
			throw err;
		}
	};

	/**
	 * @function transferRewardTokenSamePeriod
	 * @description Transfer and add (more) rewards token to current/future period
	 * @param {Integer} amount
	 */
	 transferRewardTokenSamePeriod = async ({reward}) => {
		try {
			const amount = Numbers.toSmartContractDecimals(
				reward,
				await this.getRewardsDecimals()
			);
			return await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.transferRewardTokenSamePeriod(amount),
				false,
				undefined,
				this.params.contract
					.getContract()
					.methods.transferRewardTokenSamePeriod(amount).encodeABI()
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
		return Numbers.fromDecimals(
			await this.params.contract.getContract().methods.earned(address).call(),
			await this.getRewardsDecimals(),
		);
	}

	/**
	 * @function recoverERC20
	 * @description Emergency withdrawal of tokens
	 * @param {string} address Token address
	*/
    recoverERC20 = async ({address}) => {
		await this.client.sendTx(
			this.params.web3,
			this.acc,
			this.params.contract,
			this.params.contract
				.getContract()
				.methods.recoverERC20(address),
			false,
			undefined,
			this.params.contract
				.getContract()
				.methods.recoverERC20(address).encodeABI()
		);
	}
	
	/**
	 * @function lastTimeRewardApplicable
	 * @description Get the last time rewards are applicable
	 * @returns {Date}
	 */
	 async lastTimeRewardApplicable() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.params.contract.getContract().methods.lastTimeRewardApplicable().call()
		);
	}

	/**
	 * @function periodFinish
	 * @description Get when the staking finishes
	 * @returns {Date}
	 */
	 async periodFinish() {
		return Numbers.fromSmartContractTimeToMinutes(
			await this.params.contract.getContract().methods.periodFinish().call()
		);
	}

	/**
	 * @function totalStaked
	 * @description Returns the total stake
	 * @returns {Integer} totalStakeAmount
	*/
    totalStaked = async () => {
		return Numbers.fromDecimals(
            await this.params.contract.getContract().methods.totalSupply().call(),
            await this.getDecimals()
        );
	}
	
	/**
	 * @function balanceRewardsToken
	 * @description substract staked amount if staked token is the same as rewards token
	 * @returns {Integer} totalRewardsAmount
	*/
    balanceRewardsToken = async () => {
		return Numbers.fromDecimals(
            await this.params.contract.getContract().methods.balanceRewardsToken().call(),
            await this.getDecimals()
        );
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

	/**
	 * @function setTokenSaleAddress
	 * @description Sets the token sale address
	 * @param {string} address
	*/
	setTokenSaleAddress = async ({address}) => {
		try {
			await this.client.sendTx(
				this.params.web3,
				this.acc,
				this.params.contract,
				this.params.contract
					.getContract()
					.methods.setTokenSaleAddress(address),
				false,
				undefined,
				this.params.contract
					.getContract()
					.methods.setTokenSaleAddress(address).encodeABI()
			);
			return true;
		} catch (err) {
			throw err;
		}
	};

    getDecimals = async () => {
		return await (await this.getTokenContract()).getDecimals();
	}

    getTokenContract = async () => {
		if (!this.params.erc20TokenContract) {
			this.params.erc20TokenContract = new ERC20TokenContract({
				web3: this.params.web3,
				contractAddress: await this.params.contract.getContract().methods.stakingToken().call(),
				acc: this.acc,
				client: this.client
			});
		}
		return this.params.erc20TokenContract;
	}

	getRewardsDecimals = async () => {
		return await (await this.getRewardsTokenContract()).getDecimals();
	}

    getRewardsTokenContract = async () => {
		if (!this.params.erc20TokenRewardsContract) {
			this.params.erc20TokenRewardsContract = new ERC20TokenContract({
				web3: this.params.web3,
				contractAddress: await this.params.contract.getContract().methods.rewardsToken().call(),
				acc: this.acc,
				client: this.client
			});
		}
		return this.params.erc20TokenRewardsContract;
	}

}

export default IDOStaking;
