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
import { ERC20TokenContract } from '../..';
import IDOStaking from '../../src/models/IDOStaking';

// const ERC20TokenAddress = '0x7a7748bd6f9bac76c2f3fcb29723227e3376cbb2';
var contractAddress = '0x420751cdeb28679d8e336f2b4d1fc61df7439b5a';
var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;
let tokenPurchaseAmount = 0.01;
const tokenFundAmount = 0.03;
const tradeValue = 0.01;

// Set to true if yu want to test the fixed swap v2 contract
const oldContract = false;

context('Real world test', async () => {
    var ERC20TokenAddress;
    var swapContract;
    var app;
    var ethersProvider;
    var isFunded, isSaleOpen, tokensLeft, indiviMinAmount, indivMaxAmount, cost, tokensAvailable;
    var currentTime;

    var isRealChain = process.env.CHAIN_NAME;

    const getWeb3 = () => {
        // Instance Application using ganache
        const provider = require("ganache-core").provider({
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
        ethersProvider = new ethers.providers.Web3Provider(provider);
        return new Web3(provider);
    }

    const sleep = async (time) => {
        return new Promise((resolve) => {
            setTimeout(resolve, time * 1000)
        });
    }

    const forwardTime = async (time) => {
        if (isRealChain) {
            await sleep(time);
            currentTime = parseInt(new Date().getTime()/1000);
            return;
        }
        // "Roads? Where we’re going, we don’t need roads."
        const date = parseInt(new Date().getTime()/1000);
        currentTime = date + await ethersProvider.send('evm_increaseTime', [ time ]);
        return await ethersProvider.send('evm_mine');
    }

    before(mochaAsync(async () => {
        return new Promise(async (resolve) => {
            // Instance Application
            app = new Application({test : true, mainnet : true, network : isRealChain ? process.env.CHAIN_NAME : 'ETH', web3:
                isRealChain ? undefined : getWeb3()
            });
            resolve();
        });
    }));

    it('read data', mochaAsync(async () => {
        /* Get Contract */
        swapContract = await app.getFixedSwapContract({contractAddress: '0x55A72Bc906D0E49d39e2Ced08ADc2D15c6B46e72'});
        swapContract.__init__();
        await swapContract.assertERC20Info();
        console.log(await swapContract.wereUnsoldTokensReedemed());
        expect(swapContract.version).to.equal("2.0");
        expect(swapContract).to.not.equal(false);
    }));

});
