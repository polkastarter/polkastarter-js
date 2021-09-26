/**
 * Network utils object
 * @constructor Network
 * @param {(ETH|BSC|MATIC|DOT)=} network The network where the staking contract is. (Default: ETH)
 * @param {Boolean=} test ? Specifies if we're on test env (Default: false)
*/
class Network {

    constructor(network='ETH', test = false) {
        if((network != 'ETH') && (network != 'DOT') && (network != 'BSC') && (network !='MATIC')){
			throw new Error("Network has to be ETH or DOT or BSC or MATIC");
		}
        this.network = network;
        this.test = test;
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
	 * @function switchToPolygon
	 * @description Request switch to the Polygon chain
	 */
    async switchToPolygon() {
        if (window.ethereum) {
            if (this.test) {
                window.ethereum.request({
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
                window.ethereum.request({
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
                window.ethereum.request({
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
                window.ethereum.request({
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