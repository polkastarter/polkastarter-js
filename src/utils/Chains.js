
const ETH_URL_MAINNET =
  "https://mainnet.infura.io/v3/40e2d4f67005468a83e2bcace6427bc8";
const ETH_URL_TESTNET =
  "https://kovan.infura.io/v3/40e2d4f67005468a83e2bcace6427bc8";
const MOONBEAM_URL =
  "https://rpc.api.moonbeam.network";
const MOONBEAM_TESTNET_URL =
  "https://rpc.api.moonbase.moonbeam.network";
const BINANCE_CHAIN_TESTNET_URL =
  "https://data-seed-prebsc-1-s1.binance.org:8545";
const BINANCE_CHAIN_URL = 
  "https://bsc-dataseed1.binance.org:443";
const POLYGON_CHAIN_TESTNET_URL =
  "https://rpc-mumbai.maticvigil.com/";
const POLYGON_CHAIN_URL =
  "https://polygon-rpc.com";
const CELO_CHAIN_URL =
  "https://forno.celo.org";
const CELO_CHAIN_TESTNET_URL =
  "https://alfajores-forno.celo-testnet.org";
const AVAX_CHAIN_URL =
  "https://api.avax.network/ext/bc/C/rpc";
const AVAX_CHAIN_TESTNET_URL =
  "https://api.avax-test.network/ext/bc/C/rpc";

const networksEnum = Object.freeze({
  1: "Ethereum Main",
  2: "Morden",
  3: "Ropsten",
  4: "Rinkeby",
  56: "BNB Chain Main",
  97: "BNB Test",
  42: "Kovan",
  137: "Polygon",
  80001: "Mumbai",
  44787: "Celo Testnet",
  42220: "Celo",
  43114: "Avalanche",
  43113: "Avalanche Testnet",
  1284: "Moonbeam",
  1287: "Moonbeam Testnet"
});

/**
 * Chains object
 * @constructor Chains
 */
class chains {
  constructor() {}

  checkIfNetworkIsSupported(network)  {
    if(!this.isNetworkSupported(network)) {
			throw new Error("Network has to be ETH, DOT, BNB, MATIC, CELO or AVAX");
		}
  }

  isNetworkSupported(network) {
    if((network != 'ETH') && (network != 'DOT') && (network != 'BNB') && (network !='MATIC') && (network != 'CELO') && (network != 'AVAX')){
			return false;
		}
    return true;
  }

  getRpcUrl(network, mainnet = true) {
    if(network == 'DOT') {
      return (mainnet == true) ? MOONBEAM_URL : MOONBEAM_TESTNET_URL;
		} else if(network == 'BNB') {
			return (mainnet == true) ? BINANCE_CHAIN_URL : BINANCE_CHAIN_TESTNET_URL;
		} else if(network == 'ETH') {
			return (mainnet == true) ? ETH_URL_MAINNET : ETH_URL_TESTNET;
		} else if(network == 'MATIC') {
			return (mainnet == true) ? POLYGON_CHAIN_URL : POLYGON_CHAIN_TESTNET_URL;
		} else if(network == 'CELO') {
			return (mainnet == true) ? CELO_CHAIN_URL : CELO_CHAIN_TESTNET_URL;
		} else if(network == 'AVAX') {
			return (mainnet == true) ? AVAX_CHAIN_URL : AVAX_CHAIN_TESTNET_URL;
		}
  }

  getNetworksEnum() {
    return networksEnum;
  }
}

let Chains = new chains()

export default Chains

