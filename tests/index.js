

import chai from 'chai';
import { mochaAsync } from './utils';
import moment from 'moment';
import Application from '../models';
import delay from 'delay';
const ERC20TokenAddress = '0x7a7748bd6f9bac76c2f3fcb29723227e3376cbb2';
var contractAddress = '0xeCB7b5AeCe719963cedF343486d7be56c7D4c113';
var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;

context('Tests', async () => {
    var swapContract;
    var app;
   
    before( async () =>  {
        app = new Application({test : true});
    });


    it('should deploy Fixed Swap Contract', mochaAsync(async () => {

        app = new Application({test : true});
        /* Create Contract */
        swapContract = app.getFixedSwapContract({tokenAddress : ERC20TokenAddress, decimals : 18});
        /* Deploy */
        console.log("a")
        let res = await swapContract.deploy({
            tradeValue : 0.0000001, 
            tokensForSale : 100, 
            individualMaximumAmount : 100,
            startDate : moment().add(2, 'minutes'),
            endDate : moment().add(16, 'hours')
        });
        console.log("bn")
        contractAddress = swapContract.getAddress();
        expect(res).to.not.equal(false);
    }));

    it('should get a Fixed Swap Contract', mochaAsync(async () => {

        /* Create Contract */
        swapContract = app.getFixedSwapContract({tokenAddress : ERC20TokenAddress, decimals : 18, contractAddress});
        swapContract.__init__();
        expect(swapContract).to.not.equal(false);
    }));

    it('GET - isPreFunded', mochaAsync(async () => {        
        let res = await swapContract.isPreStart();
        expect(res).to.equal(true);
    }));

    it('GET - tokensAllocated', mochaAsync(async () => {        
        let tokens = await swapContract.tokensAllocated();
        expect(tokens).to.equal(0);
    }));

    it('GET - tokensAvailable', mochaAsync(async () => {        
        let tokens = await swapContract.tokensAvailable();
        expect(tokens).to.equal(0);
    }));

    it('GET - tokensForSale', mochaAsync(async () => {        
        let tokens = await swapContract.tokensForSale();
        expect(tokens).to.equal(100);
    }));

    it('GET - tokensLeft', mochaAsync(async () => {        
        let tokens = await swapContract.tokensLeft();
        expect(tokens).to.equal(100);
    }));

    it('should fund a Swap Contract and confirm balances', mochaAsync(async () => {
        /* Create Contract */
        let res = await swapContract.fund({tokenAmount : 100});
        expect(res).to.not.equal(false);
    }));

    it('GET - isFunded', mochaAsync(async () => {  
        let res = await swapContract.isFunded();
        expect(res).to.equal(true);
    }));

    it('GET - hasStarted', mochaAsync(async () => {  
        await delay(3*1000);      
        let res = await swapContract.hasStarted();
        expect(res).to.equal(true);
    }));

    it('GET - isSaleOpen', mochaAsync(async () => {        
        let res = await swapContract.isOpen();
        expect(res).to.equal(true);
    }));

    it('GET - tokensAvailable', mochaAsync(async () => {        
        let tokens = await swapContract.tokensAvailable();
        expect(tokens).to.equal(100);
    }));

    it('should do a non atomic swap on the Contract', mochaAsync(async () => {
        /* Create Contract */
        let res = await swapContract.swap({tokenAmount : 12});
        expect(res).to.not.equal(false);
    }));

    it('GET - Purchases ', mochaAsync(async () => {        
        let purchases = await swapContract.getPurchaseIds();
        console.log("purchases", purchases)
        expect(purchases.length).to.equal(1);
    }));


    it('GET - My Purchases ', mochaAsync(async () => {        
        let purchases = await swapContract.getAddressPurchaseIds({address : app.account.getAddress()});
        expect(purchases.length).to.equal(1);
    }));

    it('GET - Purchase ID ', mochaAsync(async () => {     
        let purchases = await swapContract.getAddressPurchaseIds({address : app.account.getAddress()});   
        let purchase = await swapContract.getPurchase({purchase_id : purchases[0]}); 

        expect(purchase.amount).to.equal(12);
        expect(purchase.purchaser).to.equal(app.account.getAddress());
        expect(purchase.wasFinalized).to.equal(false);
        expect(purchase.reverted).to.equal(false);
    }));

    it('GET - Buyers ', mochaAsync(async () => {  
        let buyers = await swapContract.getBuyers();
        expect(buyers.length).to.equal(1);      
    }));
});
