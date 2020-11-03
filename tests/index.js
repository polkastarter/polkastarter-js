

import chai from 'chai';
import { mochaAsync } from './utils';
import moment from 'moment';
import Application from '../models';

const ERC20TokenAddress = '0x3237fff7f25a354f68b2054a019c5a00135a8955';

const expect = chai.expect;

context('Tests', async () => {
    var swapContract;

   
    before( async () =>  {
    
    });


    it('should deploy Fixed Swap Contract', mochaAsync(async () => {

        let app = new Application({test : true});
        /* Create Contract */
        swapContract = app.getFixedSwapContract({tokenAddress : ERC20TokenAddress, decimals : 18});
        /* Deploy */
        let res = await swapContract.deploy({
            tradeValue : 0.001, 
            tokensForSale : 100, 
            startDate : moment().add(6, 'hours'),
            endDate : moment().add(16, 'hours')
        });

        expect(res).to.not.equal(false);
    }));


    it('should try to enter the crowdsale but not be allowed, not enough tokens', mochaAsync(async () => {        
       /* Send Tokens */
       
    }));

    it('should send tokens to contract (owner)', mochaAsync(async () => {        
     
    }));

    it('should swap tokens', mochaAsync(async () => {        
     
    }));


});
