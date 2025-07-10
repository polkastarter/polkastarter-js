const networks = [
  { name: 'Ethereum Main',     chain: 'ETH',   currency: 'ETH',   chainId: 1,        testnet: false, rpc: "https://mainnet.infura.io/v3/40e2d4f67005468a83e2bcace6427bc8", explorer: "https://etherscan.io/" },
  { name: 'Ethereum Sepolia',  chain: 'ETH',   currency: 'ETH',   chainId: 11155111, testnet: true,  rpc: "https://ethereum-sepolia.publicnode.com",                       explorer: "https://sepolia.etherscan.io/" },
  { name: 'BSC Main',          chain: 'BSC',   currency: 'BSC',   chainId: 56,       testnet: false, rpc: "https://bsc-dataseed1.binance.org:443",                         explorer: "https://bscscan.com/" },
  { name: 'BSC Test',          chain: 'BSC',   currency: 'BSC',   chainId: 97,       testnet: true,  rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",                explorer: "https://testnet.bscscan.com/" },
  { name: 'Polygon',           chain: 'MATIC', currency: 'MATIC', chainId: 137,      testnet: false, rpc: "https://polygon-rpc.com",                                       explorer: "https://polygonscan.com/" },
  { name: 'Mumbai',            chain: 'MATIC', currency: 'MATIC', chainId: 80001,    testnet: true,  rpc: "https://rpc-mumbai.maticvigil.com",                             explorer: "https://mumbai.polygonscan.com/" },
  { name: 'Celo',              chain: 'CELO',  currency: 'CELO',  chainId: 42220,    testnet: false, rpc: "https://forno.celo.org",                                        explorer: "https://explorer.celo.org" },
  { name: 'Celo Testnet',      chain: 'CELO',  currency: 'CELO',  chainId: 44787,    testnet: true,  rpc: "hhttps://alfajores-forno.celo-testnet.org",                     explorer: "https://alfajores-blockscout.celo-testnet.org" },
  { name: 'Avalanche',         chain: 'AVAX',  currency: 'AVAX',  chainId: 43114,    testnet: false, rpc: "https://api.avax.network/ext/bc/C/rpc",                         explorer: "https://snowtrace.io/" },
  { name: 'Avalanche Testnet', chain: 'AVAX',  currency: 'AVAX',  chainId: 43113,    testnet: true,  rpc: "https://api.avax-test.network/ext/bc/C/rpc",                    explorer: "https://testnet.snowtrace.io/" },
  { name: 'Arbitrum',          chain: 'AETH',  currency: 'ETH',  chainId: 42161,    testnet: false, rpc: "https://arb1.arbitrum.io/rpc",                                  explorer: "https://arbiscan.io/" },
  { name: 'Arbitrum Sepolia',  chain: 'AETH',  currency: 'ETH',  chainId: 421614,   testnet: true,  rpc: "https://sepolia-rollup.arbitrum.io/rpc",                        explorer: "https://sepolia.arbiscan.io/" },
  { name: 'Mode',              chain: 'METH',  currency: 'ETH',  chainId: 34443,    testnet: false, rpc: "https://mainnet.mode.network",                                  explorer: "https://explorer.mode.network/" },
  { name: 'Mode Sepolia',      chain: 'METH',  currency: 'ETH',  chainId: 919,      testnet: true,  rpc: "https://sepolia.mode.network",                                  explorer: "https://sepolia.explorer.mode.network/" },
  { name: 'Base',              chain: 'BETH',  currency: 'ETH',  chainId: 8453,     testnet: false, rpc: "https://mainnet.base.org",                                      explorer: "https://basescan.org/" },
  { name: 'Base Sepolia',      chain: 'BETH',  currency: 'ETH',  chainId: 84532,    testnet: true,  rpc: "https://sepolia.base.org",                                      explorer: "https://sepolia.basescan.org/" },
  { name: 'Sei',               chain: 'SEI',   currency: 'SEI',  chainId: 1329,     testnet: false, rpc: "https://evm-rpc.sei-apis.com",                                  explorer: "https://seitrace.com/" },
  { name: 'Sei Testnet',       chain: 'SEI',   currency: 'SEI',  chainId: 1328,     testnet: true,  rpc: "https://evm-rpc-testnet.sei-apis.com",                          explorer: "https://seitrace.com/" },
]

/**
 * Chains object
 * @constructor Chains
 */
class chains {
  constructor() {}

  checkIfNetworkIsSupported(network)  {
    if(!this.isNetworkSupported(network)) {
			throw new Error("Network unsupported");
		}
  }

  isNetworkSupported(chain) {
    return networks.map((network) => network.chain).includes(chain)
  }

  getChainData(chain, mainnet = true) {
    return networks.find((network) => network.chain == chain && network.testnet !== mainnet)
  }

  getRpcUrl(chain, mainnet = true) {
    return networks.find((network) => network.chain == chain && network.testnet !== mainnet).rpc
  }

  getExplorercUrl(chain, mainnet = true) {
    return networks.find((network) => network.chain == chain && network.testnet !== mainnet).explorer
  }

  getNetworksEnum() {
    return networks.reduce((hash, network) => { hash[network.chainId] = network.name; return hash; }, {});
  }
}

let Chains = new chains()

export default Chains

