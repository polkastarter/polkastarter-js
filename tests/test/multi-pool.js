require('dotenv').config();

import Web3 from "web3";
import chai from 'chai';
import { mochaAsync } from '../utils';
import Application from '../../src/models';
var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;


context('Multi pool tests', async () => {

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
        return new Web3(provider);
    }

    const getApp = ({chain}) => {
        return new Application({test: true, mainnet: true, network: chain, web3: getWeb3()})
    }

    const getPool = async ({contractAddress, chain}) => {
        let swapContract = await getApp({chain: 'BSC'}).getFixedSwapContract({contractAddress});
        swapContract.__init__();
        await swapContract.assertERC20Info();
        return swapContract;
    }

    it('should read data from BSC', mochaAsync(async () => {
        const swapContract = await getPool({chain: 'BSC', contractAddress: '0xeE62650fA45aC0deb1B24Ec19f983A8f85B727aB'});
        expect(await swapContract.minimumReached()).to.equal(true);
        expect(swapContract.version).to.equal("2.0");
        expect(swapContract).to.not.equal(false);
    }));

    it('should read data from ETH', mochaAsync(async () => {
        const swapContract = await getPool({chain: 'ETH', contractAddress: '0x868Be4f80bB166a09489822C322deb3163B5025B'});
        expect(await swapContract.minimumReached()).to.equal(true);
        expect(swapContract.version).to.equal("2.0");
        expect(swapContract).to.not.equal(false);
    }));
});
