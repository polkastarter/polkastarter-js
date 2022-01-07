require('dotenv').config();

import chai from 'chai';
import Application from '../../src/models';
import { mochaAsync } from '../utils';

const expect = chai.expect;

context('Signer', async () => {

    const app = new Application({test : true, mainnet : false, network : 'ETH'});
    const signer = app.getSigner();

    const jsonAccount = {"address":"46d0e9eafe3a1eb66fc54cf40d949fd711e54355","crypto":{"cipher":"aes-128-ctr","ciphertext":"e3565812298ec27625e5a64e40beaf31233ac3fd392e08dc67928c1899f85722","cipherparams":{"iv":"7f35572de5630547d405177850f912c8"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"8c75a1deec757088496a0f24408a13683acc55f935a37b6a202380072eabe2e2"},"mac":"73026bbba3027046412d8c70132b1b5104a04ea7402b19526c6b2284395e0207"},"id":"fa401ff0-7e2e-4fbd-af65-115985a0f4f7","version":3};
    it('should generate valid accounts', mochaAsync(async () => {
        const account = await signer.generateSignerAccount({password: 'test1234'});
        expect(signer.getAddressFromAccount({accountJson: account, password: 'test1234'}).toLowerCase()).to.equal(('0x' + JSON.parse(account).address).toLowerCase());
    }));

    it('should sign addresses', mochaAsync(async () => {
        const signs = await signer.signAddresses({
            addresses: [
                '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
                '0xA5E5fC6e75A19447544105995C0B6e8e405b63C2',
                '0x00'
            ],
            accountMaxAllocations: [
                10,
                20,
                10
            ],
            decimals: 18,
            contractAddress: '0xb8f7166496996a7da21cf1f1b04d9b3e26a3d077',
            accountJson: JSON.stringify(jsonAccount), 
            password: 'test1234'
        }); 

        expect(signs).to.have.deep.members([
            {
              address: '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
              signature: '0x74f1e4aad1ed1aff418413052a519b856292bdf752558ad5eb56e05dcc52126b28fdabd9db2a72e09a205246f95984500fc7e8ad6e7043809f2d4bd53960e7831c',
              allocation: '10000000000000000000'
            },
            {
              address: '0xA5E5fC6e75A19447544105995C0B6e8e405b63C2',
              signature: '0x6f5f993225fdc5fc093f856ba658bc51bcd87bc4b1b3e91e526fd658982bfb5d4e1994d84eb39302af99d398d3a7cb890d06aedcdc429b48666795a433242e961c',
              allocation: '20000000000000000000'
            }
        ]);
    }));

    it('should verify signature', mochaAsync(async () => {
        const verified = await signer.verifySignature({
            signature: '0x74f1e4aad1ed1aff418413052a519b856292bdf752558ad5eb56e05dcc52126b28fdabd9db2a72e09a205246f95984500fc7e8ad6e7043809f2d4bd53960e7831c',
            address: '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
            signerAddress: '0x46d0e9eafe3a1eb66fc54cf40d949fd711e54355',
            accountMaxAllocation: '10000000000000000000',
            contractAddress: '0xb8f7166496996a7da21cf1f1b04d9b3e26a3d077',
        });
        expect(verified).to.equal(true);


        const signedWithAnotherAccount = await signer.verifySignature({
            signature: '0x76d620690fbc5324ed1602e617cbb185c33e93b0e895587a9402a41faefc9dca2d2e40809da5a04707727665219574021517d827a83903e8c1dc220f7da876831c',
            address: '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
            signerAddress: '0x46d0e9eafe3a1eb66fc54cf40d949fd711e54355',
            accountMaxAllocation: '10000000000000000000',
            contractAddress: '0xb8f7166496996a7da21cf1f1b04d9b3e26a3d077',
        });
        expect(signedWithAnotherAccount).to.equal(false);

        const signedWithAnotherAllocation = await signer.verifySignature({
            signature: '0x74f1e4aad1ed1aff418413052a519b856292bdf752558ad5eb56e05dcc52126b28fdabd9db2a72e09a205246f95984500fc7e8ad6e7043809f2d4bd53960e7831c',
            address: '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
            signerAddress: '0x46d0e9eafe3a1eb66fc54cf40d949fd711e54355',
            accountMaxAllocation: '50000000000000000000',
            contractAddress: '0xb8f7166496996a7da21cf1f1b04d9b3e26a3d077',
        });
        expect(signedWithAnotherAllocation).to.equal(false);

        const invalidSig = await signer.verifySignature({
            signature: '0x76d620690fbc5324ed1602e617cbb185c33e93b0e895587a9402a41faefc9dca2d2e40809da5a04707727665219574021517d827a83903e8c1dc220f7ba876831c',
            address: '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
            signerAddress: '0x46d0e9eafe3a1eb66fc54cf40d949fd711e54355',
            accountMaxAllocation: '10000000000000000000',
            contractAddress: '0xb8f7166496996a7da21cf1f1b04d9b3e26a3d077',
        });
        expect(invalidSig).to.equal(false);
    }));

});
