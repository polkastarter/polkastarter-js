require('dotenv').config();

import Web3 from "web3";
import chai from 'chai';
import { mochaAsync } from '../utils';
import Application from '../../src/models';
import { ierc20, stakingv3, staking } from "../../src/interfaces";
import * as ethers from 'ethers';

var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;

context('Staking Contract V3', async () => {
    var deployerAddress = '0xe797860acFc4e06C1b2B96197a7dB1dFa518d5eB'
    var ERC20TokenAddress;
    var contractStakeV3;
    var StakingV3Address;
    var stakeV3Contract;
    var app;
    var ethersProvider;
    var currentTime;
    var snapshot;
    var lockTimePeriod = [
        1000000000,
        1500000000,
        2000000000
    ];

    var lockTimePeriodRewardFactor = [
        10,
        20,
        30
    ];
    const oneWeekInSeconds = 604800;
    const defaultLockTime = 3500000000;

    const forwardTime = async (time) => {
        // "Roads? Where we’re going, we don’t need roads."
        const date = parseInt(new Date().getTime()/1000);
        currentTime = date + await ethersProvider.send('evm_increaseTime', [ time ]);
        return await ethersProvider.send('evm_mine');
    }
    before(mochaAsync(async () => {
        return new Promise(async (resolve) => {
            // Instance Application using ganache
            const ganacheProvider = require("ganache-core").provider({
                gasLimit: 10000000000,

                gasPrice: 1,
                debug: true,
                accounts: [
                    {
                        secretKey: userPrivateKey,
                        balance: 10000000000000000000
                    }
                ]
            });
            app = new Application({test : true, mainnet : false, network : 'BSC', web3:
                new Web3(ganacheProvider)
            });
            app.web3.eth.transactionConfirmationBlocks = 1;

            ethersProvider = new ethers.providers.Web3Provider(ganacheProvider);

            // Deploy the ERC20
            const contract = new app.web3.eth.Contract(ierc20.abi, null, {data: ierc20.bytecode});
            contract.deploy()
                .send({
                    from: deployerAddress,
                    gas: 4712388,
                })
                .on('confirmation', function(confirmationNumber, receipt){
                    ERC20TokenAddress = receipt.contractAddress;
                    // Deploy the stake V3 contract
                    contractStakeV3 = new app.web3.eth.Contract(stakingv3.abi, null, {data: stakingv3.bytecode});
                    contractStakeV3.deploy({
                            arguments: [ERC20TokenAddress]
                        })
                        .send({
                            from: deployerAddress,
                            gas: 4712388,
                        })
                        .on('confirmation', function(confirmationNumber, receipt){
                            StakingV3Address = receipt.contractAddress;
                            resolve();
                        }).on('error', console.log);

                }).on('error', console.log);
        });
    }));

    beforeEach(mochaAsync(async() => {
        //For each test we restore to this evm snapshot for restart the contract states
        snapshot = await ethersProvider.send('evm_snapshot');
    }));
    afterEach(mochaAsync(async() => {
        await ethersProvider.send('evm_revert', [snapshot]);
    }));
    describe('Main staking functions', () => {
        it('should automatically get addresses', mochaAsync(async () => {
            let stakeV3Contract = await app.getStakingV3({});
            expect(stakeV3Contract).to.not.equal(false);
            expect(stakeV3Contract.params.contractAddress).to.equal('0x48F5EDDA2c6b503C79FF590ed8AAFF54f7463EB9');
            expect(stakeV3Contract.params.erc20TokenContract.params.contractAddress).to.equal('0xcfd314B14cAB8c3e36852A249EdcAa1D3Dd05055');
        }));

        it('should get deployed contract', mochaAsync(async () => {
            stakeV3Contract = await app.getStakingV3({contractAddress: StakingV3Address, tokenAddress: ERC20TokenAddress});
            expect(stakeV3Contract).to.not.equal(false);
        }));

        it('should return empty stake amount at start', mochaAsync(async () => {
            const res = await stakeV3Contract.stakeAmount({address: app.account.getAddress()});
            expect(Number(res).noExponents()).to.equal(Number(0).noExponents());
        }));

        it('should stake after approve', mochaAsync(async () => {
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: 1000})).to.equal(false);
            await stakeV3Contract.approveStakeERC20({tokenAmount: 1000});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: '1000'})).to.equal(true);
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: 1000})).to.equal(true);
            await stakeV3Contract.stake({amount: 1000});
            const res = await stakeV3Contract.stakeAmount({address: app.account.getAddress()});
            expect(Number(res).noExponents()).to.equal(Number(1000).noExponents());

            let unlockTime = parseInt(await stakeV3Contract.stakeTime({address: app.account.getAddress()})) + parseInt(await stakeV3Contract.getLockTimePeriod())

            expect(Number(await stakeV3Contract.getUnlockTime({address: app.account.getAddress()})).noExponents()).to.equal(Number(unlockTime).noExponents())
        }));

        it('should fail withdraw if we didnt reach time', mochaAsync(async () => {
            let failed = false;
            try {
                res = await stakeV3Contract.withdrawAll()
                expect(res).to.not.equal(false);
            } catch (e) {
                failed = true;
            }
            expect(failed).to.equal(true);
        }));

        it('should withdraw after stake', mochaAsync(async () => {
            //stake 1000 tokens
            const mockAmount = 1000;
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount})).to.equal(false);
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});

            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount})).to.equal(true);
            await stakeV3Contract.stake({amount: mockAmount});
            //

            //go to the future
            await forwardTime(lockTimePeriod[0] + 30);

            await stakeV3Contract.withdraw({amount: 400});
            let res = await stakeV3Contract.stakeAmount({address: app.account.getAddress()});
            expect(Number(res).noExponents()).to.equal(Number(600).noExponents());

            await stakeV3Contract.withdrawAll();
            res = await stakeV3Contract.stakeAmount({address: app.account.getAddress()});
            expect(Number(res).noExponents()).to.equal(Number(0).noExponents());

        }));
    });
    describe('New/modified functions in V3', () => {
        it('should stake() after approve', async () => {
            const mockAmount = 1000;
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(false);

            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(true);

            await stakeV3Contract.stake({amount: mockAmount});
            const stakeAmounted = await stakeV3Contract.stakeAmount({address: app.account.getAddress()});
            expect(stakeAmounted).to.equal(mockAmount.toString());

            let mockUnlockTime =
                parseInt(await stakeV3Contract.stakeTime({address: app.account.getAddress()})) +
                parseInt(await stakeV3Contract.getLockTimePeriod());

            const unlockTimeGetted = await stakeV3Contract.getUnlockTime({address: app.account.getAddress()});
            expect(unlockTimeGetted).to.equal(mockUnlockTime);

        });

        it('getLockTimePeriod()', async () => {
            const lockTimePeriodDefault = await stakeV3Contract.getLockTimePeriod();
            expect(lockTimePeriodDefault).to.equal(oneWeekInSeconds);
        });

        it('setLockTimePeriodDefault()', async () => {
            await stakeV3Contract.setLockTimePeriodDefault({defaultLockTime});
        });

        it('remainingLockPeriod()', async () => {
            await stakeV3Contract.setLockTimePeriodDefault({defaultLockTime});
            //stake 1000 tokens
            const mockAmount = 1000;
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount})).to.equal(false);
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});

            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount})).to.equal(true);
            await stakeV3Contract.stake({amount: mockAmount});
            //

            //go to the future
            await forwardTime(30);

            const remainingTime = await stakeV3Contract.remainingLockPeriod({address: deployerAddress});
            expect(remainingTime).to.be.gte(defaultLockTime-100).lte(defaultLockTime);
        });

        it('getLockTimePeriodOptions()', async () => {
            await stakeV3Contract.setLockTimePeriodOptions({lockTimePeriod, lockTimePeriodRewardFactor});
            const lockTimePeriodOptions = await stakeV3Contract.getLockTimePeriodOptions();
            expect(lockTimePeriodOptions).deep.equal(lockTimePeriod);
        });

        it('getLockTimePeriodRewardFactors()', async () => {
            await stakeV3Contract.setLockTimePeriodOptions({lockTimePeriod, lockTimePeriodRewardFactor});
            const factors = await stakeV3Contract.getLockTimePeriodRewardFactors();
            expect(factors).deep.equal(lockTimePeriodRewardFactor);
        });

        it('setLockedRewardsEnabled()', async () => {
            const lockedRewardsEnabled = true;
            await stakeV3Contract.setLockedRewardsEnabled({lockedRewardsEnabled});

            const event = await contractStakeV3.getPastEvents('LockedRewardsEnabledChanged',{fromBlock: 0});
            const valueEmitted = (event.length>0) ? event[0].returnValues.lockedRewardsEnabled : null;

            expect(valueEmitted).to.equal(lockedRewardsEnabled);
        });

        it('setUnlockedRewardsFactor()', async () => {
            const unlockedRewardsFactor = 10;
            await stakeV3Contract.setUnlockedRewardsFactor({unlockedRewardsFactor});

            const event = await contractStakeV3.getPastEvents('UnlockedRewardsFactorChanged',{fromBlock: 0});
            const valueEmitted = (event.length>0) ? event[0].returnValues.unlockedRewardsFactor.toString() : null;

            expect(valueEmitted).to.equal(unlockedRewardsFactor.toString());
        });

        it('setLockTimePeriodOptions()', async () => {
            lockTimePeriod = [
                2500000000,
                3500000000,
                4000000000
            ];
            lockTimePeriodRewardFactor = [
                40,
                50,
                60
            ];
            await stakeV3Contract.setLockTimePeriodOptions({lockTimePeriod, lockTimePeriodRewardFactor});
        });

        it('setPrevPolsStaking()', async () => {
            const prevPolsStakingAddress = '0x1234567890123456789012345678901234567890';
            await stakeV3Contract.setPrevPolsStaking({prevPolsStakingAddress});

            const event = await contractStakeV3.getPastEvents('PrevPolsStakingChanged',{fromBlock: 0});
            const valueEmitted = (event.length>0) ? event[0].returnValues.prevPolsStaking : null;

            expect(valueEmitted).to.equal(prevPolsStakingAddress);
        });

        it('remainingLockPeriod_msgSender()', async () => {
            await stakeV3Contract.setLockTimePeriodDefault({defaultLockTime});

            //stake 1000 tokens
            const mockAmount = 1000;
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount})).to.equal(false);
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});

            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount})).to.equal(true);
            await stakeV3Contract.stake({amount: mockAmount});
            //

            //go to the future
            await forwardTime(30);

            const stakeAmounted = await stakeV3Contract.stakeAmount({address: app.account.getAddress()});
            expect(stakeAmounted).to.equal(mockAmount.toString());

            const remainingTime = await stakeV3Contract.remainingLockPeriod_msgSender();
            expect(remainingTime).to.be.gte(defaultLockTime-100).lte(defaultLockTime);
        });

        it('userClaimableRewards()', async () => {
            const mockAmount = 1000;
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(true);

            await stakeV3Contract.stake({amount: mockAmount});
            await forwardTime(30);

            const rewards = ethers.utils.formatUnits(await stakeV3Contract.userClaimableRewards({staker: deployerAddress}));

            //It can vary depending on the execution time of userClaimableRewardsCurrent()
            const mockRewardsMin = 31000;
            const mockRewardsMax = 36000;
            expect(parseInt(rewards)).to.to.be.gte(mockRewardsMin).lte(mockRewardsMax);
        });

        it('userClaimableRewardsCurrent()', async () => {
            const mockAmount = 1000;
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(true);

            await stakeV3Contract.stake({amount: mockAmount});
            await forwardTime(30);

            const mockRewardsTrue = 31000;
            const mockRewardsFalseMin = 31000;
            const mockRewardsFalseMax = 36000;

            let rewardsTrue = ethers.utils.formatUnits(await stakeV3Contract.userClaimableRewardsCurrent({staker: deployerAddress, lockedRewardsCurrent: true}));
            let rewardsFalse = ethers.utils.formatUnits(await stakeV3Contract.userClaimableRewardsCurrent({staker: deployerAddress, lockedRewardsCurrent: false}));
            //It can vary depending on the execution time of the last two calls to: userClaimableRewardsCurrent()
            expect(parseInt(rewardsTrue)).to.be.gte(0).lte(mockRewardsTrue);
            expect(parseInt(rewardsFalse)).to.be.gte(mockRewardsFalseMin).lte(mockRewardsFalseMax);
        });

        it('userClaimableRewardsCalculation()', async () => {
            const userStakeAmount =             1000;
            const userStakeTime =               100000000;
            const userUnlockTime =              110000000;
            const t0 =                          120000000;
            const endTime =                     115000000;
            const lockedRewards =               true;
            const lockedRewardsCurrent =        false;
            const userStakePeriodRewardFactor = 0;

            const rewards = await stakeV3Contract.userClaimableRewardsCalculation({
                userStakeAmount,
                userStakeTime,
                userUnlockTime,
                t0,
                endTime,
                lockedRewards,
                lockedRewardsCurrent,
                userStakePeriodRewardFactor
            });

            expect(rewards.toString()).to.equal('5000000000');
        });

        it('extendLockTime()', async () => {
            const mockAmount = 1000;
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(true);

            await stakeV3Contract.stake({amount: mockAmount});
            await forwardTime(30);

            const remainingTimeBefore = await stakeV3Contract.remainingLockPeriod_msgSender();

            const lockedRewardsEnabled = true;
            await stakeV3Contract.setLockedRewardsEnabled({lockedRewardsEnabled});

            const lockTimeIndex = 1;
            await stakeV3Contract.extendLockTime({lockTimeIndex});

            const remainingTimeAfter = await stakeV3Contract.remainingLockPeriod_msgSender();

            expect(remainingTimeBefore).to.be.gte(oneWeekInSeconds-100).lte(oneWeekInSeconds);
            expect(remainingTimeAfter).to.equal(oneWeekInSeconds);
        });

        it('topUp()', async () => {
            //stake 1000 tokens
            const mockAmount = 1000;
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(true);

            await stakeV3Contract.stake({amount: mockAmount});
            //

            const amountBefore = await stakeV3Contract.stakeAmount({address: deployerAddress});
            const amountExtra = 10;

            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: amountExtra}))
                .to.equal(false);

            await stakeV3Contract.approveStakeERC20({tokenAmount: amountExtra});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: amountExtra.toString()}))
                .to.equal(true);

            await stakeV3Contract.topUp({amount: amountExtra});
            const amountAfter = await stakeV3Contract.stakeAmount({address: deployerAddress});

            expect(amountBefore).to.equal('1000');
            expect(amountAfter).to.equal('1010');
            expect(amountExtra).to.equal(10);
        });

        it('migrateRewards()', async () => {
            // Deploy the stake V2 contract
            const contractStake = new app.web3.eth.Contract(staking.abi, null, {data: staking.bytecode});
            let StakingAddress, stakeContract
            await contractStake.deploy({
                arguments: [ERC20TokenAddress, 0]
            })
            .send({
                from: deployerAddress,
                gas: 4712388,
            })
            .on('confirmation', function(confirmationNumber, receipt){
                StakingAddress = receipt.contractAddress;
            })
            .on('error', console.log);

            //staking funds in stakeContract v2
            const mockAmount = 1000;
            stakeContract = await app.getStaking({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
            .to.equal(false);

            await stakeContract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
            .to.equal(true);

            await stakeContract.stake({amount: mockAmount});
            const stakeAmounted = await stakeContract.stakeAmount({address: app.account.getAddress()});
            expect(stakeAmounted).to.equal(mockAmount.toString());

            // setPrevPolsStaking with stakeContract v2
            await stakeV3Contract.setPrevPolsStaking({prevPolsStakingAddress: StakingAddress});

            //withdraw all the tokens staked and leave the rewards
            await forwardTime(lockTimePeriod[0] + 30);
            await stakeContract.withdrawAll();
            const tokensStaked = await stakeContract.stakeAmount({address: app.account.getAddress()});

            const burnerRole = ethers.utils.solidityKeccak256(['string'],['BURNER_ROLE']);
            await stakeContract.grantRole({role: burnerRole, account: StakingV3Address});

            expect(tokensStaked).to.equal('0');

            await stakeV3Contract.migrateRewards({staker: deployerAddress});
        });

        it('migrateRewards_msgSender()', async () => {
            // Deploy the stake V2 contract
            const contractStake = new app.web3.eth.Contract(staking.abi, null, {data: staking.bytecode});
            let StakingAddress, stakeContract
            await contractStake.deploy({
                arguments: [ERC20TokenAddress, 0]
            })
            .send({
                from: deployerAddress,
                gas: 4712388,
            })
            .on('confirmation', function(confirmationNumber, receipt){
                StakingAddress = receipt.contractAddress;
            })
            .on('error', console.log);

            //staking funds in stakeContract v2
            const mockAmount = 1000;
            stakeContract = await app.getStaking({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
            .to.equal(false);

            await stakeContract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
            .to.equal(true);

            await stakeContract.stake({amount: mockAmount});
            const stakeAmounted = await stakeContract.stakeAmount({address: app.account.getAddress()});
            expect(stakeAmounted).to.equal(mockAmount.toString());

            // setPrevPolsStaking with stakeContract v2
            await stakeV3Contract.setPrevPolsStaking({prevPolsStakingAddress: StakingAddress});

            //withdraw all the tokens staked and leave the rewards
            await forwardTime(lockTimePeriod[0] + 30);
            await stakeContract.withdrawAll();
            const tokensStaked = await stakeContract.stakeAmount({address: app.account.getAddress()});

            const burnerRole = ethers.utils.solidityKeccak256(['string'],['BURNER_ROLE']);
            await stakeContract.grantRole({role: burnerRole, account: StakingV3Address});

            expect(tokensStaked).to.equal('0');

            await stakeV3Contract.migrateRewards_msgSender();
        });

        it('stakelockTimeChoice()', async () => {
            //stake 1000 tokens
            const mockAmount = 1000;
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(true);

            await stakeV3Contract.stake({amount: mockAmount});
            //

            const mockAmountExtra = 20;
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmountExtra}))
                .to.equal(false);

            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmountExtra});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmountExtra.toString()}))
                .to.equal(true);

            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmountExtra}))
                .to.equal(true);

            const stakeAmountBefore = await stakeV3Contract.stakeAmount({address: app.account.getAddress()});
            await stakeV3Contract.stakeLockTimeChoice({amount: mockAmountExtra, lockTimeIndex: 1});
            const stakeAmountAfter = await stakeV3Contract.stakeAmount({address: app.account.getAddress()});

            expect(stakeAmountBefore).to.equal('1000');
            expect(stakeAmountAfter).to.equal('1020');
        });
    });
});