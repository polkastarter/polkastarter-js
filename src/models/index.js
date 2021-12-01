import Web3 from "web3";
import FixedSwapContract from "./FixedSwapContract";
import Signer from "../utils/Signer";
import Network from "../utils/Network";
import Wallet from "../utils/Wallet";
import Account from './Account';
import ERC20TokenContract from "./ERC20TokenContract";
import Staking from "./Staking";
import FixedSwapContractLegacy from "./FixedSwapContractLegacy";
import Chains from "../utils/Chains";

const TEST_PRIVATE_KEY = 
  "0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132";

/**
 * Polkastarter Application Object
 * @constructor Application
 * @param {(ETH|BSC|MATIC|DOT)=} network Current network (Default = ETH)
 * @param {Boolean=} mainnet Specifies if we're on mainnet or tesnet (Default = true);
 * @param {Boolean=} test ? Specifies if we're on test env
 * @param {Web3=} web3 Custom Web3 instance. If not provided the Application will instance it for you. (Default: undefined)
 */
class Application {
	constructor({test=false, mainnet=true, network='ETH', web3=undefined}) {
		this.test = test;
		global.IS_TEST = !mainnet;
		this.mainnet = mainnet;
		Chains.checkIfNetworkIsSupported(network);
		this.network = network;

		if(this.test){
			if (!web3) {
				this.start();
			} else {
				this.web3 = web3;
			}
			// this.login();
			this.account = new Account(this.web3, this.web3.eth.accounts.privateKeyToAccount(TEST_PRIVATE_KEY));
		}
	}

	/**
	 * @function startWithoutMetamask
	 * @description Starts an instance of web3 for read-only methods
	 */
	startWithoutMetamask = () => {
		const rpc = Chains.getRpcUrl(this.network, this.mainnet);
		if (rpc) {
			this.web3 = new Web3(rpc);
		}
	}
	
	/**
	 * @function start
	 * @description Starts an instance of web3
	 */
	start = () => {
		const rpc = Chains.getRpcUrl(this.network, this.mainnet);
		if (rpc) {
			this.web3 = new Web3(rpc);
		}

		if((typeof window !== "undefined") && window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			this.web3 = window.web3;
		}
	}


	/**
	 * @function login
	 * @description Logins with metamask
	*/
	login = async () => {
		try{
			console.log("Login being done")
			if (typeof window === "undefined") { return false; }
			if (window.ethereum) {
				window.web3 = new Web3(window.ethereum);
				this.web3 = window.web3;
				await window.ethereum.enable();
				return true;
			}
			return false;
		}catch(err){
			throw err;
		}
	};


	__getUserAccount = ({privateKey}) => {
		return new Account(this.web3, this.web3.eth.accounts.privateKeyToAccount(privateKey));
	}

	/**
	 * @function getSigner
	 * @description Returns the Signer instance. 
	*/
	getSigner = () => {
		return new Signer(this.web3, this.test ? this.account : null);
	}

	/**
	 * @function getNetworkUtils
	 * @description Returns the Network Utils instance. 
	*/
	getNetworkUtils = () => {
		return new Network(this.network, !this.mainnet, this.getETHNetwork);
	}

	/**
	 * @function getWalletUtils
	 * @description Returns the Wallet Utils instance. 
	*/
	getWalletUtils = () => {
		return new Wallet(this.network, !this.mainnet);
	}

	/**
	 * @function getStaking
	 * @param {string=} contractAddress The staking contract address. (Default: Predefined addresses depending on the network)
	 * @param {string=} tokenAddress The staking token address. (Default: Predefined addresses depending on the network)
	 * @description Returns the Staking Model instance. 
	*/
	getStaking = ({contractAddress=null, tokenAddress=null}) => {
		return new Staking({
			web3: this.web3,
			acc : this.test ? this.account : null,
			contractAddress: contractAddress,
			tokenAddress: tokenAddress,
			network: this.network,
			test: !this.mainnet
		});
	}

	/**
	 * @function getFixedSwapContract
	 * @param {string} tokenAddress The token address we want to trade
	 * @param {string=} contractAddress The swap contract address, in case t hat has already been instanced. (Default = null)
	 * @description Returns Fixed Swap instance
	*/
	getFixedSwapContract = async ({tokenAddress, contractAddress=null}) => {
		let contract;
		if(!contractAddress){
			// Not deployed
			return new FixedSwapContract({
				web3: this.web3,
				tokenAddress: tokenAddress,
				contractAddress: contractAddress,
				acc : this.test ? this.account : null
			});
		}else{
			// Deployed
			try{
				contract = new FixedSwapContract({
					web3: this.web3,
					tokenAddress: tokenAddress,
					contractAddress: contractAddress,
					acc : this.test ? this.account : null
				});
				await contract.isETHTrade();
			}catch(err){
				try{
					contract = new FixedSwapContractLegacy({
						web3: this.web3,
						tokenAddress: tokenAddress,
						contractAddress: contractAddress,
						acc : this.test ? this.account : null
					});
				}catch(err){
					throw err;
	
				}
			}
	
			return contract;
		}
	};
	
	/**
	 * @function getERC20TokenContract
	 * @param {string} tokenAddress The token address
	 * @description Returns ERC20 instance
	*/
	getERC20TokenContract =  ({tokenAddress}) => {
		try{
			return new ERC20TokenContract({
				web3: this.web3,
				contractAddress: tokenAddress,
				acc : this.test ? this.account : null
			});
		}catch(err){
			throw err;
		}
	};

	/**
	 * @function getETHNetwork
	 * @description Returns the current network
	*/
	getETHNetwork = async () => {
		const netId = await this.web3.eth.net.getId();
		const networksEnum = Chains.getNetworksEnum();
		const networkName = networksEnum.hasOwnProperty(netId)
			? networksEnum[netId]
			: "Unknown";
		return networkName;
	};

	/**
	 * @function getAddress
	 * @description Returns the connected user address
	*/
	getAddress = async () => {
		const accounts = await this.web3.eth.getAccounts();
		return accounts[0];
	};


	/**
	 * @function getETHBalance
	 * @description Returns the native currency of the connected user wallet.
	*/
	getETHBalance = async () => {
		let wei = await this.web3.eth.getBalance(await this.getAddress());
		return this.web3.utils.fromWei(wei, "ether");
	};
}

export default Application;
