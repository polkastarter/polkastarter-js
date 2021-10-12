require('dotenv').config();

import Web3 from "web3";
import chai from 'chai';
import { mochaAsync } from '../utils';
import moment, { isDate } from 'moment';
import Application from '../../src/models';
import { ierc20, idostaking } from "../../src/interfaces";
import Numbers from "../../src/utils/Numbers";
import Contract from "../../src/models/Contract";
import * as ethers from 'ethers';

// const ERC20TokenAddress = '0x7a7748bd6f9bac76c2f3fcb29723227e3376cbb2';
var contractAddress = '0x420751cdeb28679d8e336f2b4d1fc61df7439b5a';
var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;
let tokenPurchaseAmount = 0.01;
const tokenFundAmount = 0.03;
const tradeValue = 0.01;

// Set to true if yu want to test the fixed swap v2 contract
const oldContract = false;

context('ETH Contract', async () => {
    var ERC20TokenAddress;
    var swapContract;
    var app;
    var ethersProvider;
    var isFunded, isSaleOpen, hasWhitelist, tokensLeft, indiviMinAmount, indivMaxAmount, cost, tokensAvailable;
    var currentTime;

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
            app = new Application({test : true, mainnet : false, network : 'ETH', web3:
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
                    resolve();
                }).on('error', console.log);              
        });
    }));

   
    it('should deploy Fixed Swap Contract', mochaAsync(async () => {
        /* Create Contract */
    swapContract = await app.getFixedSwapContract({tokenAddress : ERC20TokenAddress});
        /* Deploy */
        let res;
        if (oldContract) {
            let params = [
                ERC20TokenAddress,
                Numbers.toSmartContractDecimals(tradeValue, 18),
                Numbers.toSmartContractDecimals(tokenFundAmount, 18),
                Numbers.timeToSmartContractTime(moment().add(4, 'minutes')),
                Numbers.timeToSmartContractTime(moment().add(8, 'minutes')),
                Numbers.toSmartContractDecimals(
                    0,
                    18
                ),
                Numbers.toSmartContractDecimals(
                    tokenFundAmount,
                    18
                ),
                false,
                Numbers.toSmartContractDecimals(0, 18),
                1,
                false,
                ERC20TokenAddress,
                true,
                false,
                1,
                [100]
            ];
            const swapv2 = require('../../src/interfaces/fixedswapv2.json');
            let contract = new Contract(app.web3, swapv2);
            res = await contract.deploy(
                app.account,
                swapv2.abi,
                swapv2.bytecode,
                params
            );
            swapContract = await app.getFixedSwapContract({tokenAddress: ERC20TokenAddress, contractAddress: contract.address});
        } else {
            res = await swapContract.deploy({
                tradeValue : tradeValue, 
                tokensForSale : tokenFundAmount, 
                isTokenSwapAtomic : false,
                individualMaximumAmount : tokenFundAmount,
                startDate : moment().add(4, 'minutes'),
                endDate : moment().add(8, 'minutes'),
                hasWhitelisting : false,
                isETHTrade : true
            });
        }
        contractAddress = swapContract.getAddress();
        expect(res).to.not.equal(false);

        expect(await swapContract.getTradingDecimals()).to.equal(18);
    }));

    it('should get the correct smart contract version', mochaAsync(async () => {
        if (oldContract) {
            expect(true).to.equal(true);
        } else {
            expect(await swapContract.getSmartContractVersion()).to.equal(2700000);
        }
    }));

    it('should get a Fixed Swap Contract From contractAddress - 2.0', mochaAsync(async () => {
        /* Get Contract */
        swapContract = await app.getFixedSwapContract({contractAddress});
        swapContract.__init__();
        await swapContract.assertERC20Info();
        expect(swapContract.version).to.equal("2.0");
        expect(swapContract).to.not.equal(false);
    }));

    it('GET - isPreFunded', mochaAsync(async () => {  
        let res = await swapContract.isPreStart();
        expect(res).to.equal(true);
    }));

    it('GET - tokensAllocated', mochaAsync(async () => {        
        let tokens = await swapContract.tokensAllocated();
        expect(tokens).to.equal(Number(0).noExponents());
    }));

    it('GET - tradeValue', mochaAsync(async () => {        
        let td = await swapContract.tradeValue();
        expect(td).to.equal(Number(tradeValue).noExponents());
    }));

    it('GET - tokensAvailable', mochaAsync(async () => {        
        let tokens = await swapContract.tokensAvailable();
        expect(tokens).to.equal(Number(0).noExponents());
    }));

    it('GET - tokensForSale', mochaAsync(async () => {        
        let tokens = await swapContract.tokensForSale();
        expect(Number(tokens).noExponents()).to.equal(Number(tokenFundAmount).noExponents());
    }));

    it('GET - tokensLeft', mochaAsync(async () => {        
        let tokens = await swapContract.tokensLeft();
        tokensLeft = tokens;
        expect(Number(tokens).noExponents()).to.equal(Number(tokenFundAmount).noExponents());
    }));

    it('should fund a Swap Contract and confirm balances', mochaAsync(async () => {
        /* Approve ERC20 Fund */
        let res = await swapContract.approveFundERC20({tokenAmount : tokenFundAmount});
        expect(res).to.not.equal(false);
        res = await swapContract.isApproved({address : app.account.getAddress(), tokenAmount : tokenFundAmount});
        expect(res).to.equal(true);
        /* Fund */
        res = await swapContract.hasStarted();
        expect(res).to.not.equal(true);
        res = await swapContract.fund({tokenAmount : tokenFundAmount});
        expect(res).to.not.equal(false);
        let tokens = await swapContract.tokensAvailable();
        expect(tokens).to.equal(Number(tokenFundAmount).noExponents());
    }));


    it('GET - isFunded', mochaAsync(async () => {  
        let res = await swapContract.isFunded();
        isFunded = res;
        expect(res).to.equal(true);
    }));

    it('GET - isSaleOpen - before Start', mochaAsync(async () => {     
        await forwardTime(4*60);   
        let res = await swapContract.isOpen();
        isSaleOpen = res;
        expect(res).to.equal(true);
    }));

    it('GET - hasWhitelisting ', mochaAsync(async () => {        
        let res = await swapContract.hasWhitelisting();
        expect(res).to.equal(false);
    }));

    it('GET - startDate ', mochaAsync(async () => {        
        let res = await swapContract.startDate();
        res = isDate(res);
        expect(res).to.equal(true);
    }));

    it('GET - endDate ', mochaAsync(async () => {
        let res = await swapContract.endDate();
        res = isDate(res);
        expect(res).to.equal(true);
    }));

    it('GET - individualMinimumAmount ', mochaAsync(async () => {        
        let res = await swapContract.individualMinimumAmount();
        indiviMinAmount= res;
        expect(Number(res).noExponents()).to.equal(Number(0).noExponents());
    }));

    it('GET - individualMaximumAmount ', mochaAsync(async () => {        
        let res = await swapContract.individualMaximumAmount();
        indivMaxAmount = res;
        expect(Number(res).noExponents()).to.equal(Number(tokenFundAmount).noExponents());
    }));

    it('GET - getCostFromTokens ', mochaAsync(async () => {        
        let res = await swapContract.getCostFromTokens({tokenAmount : tokenPurchaseAmount});
        res = Number(res).noExponents();
        cost = Number(res).toFixed(4);
        expect(Number(cost).noExponents()).to.equal(Number(tokenPurchaseAmount * tradeValue).noExponents());
    }));

    it('check conditions for swap  ', mochaAsync(async () => {
        let amount = Number(tokenPurchaseAmount).noExponents() > 0 ? true : false;
        tokensLeft = Number(tokenPurchaseAmount).noExponents() <= Number(tokensLeft).noExponents() ? true : false;
        indiviMinAmount = Number(tokenPurchaseAmount).noExponents() >= Number(indiviMinAmount).noExponents() ? true : false;
        indivMaxAmount = Number(tokenPurchaseAmount).noExponents() <= Number(indivMaxAmount).noExponents() ? true : false;
        expect(isFunded).to.equal(true);
        expect(isSaleOpen).to.equal(true);
        expect(amount).to.equal(true);
        expect(tokensLeft).to.equal(true);
        expect(indiviMinAmount).to.equal(true);
        expect(indivMaxAmount).to.equal(true);
    }));

    it('GET - hasStarted', mochaAsync(async () => {  
        await forwardTime(1*60);
        let res = await swapContract.hasStarted();
        expect(res).to.equal(true);
    }));

    it('GET - isSaleOpen', mochaAsync(async () => {        
        let res = await swapContract.isOpen();
        expect(res).to.equal(true);
    }));

    it('Edit max allocation - Admin', mochaAsync(async () => {
        if (!oldContract) {
            let newMax = 500;
            let res = await swapContract.setIndividualMaximumAmount({individualMaximumAmount: newMax});
            expect(res).to.not.equal(false);
            expect(await swapContract.individualMaximumAmount()).to.equal(newMax+'');
        }
    }));

    it('GET - tokensAvailable after fund', mochaAsync(async () => {        
        let tokens = await swapContract.tokensAvailable();
        expect(tokens).to.equal(Number(tokens).noExponents());
    }));

    it('should do a non atomic swap on the Contract', mochaAsync(async () => {
        await forwardTime(5);
        let res;
        if (oldContract) {
            res = await swapContract.__oldSwap({tokenAmount : tokenPurchaseAmount});
        } else {
            res = await swapContract.swap({tokenAmount : tokenPurchaseAmount});
        }
        expect(res).to.not.equal(false);
    }));

    it('GET - Purchases', mochaAsync(async () => {        
        let purchases = await swapContract.getPurchaseIds();
        expect(purchases.length).to.equal(1);
    }));

    it('GET - Distribution Information', mochaAsync(async () => {    
        // ToDo        
        let info = await swapContract.getDistributionInformation();
        console.log(info);
    }));

    it('GET - My Purchases', mochaAsync(async () => {        
        let purchases = await swapContract.getAddressPurchaseIds({address : app.account.getAddress()});
        expect(purchases.length).to.equal(1);
    }));

    it('GET - Purchase ID', mochaAsync(async () => {     
        let purchases = await swapContract.getAddressPurchaseIds({address : app.account.getAddress()}); 
        let purchase = await swapContract.getPurchase({purchase_id : purchases[0]});
        const amountPurchase = Number(purchase.amount).noExponents();
        expect(Number(amountPurchase).toFixed(2)).to.equal(Number(tokenPurchaseAmount).noExponents());
        expect(purchase.purchaser).to.equal(app.account.getAddress());
        expect(purchase.wasFinalized).to.equal(false);
        expect(purchase.reverted).to.equal(false);
        expect(parseInt(purchase.amountToReedemNow)).to.equal(0);
    }));


    it('GET - tokensLeft after Swap', mochaAsync(async () => {        
        let tokens = await swapContract.tokensLeft();
        tokens = Number(tokens).noExponents();
        tokensLeft = Number(tokenFundAmount-tokenPurchaseAmount).noExponents();
        expect(Number(tokens).toFixed(2)).to.equal(Number(tokensLeft).toFixed(2));
    }));

    it('GET - Buyers', mochaAsync(async () => {  
        let buyers = await swapContract.getBuyers();
        expect(buyers.length).to.equal(1);      
    }));

    it('GET - Fixed Swap is Closed', mochaAsync(async () => {  
        await forwardTime(4*60); 
        let res = await swapContract.hasFinalized();
        expect(res).to.equal(true);
        res = await swapContract.isOpen();
        expect(res).to.equal(false);
    }));

    it('should return withdrawable unsold amount', mochaAsync(async () => {
        const res = await swapContract.withdrawableUnsoldTokens();
        console.log(res);
    }))

    it('Redeem Sale (withdraw tokens)', mochaAsync(async () => {  
        let purchases = await swapContract.getAddressPurchaseIds({address : app.account.getAddress()}); 
        let res = await swapContract.redeemTokens({purchase_id : purchases[0]})
        expect(res).to.not.equal(false);
    }));


    it('GET - Purchase ID 2', mochaAsync(async () => {     
        let purchases = await swapContract.getAddressPurchaseIds({address : app.account.getAddress()}); 
        let purchase = await swapContract.getPurchase({purchase_id : purchases[0]});
        console.log(purchase);
        expect(purchase.purchaser).to.equal(app.account.getAddress());
        expect(purchase.wasFinalized).to.equal(true);
        expect(purchase.reverted).to.equal(false);

    }));

    it('Remove ETH From Purchases - Admin', mochaAsync(async () => {  
        let res = await swapContract.withdrawFunds();
        expect(res).to.not.equal(false);
    }));

    it('Remove Unsold Tokens - Admin', mochaAsync(async () => {  
        let res = await swapContract.withdrawUnsoldTokens();
        expect(res).to.not.equal(false);
    }));

    it('Add to blacklist - Admin', mochaAsync(async () => {  
        if (!oldContract) {
            let res = await swapContract.addToBlacklist({address: '0xfAadFace3FbD81CE37B0e19c0B65fF4234148132'});
            expect(res).to.not.equal(false);
            expect(await swapContract.isBlacklisted({address: '0xfAadFace3FbD81CE37B0e19c0B65fF4234148132'})).to.equal(true);
        }
    }));

    it('Remove from blacklist - Admin', mochaAsync(async () => {  
        if (!oldContract) {
            let res = await swapContract.removeFromBlacklist({address: '0xfAadFace3FbD81CE37B0e19c0B65fF4234148132'});
            expect(res).to.not.equal(false);
            expect(await swapContract.isBlacklisted({address: '0xfAadFace3FbD81CE37B0e19c0B65fF4234148132'})).to.equal(false);
        }
    }));

    /* Staking Rewards */
    it('should deploy Fixed Swap Contract with staking rewards and swap', mochaAsync(async () => {
        /* Create Contract */
        swapContract = await app.getFixedSwapContract({tokenAddress : ERC20TokenAddress});
        /* Deploy */
        let res = await swapContract.deploy({
            tradeValue : tradeValue, 
            tokensForSale : tokenFundAmount, 
            isTokenSwapAtomic : false,
            individualMaximumAmount : tokenFundAmount,
            startDate : new Date((currentTime + (3 * 60)) * 1000), // 3 mins
            endDate : new Date((currentTime + (8 * 60)) * 1000), // 8 mins
            hasWhitelisting : false,
            isETHTrade : true
        });
        contractAddress = swapContract.getAddress();
        expect(res).to.not.equal(false);

        const deployStakeContract = async () => {
            const tenDays = 864000;
            return new Promise((resolve) => {
                // Deploy the staking rewards
                const contract = new app.web3.eth.Contract(idostaking.abi, null, {data: idostaking.bytecode});
                contract.deploy({
                    arguments: [
                        app.account.getAddress(),
                        app.account.getAddress(),
                        ERC20TokenAddress,
                        ERC20TokenAddress,
                        tenDays,
                    ]
                })
                    .send({
                        from: '0xe797860acFc4e06C1b2B96197a7dB1dFa518d5eB',
                        gas: 4712388,
                    })
                    .on('confirmation', function(confirmationNumber, receipt){ 
                        resolve(receipt.contractAddress);
                    }).on('error', console.log);
            });
        }
        await swapContract.setStakingRewards({address: await deployStakeContract()});

        const staking = await swapContract.getIDOStaking();

        await staking.setTokenSaleAddress({address: contractAddress});

        await swapContract.approveFundERC20({tokenAmount : tokenFundAmount});
        await swapContract.fund({tokenAmount : tokenFundAmount});
        await forwardTime(3*60);
        res = await swapContract.swap({tokenAmount : tokenPurchaseAmount});
        expect(res).to.not.equal(false);

        let purchases = await swapContract.getAddressPurchaseIds({address : app.account.getAddress()});
        expect(await staking.stakeAmount({address: app.account.getAddress()})).to.equal('0');
        await forwardTime(6 * 60);

        res = await swapContract.redeemTokens({purchase_id : purchases[0], stake: true});
        expect(res).to.not.equal(false);
        expect(await staking.stakeAmount({address: app.account.getAddress()})).to.equal('0.01');

    }));

    /* Whitelist */
    
    it('should deploy Fixed Swap Contract with whitelist and swap', mochaAsync(async () => {
        /* Create Contract */
        swapContract = await app.getFixedSwapContract({tokenAddress : ERC20TokenAddress});
        /* Deploy */
        let res = await swapContract.deploy({
            tradeValue : tradeValue, 
            tokensForSale : tokenFundAmount, 
            isTokenSwapAtomic : false,
            individualMaximumAmount : tokenFundAmount,
            startDate : new Date((currentTime + (3 * 60)) * 1000), // 3 mins
            endDate : new Date((currentTime + (8 * 60)) * 1000), // 8 mins
            hasWhitelisting : true,
            isETHTrade : true
        });
        contractAddress = swapContract.getAddress();
        expect(res).to.not.equal(false);


        const signer = app.getSigner();
        const account = await signer.generateSignerAccount({password: 'test1234'});

        const signs = await signer.signAddresses({
            addresses: [
            '0xe797860acFc4e06C1b2B96197a7dB1dFa518d5eB'
        ], accountJson: account, password: 'test1234'});

        await swapContract.setSignerPublicAddress({
            address: ('0x' + JSON.parse(account).address).toLowerCase()
        });
        await swapContract.approveFundERC20({tokenAmount : tokenFundAmount});
        await swapContract.fund({tokenAmount : tokenFundAmount});
        await forwardTime(3*60);
        res = await swapContract.swap({tokenAmount : tokenPurchaseAmount, signature: signs[0].signature});
        expect(res).to.not.equal(false);
    }));

    /* Vesting */
    
    it('should deploy Fixed Swap Contract with vesting and swap', mochaAsync(async () => {
        /* Create Contract */
        swapContract = await app.getFixedSwapContract({tokenAddress : ERC20TokenAddress});
        tokenPurchaseAmount = 0.015;
        const testSwapWithVesting = async (duration, schedule, editVesting = false) => {
            const startDate = new Date((currentTime + (3 * 60)) * 1000);
            const endDate = new Date((currentTime + (8 * 60)) * 1000);
            /* Deploy */
            let res = await swapContract.deploy({
                    tradeValue : tradeValue, 
                    tokensForSale : tokenFundAmount, 
                    isTokenSwapAtomic : false,
                    individualMaximumAmount : tokenFundAmount,
                    startDate : startDate, // 3 mins
                    endDate : endDate, // 8 mins
                    hasWhitelisting : false,
                    isETHTrade : true,
                    vestingSchedule : !editVesting ? schedule : [],
                    vestingCliff : 0,
                    vestingDuration: !editVesting ? duration : 0
            });
            contractAddress = swapContract.getAddress();
            expect(res).to.not.equal(false);
            let info = await swapContract.getDistributionInformation();
            expect(info).to.not.equal(false);

            if (editVesting) {
                await swapContract.setVesting({vestingSchedule: schedule, vestingStart: endDate, cliff: 0, vestingDuration: duration});
            }


            await swapContract.approveFundERC20({tokenAmount : tokenFundAmount});
            await swapContract.fund({tokenAmount : tokenFundAmount});
            await forwardTime(3*60);
            res = await swapContract.swap({tokenAmount : tokenPurchaseAmount});
            expect(res).to.not.equal(false);
            let purchases = await swapContract.getAddressPurchaseIds({address : app.account.getAddress()}); 

            let purchase = await swapContract.getPurchase({purchase_id : purchases[0]});
            expect(purchase.amountReedemed).to.equal('0');
            expect(purchase.amountLeftToRedeem).to.equal(0.015);

            await forwardTime(2 * 60);


            let failed = false;
            try {
                res = await swapContract.redeemTokens({purchase_id : purchases[0]})
                expect(res).to.not.equal(false);
            } catch (e) {
                failed = true;
            }
            expect(failed).to.equal(true);
            await forwardTime(4 * 60);
            let i = 0;
            for (let schedule of schedule) {
                i++;
                res = await swapContract.redeemTokens({purchase_id : purchases[0]})
                expect(res).to.not.equal(false);


                let tokens = await swapContract.tokensLeft();
                tokensLeft = Number(tokenFundAmount-((tokenPurchaseAmount * schedule / 100) * i)).noExponents();
                expect(Number(tokens).toFixed(3)).to.equal(Number(0.015).toFixed(3));

                
                purchase = await swapContract.getPurchase({purchase_id : purchases[0]});
                console.log((tokenPurchaseAmount * schedule / 100) * i);
                expect(parseFloat(purchase.amountReedemed)).to.equal(((tokenPurchaseAmount * schedule / 100) * i));
                expect(purchase.amountLeftToRedeem).to.equal(tokenPurchaseAmount-((tokenPurchaseAmount * schedule / 100) * i));
                await forwardTime(duration);
            }

            await forwardTime(duration + 1);

            failed = false;
            try {
                res = await swapContract.redeemTokens({purchase_id : purchases[0]})
                expect(res).to.not.equal(false);
            } catch (e) {
                failed = true;
            }
            expect(failed).to.equal(true);
        };

        const fiveMins = 5 * 60;
        const oneDay = 24 * 60 * 60;
        // Vesting in deploy
        await testSwapWithVesting(fiveMins, [50, 50]);
        await testSwapWithVesting(oneDay, [50, 50]);
        await testSwapWithVesting(fiveMins, [25, 25, 25, 25]);
        // Edit vesting
        await testSwapWithVesting(fiveMins, [50, 50], true);
        await testSwapWithVesting(fiveMins, [25, 25, 25, 25], true);
    }));
});
