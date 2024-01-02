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
        if (this.network == 'ETH') {
            await this.switchToEthereum();
        } else if (this.network == 'MATIC') {
            await this.switchToPolygon();
        } else if (this.network == 'BSC') {
            await this.switchToBsc();
        } else if (this.network == 'CELO') {
            await this.switchToCelo();
        } else if (this.network == 'AVAX') {
            await this.switchToAvalanche();
        } else if (this.network == 'AETH') {
            await this.switchToArbitrum();
        }
    }

    /**
	 * @function switchToEthereum
	 * @description Request switch to the ETH chain
	 */
    async switchToEthereum() {
        if (window.ethereum) {
            if (this.test) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x2A' }],
                });
            } else {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }],
                });
            }
        }
    }

    /**
     * @function switchToAvalanche
     * @description Request switch to the Avalanche chain
     */
     async switchToAvalanche() {
        if (window.ethereum) {
            if (this.test) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0xA869',
                        chainName: 'Avalanche Testnet C-Chain',
                        nativeCurrency: {
                            name: 'Avalanche',
                            symbol: 'AVAX',
                            decimals: 18
                        },
                        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                        blockExplorerUrls: ['https://testnet.snowtrace.io/']
                    },
                    ],
                });
            } else {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0xA86A',
                        chainName: 'Avalanche C-Chain',
                        nativeCurrency: {
                            name: 'Avalanche',
                            symbol: 'AVAX',
                            decimals: 18
                        },
                        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                        blockExplorerUrls: ['https://snowtrace.io/']
                    },
                    ],
                });
            }
        }
    }    

    /**
     * @function switchToArbitrum
     * @description Request switch to the Arbitrum chain
     */
     async switchToArbitrum() {
        if (window.ethereum) {
            if (this.test) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0x66EED',
                        chainName: 'Arbitrum Goerli',
                        nativeCurrency: {
                            name: 'Arbitrum',
                            symbol: 'AETH',
                            decimals: 18
                        },
                        rpcUrls: ['https://arbitrum-goerli.blockpi.network/v1/rpc/public'],
                        blockExplorerUrls: ['https://explorer.bitquery.io/goerli']
                    },
                    ],
                });
            } else {
                 await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0xA4B1',
                        chainName: 'Arbitrum',
                        nativeCurrency: {
                            name: 'Arbitrum',
                            symbol: 'AETH',
                            decimals: 18
                        },
                        rpcUrls: ['https://arbitrum.llamarpc.com'],
                        blockExplorerUrls: ['https://arbiscan.io/']
                    },
                    ],
                });
            }
        }
    }

    /**
	 * @function switchToMoonbeam
	 * @description Request switch to the Moonbeam chain
	 */
     async switchToMoonbeam() {
        if (window.ethereum) {
            if (this.test) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0x507',
                        chainName: 'Moonbase Alpha',
                        nativeCurrency: {
                            name: 'DEV',
                            symbol: 'DEV',
                            decimals: 18
                        },
                        rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
                        blockExplorerUrls: ['https://moonbase.moonscan.io/']
                    },
                    ],
                });
            } else {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0x504',
                        chainName: 'Moonbeam',
                        nativeCurrency: {
                            name: 'GLMR',
                            symbol: 'GLMR',
                            decimals: 18
                        },
                        rpcUrls: ['https://rpc.api.moonbeam.network'],
                        blockExplorerUrls: ['https://moonscan.io']
                    },
                    ],
                });
            }
        }
    }

    /**
	 * @function switchToCelo
	 * @description Request switch to the Celo chain
	 */
     async switchToCelo() {
        if (window.ethereum) {
            if (this.test) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0xAEF3',
                        chainName: 'Celo Testnet',
                        nativeCurrency: {
                        name: 'CELO',
                        symbol: 'CELO',
                        decimals: 18,
                        },
                        rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
                        blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
                    },
                    ],
                });
            } else {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0xA4EC',
                        chainName: 'Celo',
                        nativeCurrency: {
                        name: 'CELO',
                        symbol: 'CELO',
                        decimals: 18,
                        },
                        rpcUrls: ['https://forno.celo.org'],
                        blockExplorerUrls: ['https://explorer.celo.org'],
                    },
                    ],
                });
            }
        }
    }

    /**
	 * @function switchToPolygon
	 * @description Request switch to the Polygon chain
	 */
    async switchToPolygon() {
        if (window.ethereum) {
            if (this.test) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0x13881',
                        chainName: 'Polygon Testnet',
                        nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18,
                        },
                        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                    },
                    ],
                });
            } else {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0x89',
                        chainName: 'Polygon',
                        nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18,
                        },
                        rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
                        blockExplorerUrls: ['https://polygonscan.com/'],
                    },
                    ],
                });
            }
        }
    }

    /**
	 * @function switchToBsc
	 * @description Request switch to the Binance smart chain
	*/
    async switchToBsc() {
        if (window.ethereum) {
            if (this.test) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0x61',
                        chainName: 'Binance Smart Chain Test',
                        nativeCurrency:
                        {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                        blockExplorerUrls: ['https://testnet.bscscan.com/'],
                    },
                    ],
                });
            } else {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                    {
                        chainId: '0x38',
                        chainName: 'Binance Smart Chain',
                        nativeCurrency:
                        {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18
                        },
                        rpcUrls: ['https://bsc-dataseed.binance.org/'],
                        blockExplorerUrls: ['https://bscscan.com/'],
                    },
                    ],
                });
            }
        }
    }
}

export default Network;