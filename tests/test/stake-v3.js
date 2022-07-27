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
                    const contractStakeV3 = new app.web3.eth.Contract(stakingv3.abi, null, {data: stakingv3.bytecode});
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
    describe('New features', () => {
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
            const tx = await stakeV3Contract.setLockedRewardsEnabled({lockedRewardsEnabled});

            //don't have getter for see what is the value after execute setLockedRewardsEnabled()
            expect(tx.status).to.equal(true);
        });

        it('setUnlockedRewardsFactor()', async () => {
            const unlockedRewardsFactor = 10;
            const tx = await stakeV3Contract.setUnlockedRewardsFactor({unlockedRewardsFactor});

            //don't have getter for see what is the value after execute setUnlockedRewardsFactor()
            expect(tx.status).to.equal(true);
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
            const tx = await stakeV3Contract.setPrevPolsStaking({prevPolsStakingAddress});

            //don't have getter for see what is the address after execute setPrevPolsStaking()
            expect(tx.status).to.equal(true);
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
            const mockReward = '31000.0';
            expect(rewards).to.equal(mockReward);
        });

        it('userClaimableRewardsCurrent()', async () => {
            const mockAmount = 1000;
            await stakeV3Contract.approveStakeERC20({tokenAmount: mockAmount});
            expect(await stakeV3Contract.isApproved({address: app.account.getAddress(), tokenAmount: mockAmount}))
                .to.equal(true);

            await stakeV3Contract.stake({amount: mockAmount});
            await forwardTime(30);

            const mockRewardsTrue = 31000;
            const mockRewardsFalse = '31000.0';

            let rewardsTrue = ethers.utils.formatUnits(await stakeV3Contract.userClaimableRewardsCurrent({staker: deployerAddress, lockedRewardsCurrent: true}));
            let rewardsFalse = ethers.utils.formatUnits(await stakeV3Contract.userClaimableRewardsCurrent({staker: deployerAddress, lockedRewardsCurrent: false}));

            expect(Math.round(rewardsTrue)).to.be.gte(0).lte(mockRewardsTrue);
            expect(rewardsFalse).to.equal(mockRewardsFalse);
        });

        it('userClaimableRewardsCalculation()', async () => {
            const userStakeAmount =             1000;
            const userStakeTime =               100000000; //2000-01-01
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

        it('extendLockTime(): should fail because lockedRewards=false ', async () => {
            let failed = false;
            try {
                const lockTimeIndex = 1;
                await stakeV3Contract.extendLockTime({lockTimeIndex});
            } catch (e) {
                failed = true;
            }
            expect(failed).to.equal(true);
        });

        it('extendLockTime(): should execute it successfully because lockedRewards=true ', async () => {
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

        it.skip('migrateRewards()', async () => {
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


            // setLockTimePeriod
            // setPrevPolsStaking with stakeContract v2
            await stakeV3Contract.setPrevPolsStaking({prevPolsStakingAddress: StakingAddress});

            // const token = await app.getERC20TokenContract({tokenAddress: ERC20TokenAddress});

            const rewardAmount = '10000000';
            // // await token.approve({address: StakingV3Address, amount: rewardAmount});



            // // console.log( app.account.getAddress());

            //este approve deberia ser que lo haga la address del stakeV3
            await stakeV3Contract.approveStakeERC20({tokenAmount: rewardAmount});
            // expect(await stakeV3Contract.isApproved({address: StakingAddress, tokenAmount: rewardAmount}))
            //     .to.equal(true);


            //withdraw all the tokens staked and leave the rewards
            await forwardTime(lockTime + 30);
            await stakeContract.withdrawAll();
            const tokensStaked = await stakeContract.stakeAmount({address: app.account.getAddress()});

            expect(tokensStaked).to.equal('0');

            console.log('Staking address 2', StakingAddress);
            console.log('Staking address 3', StakingV3Address);
            console.log('deployerAddress ',deployerAddress);
            console.log('app.account.getAddress() ',deployerAddress);


            await stakeV3Contract.migrateRewards({staker: deployerAddress});
        });

        it.skip('migrateRewards_msgSender()', async () => {
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