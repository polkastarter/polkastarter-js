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
        const account = await signer.generateSignerAccount('test1234');
        expect(signer.getAddressFromAccount(account, 'test1234').toLowerCase()).to.equal(('0x' + JSON.parse(account).address).toLowerCase());
    }));

    it('should sign addresses', mochaAsync(async () => {
        const signs = await signer.signAddresses([
            '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
            '0xA5E5fC6e75A19447544105995C0B6e8e405b63C2',
            '0x00'
        ], JSON.stringify(jsonAccount), 'test1234');     
        expect(signs).to.have.deep.members([
            {
              address: '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
              signature: '0xb8f7e7882bedabecefdffd01db6a6a4368e84fb9f7f4d1c7bfc203b35262da3a5cfe1022ee3ce3312f9df629a1df5be6b323b289cfe863831670940307f6e7dc1b'
            },
            {
              address: '0xA5E5fC6e75A19447544105995C0B6e8e405b63C2',
              signature: '0x941193c43d758d0b1eeb9519c52f2382e42c5f6e049019885215edd2f5bfa06d21058ff317ad5b579906a1c276e61c36e4c59851293530b04e4ddee4c0bb31491b'
            }
        ]);
    }));

});
