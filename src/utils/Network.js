/* istanbul ignore file */

import Chains from "./Chains";

/**
 * Network utils object
 * @constructor Network
 * @param {(ETH|BSC|MATIC|DOT)=} network The network where the staking contract is. (Default: ETH)
 * @param {Boolean=} test ? Specifies if we're on test env (Default: false)
*/
class Network {

    constructor(network='ETH', test = false, getETHNetwork) {
        Chains.checkIfNetworkIsSupported(network);
        this.network = network;
        this.test = test;
        this.getETHNetwork = getETHNetwork;
    }

    /**
     * Callback when networks changes
     *
     * @callback onChainChangedCallback
     * @param {string} network - Network name
     */


    /**
	 * @function onChainChanged
     * @param {onChainChangedCallback} callback
	 * @description Triggers the callback after the users changes their chain
	 */
    async onChainChanged({callback}) {
        window.ethereum.on('chainChanged', async () => {
            callback(await this.getETHNetwork());
        });
    }
    
    /**
	 * @function changeToCurrentNetwork
	 * @description Request the wallet to change to the current chain
	 */
    async changeToCurrentNetwork() {
        await switchToNetwork(this.network) 
    }

    /**
    * @function switchToNetwork
    * @description Request switch to the Avalanche chain
    */
    async switchToNetwork(chain) {
        if (window.ethereum && chain !== undefined) {
            var chain = Chains.getChainData(chain, !this.test)

            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: '0x' + chain.chainId.toString(16).toUpperCase(),
                        chainName: chain.name,
                        nativeCurrency: {
                            name: chain.name,
                            symbol: chain.chain,
                            decimals: 18
                        },
                        rpcUrls: [chain.rpc],
                        blockExplorerUrls: [chain.explorer]
                    },
                ],
            });
        }
    }
}

export default Network;