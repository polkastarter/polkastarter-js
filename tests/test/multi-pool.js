require('dotenv').config();

import Web3 from "web3";
import chai from 'chai';
import { mochaAsync } from '../utils';
import Application from '../../src/models';
var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;


/**
 
Ethereum
Polkamarkets Public: 0x33891316e3b032afbd926597aC78c34Ba545900e
Polkamarkets POLS: 0x868Be4f80bB166a09489822C322deb3163B5025B
SpiderDAO POLS: 0x3377369567af5b93F61dDdbC311815f87F5d2647
SpiderDAO Public: 0xf5d81daC4d6c3f3A0548b86A880e2d0bDb500854
Finxflo FXF POLS: 0x068ECd782a4164A768c9e75EcD8c0B09c8347d6E
Finxflo FXF Public: 0x94Ba931CCbb6Ad3CEe54c51658048627f828f24d
Bridge Mutual POLS: 0x5C355074cCba1232c95183F92d78f9282DE90569
Bridge Mutual Public: 0xdBa054fDb2A542E9128c91Ae62fE832177bf3536

Binance
Dotmoovs BNB: 0xD9E476F178736866778eb9C97bF64c2D539909E0
Paralink: 0x031E921F1D5BB9Aa26ef9a3AcBD59Fd3FbD2021B
Refinable POLS: 0xEc1FE95B291C5CB4611fEA0D697CcF4b5385Ff4f
Refinable Public: 0x2DA41C8B86B3217A0c58Bac2Efa17eF95e8F27dE
Genesis Shards Public: 0x755c872d399d6c702Ad1a5063931dDB55B694CF5

Polygon
Polytrade: 0x9D321c14905bdb66fc350237Cfe52436397821ea
Meme.com: 0x18E98c89d3D0E7eDe0f6E8af32c6117c3eDbb8C6
 */

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
        let swapContract = await getApp({chain: 'BNB'}).getFixedSwapContract({contractAddress});
        swapContract.__init__();
        await swapContract.assertERC20Info();
        return swapContract;
    }

    it('should read data from BNB', mochaAsync(async () => {
        const swapContract = await getPool({chain: 'BNB', contractAddress: '0xeE62650fA45aC0deb1B24Ec19f983A8f85B727aB'});
        expect(await swapContract.minimumReached()).to.equal(true);
        expect(swapContract.version).to.equal("2.0");
        expect(swapContract).to.not.equal(false);
    }));

    it('should read data from legacy pools', mochaAsync(async () => {
        const swapContract = await getPool({chain: 'ETH', contractAddress: '0x868Be4f80bB166a09489822C322deb3163B5025B'});
        console.log(swapContract);
        expect(await swapContract.minimumReached()).to.equal(true);
        expect(swapContract.version).to.equal("2.0");
        expect(swapContract).to.not.equal(false);
    }));
});
