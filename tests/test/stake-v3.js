require('dotenv').config();

import Web3 from "web3";
import chai from 'chai';
import { mochaAsync } from '../utils';
import Application from '../../src/models';
import { ierc20, stakingv3 } from "../../src/interfaces";
import * as ethers from 'ethers';

var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;

context('Staking Contract V3', async () => {
    var deployerAddress = '0xe797860acFc4e06C1b2B96197a7dB1dFa518d5eB'
    var ERC20TokenAddress;
    var StakingAddress;
    var stakeContract;
    var app;
    var ethersProvider;
    var currentTime;
    var tenMinutes = 10 * 60;
    var lockTime = tenMinutes;
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
                    // Deploy the stake contract
                    const contractStake = new app.web3.eth.Contract(stakingv3.abi, null, {data: stakingv3.bytecode});
                    contractStake.deploy({
                            arguments: [ERC20TokenAddress]
                        })
                        .send({
                            from: deployerAddress,
                            gas: 4712388,
                        })
                        .on('confirmation', function(confirmationNumber, receipt){
                            StakingAddress = receipt.contractAddress;
                            resolve();
                        }).on('error', console.log);

                }).on('error', console.log);
        });
    }));

    // it('should automatically get addresses', mochaAsync(async () => {
    //     let stakeContract = await app.getStakingV3({});
    //     expect(stakeContract).to.not.equal(false);
    //     expect(stakeContract.params.contractAddress).to.equal('0x48F5EDDA2c6b503C79FF590ed8AAFF54f7463EB9');
    //     expect(stakeContract.params.erc20TokenContract.params.contractAddress).to.equal('0xcfd314B14cAB8c3e36852A249EdcAa1D3Dd05055');
    // }));

    // it('should get deployed contract', mochaAsync(async () => {
    //     stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
    //     expect(stakeContract).to.not.equal(false);
    // }));

    // it('should return empty stake amount at start', mochaAsync(async () => {
    //     const res = await stakeContract.stakeAmount({address: app.account.getAddress()});
    //     expect(Number(res).noExponents()).to.equal(Number(0).noExponents());
    // }));

    // it('should stake after approve', mochaAsync(async () => {
    //     expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: 1000})).to.equal(false);
    //     await stakeContract.approveStakeERC20({tokenAmount: 1000});
    //     expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: '1000'})).to.equal(true);
    //     expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: 1000})).to.equal(true);
    //     await stakeContract.stake({amount: 1000});
    //     const res = await stakeContract.stakeAmount({address: app.account.getAddress()});
    //     expect(Number(res).noExponents()).to.equal(Number(1000).noExponents());

    //     let unlockTime = parseInt(await stakeContract.stakeTime({address: app.account.getAddress()})) + parseInt(await stakeContract.getLockTimePeriod())

    //     expect(Number(await stakeContract.getUnlockTime({address: app.account.getAddress()})).noExponents()).to.equal(Number(unlockTime).noExponents())
    // }));

    // it('should fail withdraw if we didnt reach time', mochaAsync(async () => {
    //     let failed = false;
    //     try {
    //         res = await stakeContract.withdrawAll()
    //         expect(res).to.not.equal(false);
    //     } catch (e) {
    //         failed = true;
    //     }
    //     expect(failed).to.equal(true);
    // }));

    // it.skip('should withdraw after stake', mochaAsync(async () => {
    //     await forwardTime(lockTime + 30);
    //     await stakeContract.withdraw({amount: 400});
    //     let res = await stakeContract.stakeAmount({address: app.account.getAddress()});
    //     expect(Number(res).noExponents()).to.equal(Number(600).noExponents());
    //     await stakeContract.withdrawAll();
    //     res = await stakeContract.stakeAmount({address: app.account.getAddress()});
    //     expect(Number(res).noExponents()).to.equal(Number(0).noExponents());
    // }));
    describe('New features', () => {
        it('should stake() after approve', async () => {
            const mockAmount = 1000;
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(false);

            await stakeContract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount.toString()}))
                .to.equal(true);

            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(true);

            await stakeContract.stake({amount: mockAmount});
            const stakeAmounted = await stakeContract.stakeAmount({address: app.account.getAddress()});
            expect(stakeAmounted).to.equal(mockAmount.toString());

            let mockUnlockTime =
                parseInt(await stakeContract.stakeTime({address: app.account.getAddress()})) +
                parseInt(await stakeContract.getLockTimePeriod());

            const unlockTimeGetted = await stakeContract.getUnlockTime({address: app.account.getAddress()});
            expect(unlockTimeGetted).to.equal(mockUnlockTime);

        });

        it('getLockTimePeriod()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const lockTimePeriodDefault = await stakeContract.getLockTimePeriod();
            expect(lockTimePeriodDefault).to.equal(oneWeekInSeconds);
        });

        it('setLockTimePeriodDefault()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            await stakeContract.setLockTimePeriodDefault({defaultLockTime});
        });

        it('remainingLockPeriod()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const remainingTime = await stakeContract.remainingLockPeriod({address: deployerAddress});
            expect(remainingTime).to.be.gte(oneWeekInSeconds-100).lte(oneWeekInSeconds);
        });

        it('getLockTimePeriodOptions()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            await stakeContract.setLockTimePeriodOptions({lockTimePeriod, lockTimePeriodRewardFactor});
            const lockTimePeriodOptions = await stakeContract.getLockTimePeriodOptions();
            expect(lockTimePeriodOptions).deep.equal(lockTimePeriod);
        });

        it('getLockTimePeriodRewardFactors()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const factors = await stakeContract.getLockTimePeriodRewardFactors();
            expect(factors).deep.equal(lockTimePeriodRewardFactor);
        });

        it('setLockedRewardsEnabled()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const lockedRewardsEnabled = true;
            const tx = await stakeContract.setLockedRewardsEnabled({lockedRewardsEnabled});

            //don't have getter for see what is the value after execute setLockedRewardsEnabled()
            expect(tx.status).to.equal(true);
        });

        it('setUnlockedRewardsFactor()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const unlockedRewardsFactor = 10;
            const tx = await stakeContract.setUnlockedRewardsFactor({unlockedRewardsFactor});

            //don't have getter for see what is the value after execute setUnlockedRewardsFactor()
            expect(tx.status).to.equal(true);
        });

        it('setLockTimePeriodOptions()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
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
            await stakeContract.setLockTimePeriodOptions({lockTimePeriod, lockTimePeriodRewardFactor});
        });

        it('setPrevPolsStaking()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const prevPolsStakingAddress = '0x1234567890123456789012345678901234567890';
            const tx = await stakeContract.setPrevPolsStaking({prevPolsStakingAddress});

            //don't have getter for see what is the address after execute setPrevPolsStaking()
            expect(tx.status).to.equal(true);
        });

        it('remainingLockPeriod_msgSender()', async () => {
            const mockAmount = 1000;
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const stakeAmounted = await stakeContract.stakeAmount({address: app.account.getAddress()});
            expect(stakeAmounted).to.equal(mockAmount.toString());
            const remainingTime = await stakeContract.remainingLockPeriod_msgSender();
            expect(remainingTime).to.be.gte(oneWeekInSeconds-100).lte(oneWeekInSeconds);
        });

        it('userClaimableRewards()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const rewards = ethers.utils.formatUnits(await stakeContract.userClaimableRewards({staker: deployerAddress}));
            const oneWeekMilisecondsStr = '604800000.0';
            expect(rewards).to.equal(oneWeekMilisecondsStr);
        });

        it('userClaimableRewardsCurrent()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});

            const mockRewardsTrue = 10000;
            const mockRewardsFalse = '604800000.0';

            let rewardsTrue = ethers.utils.formatUnits(await stakeContract.userClaimableRewardsCurrent({staker: deployerAddress, lockedRewardsCurrent: true}));
            let rewardsFalse = ethers.utils.formatUnits(await stakeContract.userClaimableRewardsCurrent({staker: deployerAddress, lockedRewardsCurrent: false}));

            expect(Math.round(rewardsTrue)).to.be.gte(0).lte(mockRewardsTrue);
            expect(rewardsFalse).to.equal(mockRewardsFalse);
        });

        it.skip('userClaimableRewardsCalculation()', async () => {
        });

        it('extendLockTime()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const remainingTimeBefore = await stakeContract.remainingLockPeriod_msgSender();

            const lockTimeIndex = 1;
            await stakeContract.extendLockTime({lockTimeIndex});

            const remainingTimeAfter = await stakeContract.remainingLockPeriod_msgSender();

            expect(remainingTimeBefore).to.be.gte(oneWeekInSeconds-100).lte(oneWeekInSeconds);
            expect(remainingTimeAfter).to.equal(defaultLockTime);
        })

        it('topUp()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            const amountBefore = await stakeContract.stakeAmount({address: deployerAddress});
            const amountExtra = 10;

            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: amountExtra}))
                .to.equal(false);

            await stakeContract.approveStakeERC20({tokenAmount: amountExtra});
            expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: amountExtra.toString()}))
                .to.equal(true);

            await stakeContract.topUp({amount: amountExtra});
            const amountAfter = await stakeContract.stakeAmount({address: deployerAddress});

            expect(amountBefore).to.equal('1000');
            expect(amountAfter).to.equal('1010');
            expect(amountExtra).to.equal(10);
        });

        it.skip('migrateRewards()', async () => {
            stakeContract = await app.getStakingV3({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
            //setear setPrevPolsStaking

            await stakeContract.migrateRewards(stakerAddress);
        });

        it.skip('migrateRewards_msgSender()', async () => {
        });

        it.skip('stakelockTimeChoice()', async () => {
        });
    });

});