require('dotenv').config();

import Web3 from "web3";
import chai from 'chai';
import { mochaAsync } from '../utils';
import Application from '../../src/models';
var userPrivateKey = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132';

const expect = chai.expect;


context('Multi pool tests', async () => {


    const getApp = ({chain}) => {
        return new Application({test: true, mainnet: true, network: chain, web3: undefined})
    }

    const getPool = async ({contractAddress, chain}) => {
        let swapContract = await getApp({chain}).getFixedSwapContract({contractAddress});
        swapContract.__init__();
        await swapContract.assertERC20Info();
        return swapContract;
    }

    const getUserAllocationsByPoolId = async ({ poolContract }) => {
        const purchases = await poolContract.getPurchaseIds();
        return await Promise.all(
            purchases.map(
                async(p) =>
                await poolContract.getPurchase({
                    purchase_id: p,
                })
            )
        );
    }

    it('should read data from BSC', mochaAsync(async () => {
        const swapContract = await getPool({chain: 'BSC', contractAddress: '0xeE62650fA45aC0deb1B24Ec19f983A8f85B727aB'});
        expect(await swapContract.minimumReached()).to.equal(true);
        expect(swapContract.version).to.equal("2.0");
        expect(swapContract).to.not.equal(false);
        const allocation = (await getUserAllocationsByPoolId({poolContract: swapContract}))[3];
        expect(allocation._id).to.equal(3);
        expect(allocation.amount).to.equal('1999.68912');
        expect(allocation.purchaser).to.equal('0x458c107a047Bb98e5d7C4a574A742D5003baf957');
        expect(allocation.costAmount).to.equal('0.873989999999999874');
    }));

    it('should read data from old ETH pool', mochaAsync(async () => {
        const swapContract = await getPool({chain: 'ETH', contractAddress: '0x868Be4f80bB166a09489822C322deb3163B5025B'});
        expect(await swapContract.minimumReached()).to.equal(true);
        expect(swapContract.version).to.equal("1.0");
        expect(swapContract).to.not.equal(false);
        const allocation = (await getUserAllocationsByPoolId({poolContract: swapContract}))[6];
        expect(allocation._id).to.equal('6');
        expect(allocation.amount).to.equal('10683.89316');
        expect(allocation.purchaser).to.equal('0xab5C49e981Fd7F3cA3bdfDE1fFEBF38723446629');
        expect(allocation.costAmount).to.equal('0.224364');
    }));

    it('should read data from polygon', mochaAsync(async () => {
        const swapContract = await getPool({chain: 'MATIC', contractAddress: '0x18E98c89d3D0E7eDe0f6E8af32c6117c3eDbb8C6'});
        expect(await swapContract.minimumReached()).to.equal(true);
        expect(swapContract.version).to.equal("2.0");
        expect(swapContract).to.not.equal(false);
        const allocation = (await getUserAllocationsByPoolId({poolContract: swapContract}))[3];
        expect(allocation._id).to.equal('3');
        expect(allocation.amount).to.equal('1041.65625');
        expect(allocation.purchaser).to.equal('0xDab6AdACCaf60960E9B9C0c32C3C8C564F2db890');
        expect(allocation.costAmount).to.equal('333.33');
    }));
});
