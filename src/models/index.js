import Web3 from "web3";
import FixedSwapContract from "./FixedSwapContract";
import Account from './Account';
import ERC20TokenContract from "./ERC20TokenContract";
import FixedSwapContractLegacy from "./FixedSwapContractLegacy";

const ETH_URL_MAINNET =
	"https://dark-cold-bush.quiknode.io/9bdbc33b-14e7-4afe-bf41-e50074f83eb5/oIdoD0CCACMoKc6Vzet5uGlhtwi9NsPm7VWYh8VXy78aFykwqcJ7yUf7rvDkFCrnXI2_i-rhE6HSaG5tw3ogJg==/";
const ETH_URL_TESTNET =
	"https://kovan.infura.io/v3/811fe4fa5c4b41cb9b92f9656aaeaa3b";
const MOONBEAM_TESTNET_URL =
	"https://rpc.testnet.moonbeam.network";
const BINANCE_CHAIN_TESTNET_URL =
	"https://data-seed-prebsc-1-s1.binance.org:8545";
const BINANCE_CHAIN_URL = 
	"https://bsc-dataseed1.binance.org:443";


const TEST_PRIVATE_KEY = 
	"0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132";
export var IS_TEST = false;

const networksEnum = Object.freeze({
	1: "Ethereum Main",
	2: "Morden",
	3: "Ropsten",
	4: "Rinkeby",
	56: "BSC Main",
	97: "BSC Test",
	42: "Kovan",
});

class Application {
	constructor({test=false, mainnet=true, network='ETH'}) {
		this.test = test;
		IS_TEST = test;
		this.mainnet = mainnet;
		if((network != 'ETH') && (network != 'DOT') && (network != 'BSC') ){
			throw new Error("Network has to be ETH or DOT or BSC");
		}
		this.network = network;

		if(this.test){
			this.start();
			this.login();
			this.account = new Account(this.web3, this.web3.eth.accounts.privateKeyToAccount(TEST_PRIVATE_KEY));
		}
	}

	
	start = () => {
		if(this.network == 'DOT'){
			this.web3 = new Web3(MOONBEAM_TESTNET_URL);
		}else if(this.network == 'BSC'){
			console.log("BSC Network opened, mainnet?", this.mainnet);
			this.web3 = new Web3(
				(this.mainnet == true) ? BINANCE_CHAIN_URL : BINANCE_CHAIN_TESTNET_URL
			);
		}else if(this.network == 'ETH'){
			console.log("ETH Network opened, mainnet?", this.mainnet);
			this.web3 = new Web3((this.mainnet == true) ? ETH_URL_MAINNET : ETH_URL_TESTNET);
		}

		console.log("web3", this.web3, this.network);
		console.log("window", window)
		if((typeof window !== "undefined") && window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			this.web3 = window.web3;
		}else{
			if(!this.test){
				throw new Error("Please Use an Ethereum Enabled Browser like Metamask or Coinbase Wallet");
			}
		}
		console.log("web3", this.web3, this.network);

	}

	

	login = async () => {
		try{
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

	/* getFixedSwapContract */
	getFixedSwapContract = async ({tokenAddress, decimals, contractAddress=null}) => {
		let contract;
		
		if(!contractAddress){
			// Not deployed
			return new FixedSwapContract({
				web3: this.web3,
				tokenAddress: tokenAddress,
				decimals : decimals,
				contractAddress: contractAddress,
				acc : this.test ? this.account : null
			});
		}else{
			// Deployed
			try{
				contract = new FixedSwapContract({
					web3: this.web3,
					tokenAddress: tokenAddress,
					decimals : decimals,
					contractAddress: contractAddress,
					acc : this.test ? this.account : null
				});
				await contract.isETHTrade();
			}catch(err){
				try{
					contract = new FixedSwapContractLegacy({
						web3: this.web3,
						tokenAddress: tokenAddress,
						decimals : decimals, 
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
	getERC20TokenContract =  ({tokenAddress, decimals}) => {
		try{
			return new ERC20TokenContract({
				web3: this.web3,
				contractAddress: tokenAddress,
				decimals : decimals,
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
