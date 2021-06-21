require('dotenv').config();

import chai from 'chai';
import Application from '../../src/models';
import { mochaAsync } from '../utils';

const expect = chai.expect;

context('Signer', async () => {
    it('should sign addresses', mochaAsync(async () => {
        const app = new Application({test : true, mainnet : false, network : 'ETH'});
        const signer = app.getSigner();
        const account = signer.getAccountFromPrivateKey('0xc83b72173fd36e5945dd932b649deec654b927022e2442e8a63d7e938a3dba42');
        const signs = signer.signAddresses([
            '0xB9a83B0EB888bD041fE5704F75aAd88886A2bb0d',
            '0xA5E5fC6e75A19447544105995C0B6e8e405b63C2',
            '0x00'
        ], account);        
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
