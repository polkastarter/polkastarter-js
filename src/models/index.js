import Web3 from "web3";
import FixedSwapContract from "./FixedSwapContract";
import Signer from "../utils/Signer";
import Account from './Account';
import ERC20TokenContract from "./ERC20TokenContract";
import FixedSwapContractLegacy from "./FixedSwapContractLegacy";
import WalletConnectProvider from "@walletconnect/web3-provider";

const ETH_URL_MAINNET =
	"https://mainnet.infura.io/v3/40e2d4f67005468a83e2bcace6427bc8";
const ETH_URL_TESTNET =
	"https://kovan.infura.io/v3/40e2d4f67005468a83e2bcace6427bc8";
const MOONBEAM_TESTNET_URL =
	"https://rpc.testnet.moonbeam.network";
const BINANCE_CHAIN_TESTNET_URL =
	"https://data-seed-prebsc-1-s1.binance.org:8545";
const BINANCE_CHAIN_URL = 
	"https://bsc-dataseed1.binance.org:443";
const POLYGON_CHAIN_TESTNET_URL =
	"https://rpc-mumbai.maticvigil.com/";
const POLYGON_CHAIN_URL =
	"https://rpc-mainnet.maticvigil.com/";
const TEST_PRIVATE_KEY = 
	"0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132";

const networksEnum = Object.freeze({
	1: "Ethereum Main",
	2: "Morden",
	3: "Ropsten",
	4: "Rinkeby",
	56: "BSC Main",
	97: "BSC Test",
	42: "Kovan",
	137: "Polygon",
	80001: "Mumbai",
});

class Application {
	constructor({test=false, mainnet=true, network='ETH', web3=undefined}) {
		this.test = test;
		global.IS_TEST = !mainnet;
		this.mainnet = mainnet;
		if((network != 'ETH') && (network != 'DOT') && (network != 'BSC') && (network !='MATIC')){
			throw new Error("Network has to be ETH or DOT or BSC or MATIC");
		}
		this.network = network;

		if(this.test){
			if (!web3) {
				this.start();
			} else {
				this.web3 = web3;
			}
			this.login();
			this.account = new Account(this.web3, this.web3.eth.accounts.privateKeyToAccount(TEST_PRIVATE_KEY));
		}
	}

	startWithoutMetamask = () => {
		if(this.network == 'DOT'){
			this.web3 = new Web3(MOONBEAM_TESTNET_URL);
		}else if(this.network == 'BSC'){
			this.web3 = new Web3(
				(this.mainnet == true) ? BINANCE_CHAIN_URL : BINANCE_CHAIN_TESTNET_URL
			);
		}else if(this.network == 'ETH'){
			this.web3 = new Web3((this.mainnet == true) ? ETH_URL_MAINNET : ETH_URL_TESTNET);
		}else if(this.network == 'MATIC'){
			this.web3 = new Web3((this.mainnet == true) ? POLYGON_CHAIN_URL : POLYGON_CHAIN_TESTNET_URL);
		}
	}
	
	start = () => {
		if(this.network == 'DOT'){
			this.web3 = new Web3(MOONBEAM_TESTNET_URL);
		}else if(this.network == 'BSC'){
			this.web3 = new Web3(
				(this.mainnet == true) ? BINANCE_CHAIN_URL : BINANCE_CHAIN_TESTNET_URL
			);
		}else if(this.network == 'ETH'){
			this.web3 = new Web3((this.mainnet == true) ? ETH_URL_MAINNET : ETH_URL_TESTNET);
		}

		if((typeof window !== "undefined") && window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			this.web3 = window.web3;
		}else{
			if(!this.test){
				let chainId;
				if (this.network == 'DOT') {
					chainId = 1287;
				} else if (this.network == 'BSC') {
					if (this.mainnet == true) {
						chainId = 56;
					} else {
						chainId = 97;
					}
				} else if (this.network == 'MATIC') {
					if (this.mainnet == true) {
						chainId = 137;
					} else {
						chainId = 80001;
					}
				} else {
					if (this.mainnet == true) {
						chainId = 1;
					} else {
						chainId = 42;
					}
				}
				this.walletConnectProvider = new WalletConnectProvider({
					rpc: {
						1: ETH_URL_MAINNET,
						56: BINANCE_CHAIN_URL,
						97: BINANCE_CHAIN_TESTNET_URL,
						42: ETH_URL_TESTNET,
						137: POLYGON_CHAIN_URL,
						80001: POLYGON_CHAIN_TESTNET_URL,
						1287: MOONBEAM_TESTNET_URL
					},
					chainId,
				});
				window.web3 = new Web3(this.walletConnectProvider);
				this.web3 = window.web3;
			}
		}
	}

	

	login = async () => {
		try{
			console.log("Login being done")
			if (typeof window === "undefined" && !this.walletConnectProvider) { return false; }

			if (this.walletConnectProvider) {
				window.web3 = new Web3(this.walletConnectProvider);
				this.web3 = window.web3;
				await this.walletConnectProvider.enable();
				return true;
			}

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

	getSigner = () => {
		return new Signer();
	}

	/* getFixedSwapContract */
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

	/* getERC20TokenContract */
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

	/* Get Network of Platform Web3 */
	getETHNetwork = async () => {
		const netId = await this.web3.eth.net.getId();
		const networkName = networksEnum.hasOwnProperty(netId)
			? networksEnum[netId]
			: "Unknown";
		return networkName;
	};

	/* Get User Address */
	getAddress = async () => {
		const accounts = await this.web3.eth.getAccounts();
		return accounts[0];
	};

	/* Get User Balance in Ethereum */
	getETHBalance = async () => {
		let wei = await this.web3.eth.getBalance(await this.getAddress());
		return this.web3.utils.fromWei(wei, "ether");
	};
}

export default Application;
