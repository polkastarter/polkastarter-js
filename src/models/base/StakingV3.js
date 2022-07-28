import Contract from "./Contract";
import { stakingv3 } from "../../interfaces";
import Numbers from "../../utils/Numbers";
import ERC20TokenContract from "./ERC20TokenContract";
import Client from "../../utils/Client";
import Addresses from "./Addresses";
import Chains from "../../utils/Chains";

/**
 * StakingV3 Object
 * @constructor StakingV3
 * @param {Web3} web3
 * @param {string=} contractAddress The staking V3 contract address. (Default: Predefined addresses depending on the network)
 * @param {Account} acc
 * @param {string=} tokenAddress The staking token address. (Default: Predefined addresses depending on the network)
 * @param {(ETH|BSC|MATIC|DOT)=} network The network where the staking V3 contract is. (Default: ETH)
 * @param {Boolean=} test ? Specifies if we're on test env (Default: false)
 */
 class StakingV3 {

    stakingAddresses = {
        // 'BSC': '0xD558675a8c8E1fd45002010BaC970B115163dE3a',
        // 'ETH': '0xc24A365A870821EB83Fd216c9596eDD89479d8d7'
    };
    stakingTestAddresses = {
        // 'BSC': '0x1621AEC5D5B2e6eC6D9B58399E9D5253AF86DF5f',
        // 'ETH': '0xa297c295aFcac59c749e25A02811a02B2f7D3Ab5'
        'BSC': '0x48F5EDDA2c6b503C79FF590ed8AAFF54f7463EB9',
        // 'ETH': '0xa297c295aFcac59c749e25A02811a02B2f7D3Ab5' old version
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
        this.version = "3.0";
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
            contract: new Contract(web3, stakingv3, contractAddress),
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
     * @function claim
     * @description Claim rewards from the staking V3 contract
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
     * @function extendLockTime
     * @description  Extend lock period to get more upfront rewards. Actually just a special case of _stakelockTimeChoice(0, lockTimeIndex)
     * @param {Integer} lockTimeIndex index to the lockTimePeriod array , if 0 then do not change current unlockTime
     * @returns {Integer} lockTimeIndex index to the lockTimePeriod array
     */
    extendLockTime = async ({lockTimeIndex}) => {
        try {
            return await this.client.sendTx(
                this.params.web3,
                this.acc,
                this.params.contract,
                this.params.contract
                    .getContract()
                    .methods.extendLockTime(
                        lockTimeIndex
                    )
            );
        } catch (err) {
            throw err;
        }
    }

    getDecimals = async () => {
        return 18;
    }

    /**
     * @function getLockTimePeriod
     * @description Returns the default lock time period
     * @returns {Integer} defaultLockTimePeriod
     */
    getLockTimePeriod = async () => {
        return await this.params.contract.getContract().methods.getLockTimePeriod().call();
    }

    getTokenContract() {
        return this.params.erc20TokenContract;
    }

    /**
     * @function getUnlockTime
     * @description Returns the stake time for a wallet
     * @param {Address} address
     * @returns {Integer} unlockTime
    */
    getUnlockTime = async ({address}) => {
        return await this.params.contract.getContract().methods.getUnlockTime(address).call();
    }

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
     * @function remainingLockPeriod
     * @description Return remaining lock time period
     * @param {Address} address
     * @returns {Integer} unlockTime remaining time in seconds
     */
    remainingLockPeriod = async ({address}) => {
        return await this.params.contract.getContract().methods.remainingLockPeriod(address).call();
    }

    /**
     * @function getLockTimePeriodOptions
     * @description Get all the lock time periods available
     * @returns {Integer[]} array of lock times the user can choose from when staking
     */
    getLockTimePeriodOptions = async () => {
        return await this.params.contract.getContract().methods.getLockTimePeriodOptions().call();
    }

    /**
     * @function getLockTimePeriodRewardFactors
     * @description Get all the reward factors available
     * @returns {Integer[]} array of reward factors the user can choose from when staking
     */
    getLockTimePeriodRewardFactors = async () => {
        return await this.params.contract.getContract().methods.getLockTimePeriodRewardFactors().call();
    }

    /**
     * @function remainingLockPeriod_msgSender
     * @description Returns remaining lock time period
     * @returns {Integer} unlockTime remaining time in seconds
     */
    remainingLockPeriod_msgSender = async () => {
        return await this.params.contract.getContract().methods.remainingLockPeriod_msgSender().call();
    }

    /**
     * @function migrateRewards
     * @description Migrate rewards from previous (v1/v2) staking contract
     * @param {Address} staker
     */
    migrateRewards = async ({staker}) => {
        try {
            return await this.client.sendTx(
                this.params.web3,
                this.acc,
                this.params.contract,
                this.params.contract
                    .getContract()
                    .methods.migrateRewards(staker)
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * @function migrateRewards_msgSender
     * @description Migrate msgSender's rewards from previous (v1/v2) staking contract
     */
    migrateRewards_msgSender = async () => {
        try {
            return await this.client.sendTx(
                this.params.web3,
                this.acc,
                this.params.contract,
                this.params.contract
                    .getContract()
                    .methods.migrateRewards_msgSender()
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * @function setLockTimePeriodDefault
     * @description Setup time in seconds for default lock time period
     * @param {Integer} defaultLockTime
     */
     setLockTimePeriodDefault = async ({defaultLockTime}) => {
        try {
            return await this.client.sendTx(
                this.params.web3,
                this.acc,
                this.params.contract,
                this.params.contract
                    .getContract()
                    .methods.setLockTimePeriodDefault(
                        defaultLockTime
                    )
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * @function setLockTimePeriodOptions
     * @description Set lock time options the user can choose from when staking
     * @param {Integer[]} lockTimePeriod array of lock times the user can choose from when staking
     * @param {Integer[]} lockTimePeriodRewardFactor array of reward factors for each option
     */
    setLockTimePeriodOptions = async ({lockTimePeriod, lockTimePeriodRewardFactor}) => {
        try {
            return await this.client.sendTx(
                this.params.web3,
                this.acc,
                this.params.contract,
                this.params.contract
                    .getContract()
                    .methods.setLockTimePeriodOptions(
                        lockTimePeriod,
                        lockTimePeriodRewardFactor

                    )
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * @function setLockedRewardsEnabled
     * @description Set lock rewards to true/false
     * @param {Boolean} lockedRewardsEnabled
     */
    setLockedRewardsEnabled = async ({lockedRewardsEnabled}) => {
        try {
            return await this.client.sendTx(
                this.params.web3,
                this.acc,
                this.params.contract,
                this.params.contract
                    .getContract()
                    .methods.setLockedRewardsEnabled(
                        lockedRewardsEnabled
                    )
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * @function setPrevPolsStaking
     * @description Set previous staking contract address to migrate to this version
     * @param {Address} prevPolsStakingAddress
     */
    setPrevPolsStaking = async ({prevPolsStakingAddress}) => {
        try {
            return await this.client.sendTx(
                this.params.web3,
                this.acc,
                this.params.contract,
                this.params.contract
                    .getContract()
                    .methods.setPrevPolsStaking(
                        prevPolsStakingAddress
                    )
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * @function setUnlockedRewardsFactor
     * @description Set unlocked rewards factor
     * @param {Integer} unlockedRewardsFactor
     */
    setUnlockedRewardsFactor = async ({unlockedRewardsFactor}) => {
        try {
            return await this.client.sendTx(
                this.params.web3,
                this.acc,
                this.params.contract,
                this.params.contract
                    .getContract()
                    .methods.setUnlockedRewardsFactor(
                        unlockedRewardsFactor
                    )
            );
        } catch (err) {
            throw err;
        }
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
     * @function stakeAmount
     * @description Returns the stake amount for a wallet
     * @param {Address} address
     * @returns {Integer} stakeAmount
     */
    stakeAmount = async ({address}) => {
        return Numbers.fromDecimals(
            await this.params.contract.getContract().methods.stakeAmount(address).call(),
            await this.getDecimals()
        );
    }

    /**
     * @function stakeLockTimeChoice
     * @description Stake tokens for a lock time choice
     * @param {Integer} amount Amount of tokens to stake
     * @param {Integer} lockTimeIndex to choose lock time
     */
    stakeLockTimeChoice = async ({amount, lockTimeIndex}) => {
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
                    .methods.stakelockTimeChoice(amount, lockTimeIndex)
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * @function stakeTime
     * @description Returns the stake time for a wallet
     * @param {Address} address
     * @returns {Integer} stakeTime
     */
    stakeTime = async ({address}) => {
        return await this.params.contract.getContract().methods.stakeTime(address).call();
    }

    /**
     * @function topUp
     * @description Increase staked amount, but keep unlock time unchanged. Actually just a special case of _stakelockTimeChoice(amount, 0)
     * @param {Integer} amount of token to be staked
     * @returns {Integer} Amount of token to be staked
     */
    topUp = async ({amount}) => {
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
                    .methods.topUp(amount)
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * @function userAccumulatedRewards
     * @description Returns the accumulated rewards
     * @param {Address} address
     * @returns {Integer} userAccumulatedRewards
     */
    userAccumulatedRewards = async ({address}) => {
        return await this.params.contract.getContract().methods.userAccumulatedRewards(address).call();
    }

    /**
     * @function userClaimableRewards
     * @description Calculate current reward for an account
     * @param {Address} staker account to do the reward calculation for
     * @returns {Integer} claimableReward for this stacker account
     */
    userClaimableRewards = async ({staker}) => {
        return await this.params.contract.getContract().methods.userClaimableRewards(staker).call();
    }

    /**
     * @function userClaimableRewardsCalculation
     * @description Calculate current rewards at time t0. This function is for better testing and "what-if" UX scenarios
     * @param {Integer} user_stakeAmount  amount of staked tokens
     * @param {Integer} user_stakeTime    time the user has staked
     * @param {Integer} user_unlockTime   time when user's staked tokens will be unlocked
     * @param {Integer} t0                current block time
     * @param {Integer} endTime           time when the rewards scheme will end
     * @param {Boolean} lockedRewards     true => user will get full rewards for lock time upfront (v3 default mode)
     * @param {Boolean} lockedRewardsCurrent true => only calculate locked rewards up to t0
     * @param {Integer} user_stakePeriodRewardFactor is a reward factor for a given lock period option
     * @returns {Integer} ClaimableRewards rewards user has received / can claim at this block time
     */
    userClaimableRewardsCalculation = async ({
        userStakeAmount,
        userStakeTime,
        userUnlockTime,
        t0,
        endTime,
        lockedRewards,
        lockedRewardsCurrent,
        userStakePeriodRewardFactor
    }) => {
        return await this.params.contract.getContract().methods._userClaimableRewardsCalculation(
            userStakeAmount,
            userStakeTime,
            userUnlockTime,
            t0,
            endTime,
            lockedRewards,
            lockedRewardsCurrent,
            userStakePeriodRewardFactor
        ).call();
    }

    /**
     * @function userClaimableRewardsCurrent
     * @description Calculate current reward for an account
     * @param {Address} staker account to do the reward calculation for
     * @param {Boolean} lockedRewardsCurrent true => only calculate locked rewards up to block_timestamp (used for stake update)
     * @returns {Integer} claimableReward for this stacker account depending of lockedRewardsCurrent
     */
    userClaimableRewardsCurrent = async ({staker, lockedRewardsCurrent}) => {
        return await this.params.contract.getContract().methods.userClaimableRewardsCurrent(staker, lockedRewardsCurrent).call();
    }

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

}

export default StakingV3;