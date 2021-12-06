/* istanbul ignore file */

import Addresses from "../models/Addresses";

import Chains from "./Chains";

/**
 * Wallet utils object
 * @constructor Wallet
 * @param {(ETH|BSC|MATIC|DOT)=} network The network where the token contract is. (Default: ETH)
 * @param {Boolean=} test ? Specifies if we're on test env (Default: false)
*/
class Wallet {

    constructor(network='ETH', test = false) {
        Chains.checkIfNetworkIsSupported(network);
        this.network = network;
        this.test = test;
        if (test) {
            this.tokenAddress = Addresses.tokenTestAddresses;
        } else {
            this.tokenAddress = Addresses.tokenAddresses;
        }

    }

    /**
	 * @function addTokenToWallet
	 * @description Adds POLS token to user's wallet
	 */
    async addTokenToWallet() {
        if (window.ethereum) {
            await window.ethereum.request({
                method: 'metamask_watchAsset',
                params: {
                    "type": "ERC20",
                    "options": {
                      "address": this.tokenAddress,
                      "symbol": "POLS",
                      "decimals": 18
                    },
                  },
            });
        }
    }
    
}

export default Wallet;