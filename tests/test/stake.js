require('dotenv').config();

import Web3 from "web3";
import chai from 'chai';
import { mochaAsync } from '../utils';
import moment from 'moment';
import Application from '../../src/models';
import { ierc20, staking } from "../../src/interfaces";
import * as ethers from 'ethers';

var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;


context('Staking Contract', async () => {
    var ERC20TokenAddress;
    var StakingAddress;
    var stakeContract;
    var app;
    var ethersProvider;
    var currentTime;
    var tenMinutes = 10 * 60;
    var lockTime = tenMinutes;

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
                    from: '0xe797860acFc4e06C1b2B96197a7dB1dFa518d5eB',
                    gas: 4712388,
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    ERC20TokenAddress = receipt.contractAddress;
                    // Deploy the stake contract
                    const contractStake = new app.web3.eth.Contract(staking.abi, null, {data: staking.bytecode});
                    contractStake.deploy({
                            arguments: [ERC20TokenAddress, lockTime + '']
                        })
                        .send({
                            from: '0xe797860acFc4e06C1b2B96197a7dB1dFa518d5eB',
                            gas: 4712388,
                        })
                        .on('confirmation', function(confirmationNumber, receipt){ 
                            StakingAddress = receipt.contractAddress;
                            resolve();
                        }).on('error', console.log);   

                }).on('error', console.log);              
        });
    }));

   
    it('should automatically get addresses', mochaAsync(async () => {
        let stakeContract = await app.getStaking({});
        expect(stakeContract).to.not.equal(false);
        expect(stakeContract.params.contractAddress).to.equal('0x20c48C19Ca7079Ed8E7CD317829d4ebf75125390');
        expect(stakeContract.params.erc20TokenContract.params.contractAddress).to.equal('0xcfd314B14cAB8c3e36852A249EdcAa1D3Dd05055');
    }));

    it('should get deployed contract', mochaAsync(async () => {
        stakeContract = await app.getStaking({contractAddress: StakingAddress, tokenAddress: ERC20TokenAddress});
        expect(stakeContract).to.not.equal(false);
    }));

    it('should return empty stake amount at start', mochaAsync(async () => {
        const res = await stakeContract.stakeAmount({address: app.account.getAddress()});
        expect(Number(res).noExponents()).to.equal(Number(0).noExponents());
    }));

    it('should stake after approve', mochaAsync(async () => {
        expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: 1000})).to.equal(false);
        await stakeContract.approveStakeERC20({tokenAmount: 1000});
        expect(await stakeContract.isApproved({address: app.account.getAddress(), tokenAmount: 1000})).to.equal(true);
        await stakeContract.stake({amount: 1000});
        const res = await stakeContract.stakeAmount({address: app.account.getAddress()});
        expect(Number(res).noExponents()).to.equal(Number(1000).noExponents());

        let unlockTime = parseInt(await stakeContract.stakeTime({address: app.account.getAddress()})) + parseInt(await stakeContract.getLockTimePeriod())

        expect(Number(await stakeContract.getUnlockTime({address: app.account.getAddress()})).noExponents()).to.equal(Number(unlockTime).noExponents())
    }));


    it('should fail withdraw if we didnt reach time', mochaAsync(async () => {
        let failed = false;
        try {
            res = await stakeContract.withdraw()
            expect(res).to.not.equal(false);
        } catch (e) {
            failed = true;
        }
        expect(failed).to.equal(true);
    }));

    it('should withdraw after stake', mochaAsync(async () => {
        await forwardTime(lockTime + 30);
        await stakeContract.withdraw();
        const res = await stakeContract.stakeAmount({address: app.account.getAddress()});
        expect(Number(res).noExponents()).to.equal(Number(0).noExponents());
    }));
});