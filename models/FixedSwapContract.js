import { fixedswap } from "../interfaces";
import Contract from "./Contract";
import ERC20TokenContract from "./ERC20Contract";
import Numbers from "../utils/Numbers";
import _ from 'lodash';

class FixedSwapContract {
	constructor({web3, tokenAddress, decimals, contractAddress=null /* If not deployed */, acc}) {
		try {
			if(!tokenAddress && !decimals){
				throw new Error("Please provide a Token Address and the decimals of this Tokens");
			};
			
			if(!web3){
				throw new Error("Please provide a valid web3 provider");
			}
			if(acc){
				this.acc = acc;
			}
			this.params = {
				web3: web3,
				contractAddress : contractAddress,
				contract: new Contract(
					web3,
					fixedswap,
					contractAddress
				),
				erc20TokenContract: new ERC20TokenContract({
					web3: web3,
					decimals : decimals,
					contractAddress: tokenAddress,
					acc
				}),
			};

			this.decimals = decimals;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @constructor Starting Function
	 */

	__init__() {
		try {
			if(!this.getAddress()){
				throw new Error("Please add a Contract Address")
			}
			this.__assert();
		} catch (err) {
			throw err;
		}
	}

	__sendTx = async (f, call=false, value) => {
		var res;
		if(!this.acc){
			console.log("a")
			const accounts = await this.params.web3.eth.getAccounts();
			res = await f.send({
				from : accounts[0],
				value : value
			});
		}else if(this.acc && !call){
			let data = f.encodeABI();
			res = await this.params.contract.send(this.acc.getAccount(), data, value);
		}else if(this.acc && call){
			res = await f.call({from : this.acc.getAddress()});
		}else{
			res = await f.call();
		}
		return res;
	}


	__deploy = async (params) => {
	 	return await this.params.contract.deploy(
			this.acc,
			this.params.contract.getABI(), 
			this.params.contract.getJSON().bytecode, 
			params
		);
	}

	/* Admin Functions */
	async authorize({address}) {
		try {
			return await this.__sendTx(
				this.params.contract
				.getContract()
				.methods.authorize(address)
			);
		} catch (err) {
			throw err;
		}
	}

	isAuthorized = async ({address}) => {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.authorized(address)
			);
		} catch (err) {
			throw err;
		}
	};

	setNewOwner = async ({address}) => {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.transferOwnership(address)
			);
		} catch (err) {
			throw err;
		}
	};


	async owner() {
		try {
			return await this.params.contract
				.getContract()
				.methods.owner()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	async isPaused() {
		try {
			return await this.params.contract
				.getContract()
				.methods.paused()
				.call();
		} catch (err) {
			return "N/A";
		}
	}

	async pauseContract() {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.pause()
			);
		} catch (err) {
			throw err;
		}
	}

	async unpauseContract() {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.unpause()
			);
		} catch (err) {
			throw err;
		}
	}

	/* Get Functions */

	async tradeValue() {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.tradeValue()
				.call(), this.getDecimals()));
		} catch (err) {
			return "N/A";
		}
	}

	async startDate() {
		try {
			return Numbers.fromSmartContractTimeToMinutes((await this.params.contract
				.getContract()
				.methods.startDate()
				.call()));
		} catch (err) {
			return "N/A";
		}
	}

	async endDate() {
		try {
			return Numbers.fromSmartContractTimeToMinutes((await this.params.contract
				.getContract()
				.methods.endDate()
				.call()));
		} catch (err) {
			return "N/A";
		}
	}

	async individualMinimumAmount() {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.individualMinimumAmount()
				.call()),this.getDecimals());
		} catch (err) {
			return "N/A";
		}
	}

	async individualMaximumAmount() {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.individualMaximumAmount()
				.call()), this.getDecimals());
		} catch (err) {
			return "N/A";
		}
	}

	async minimumRaise() {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.minimumRaise()
				.call()), this.getDecimals());
		} catch (err) {
			return "N/A";
		}
	}

	async tokensAllocated() {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.tokensAllocated()
				.call()), this.getDecimals());
		} catch (err) {
			return "N/A";
		}
	}
	
	async tokensForSale() {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.tokensForSale()
				.call()), this.getDecimals());
		} catch (err) {
			return "N/A";
		}
	}

	async tokensAvailable() {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.availableTokens()
				.call()), this.getDecimals());
		} catch (err) {
			return "N/A";
		}
	}

	async tokensLeft() {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.tokensLeft()
				.call()), this.getDecimals());
		} catch (err) {
			return "N/A";
		}
	}

	async isTokenSwapAtomic() {
		try {
			return (await this.params.contract
				.getContract()
				.methods.isTokenSwapAtomic()
				.call());
		} catch (err) {
			return "N/A";
		}
	}

	async isFunded() {
		try {
			return (await this.params.contract
				.getContract()
				.methods.isSaleFunded()
				.call());
		} catch (err) {
			return "N/A";
		}
	}

	async isOpen() {
		try {
			return (await this.params.contract
				.getContract()
				.methods.isOpen()
				.call());
		} catch (err) {
			return "N/A";
		}
	}

	async hasStarted() {
		try {
			return (await this.params.contract
				.getContract()
				.methods.hasStarted()
				.call());
		} catch (err) {
			return "N/A";
		}
	}

	async isPreStart() {
		try {
			return (await this.params.contract
				.getContract()
				.methods.isPreStart()
				.call());
		} catch (err) {
			return "N/A";
		}
	}

	getPurchase = async ({ purchase_id }) => {
		let res = await this.__sendTx( 
			this.params.contract
			.getContract()
			.methods.getPurchase(purchase_id)
		);

		return {
			_id: purchase_id,
			amount: Numbers.fromDecimals(res[0], this.getDecimals()),
			purchaser: res[1],
			ethAmount: Numbers.fromDecimals(res[2], 18),
			timestamp: Numbers.fromSmartContractTimeToMinutes(res[3]),
			wasFinalized: res[4],
			reverted: res[5]
		};
	};

	getBuyers = async () => await this.params.contract.getContract().methods.buyers().call();

	getPurchaseIds = async () => (await this.params.contract.getContract().methods.purchaseIds().call()).map( id => Numbers.fromExponential(id));

	getAddressPurchaseIds = async ({address}) => (
		(await this.__sendTx(
			this.params.contract.getContract().methods.myPurchases(address), 
			true)
		).map( id => Numbers.fromExponential(id))
	);

		
	getETHCostFromTokens = async ({tokenAmount}) => {
		try {
			return Numbers.fromDecimals((await this.params.contract
				.getContract()
				.methods.cost(tokenAmount)
				.call()), 18);
		} catch (err) {
			return "N/A";
		}
	}
	/* POST User Functions */


 
	swap = async ({tokenAmount}) => {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			this.getDecimals()
		);

		let ETHCost = await this.getETHCostFromTokens({tokenAmount : tokenAmount});
		let ETHToWei = Numbers.toSmartContractDecimals(
			ETHCost,
			18
		);
		console.log("eth cost", ETHToWei, tokenAmount) 
		return await this.__sendTx( 
			this.params.contract
			.getContract()
			.methods.swap(amountWithDecimals)
		, false, ETHToWei)
	}

	redeemTokens = async ({purchase_id}) => {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.redeemTokens(purchase_id)
			);
		} catch (err) {
			throw err;
		}
	};

	redeemGivenMinimumGoalNotAchieved = async ({purchase_id}) => {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.redeemGivenMinimumGoalNotAchieved(purchase_id)
			);
		} catch (err) {
			throw err;
		}
	};

	withdrawUnsoldTokens = async () => {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.withdrawUnsoldTokens()
			);
		} catch (err) {
			throw err;
		}
	};

	/* POST Admin Functions */

	depositTokensForSale = async () => {
		if(!this.getTokenContract()){
			throw new Error('To Deposit a Token Address has to be set')
		};
		try {
			return await this.getTokenContract().transferTokenAmount({toAddress : this.getAddress(), tokenAmount : this.tokensForSale()})
		} catch (err) {
			throw err;
		}
	}

	withdrawFunds = async () => {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.withdrawFunds()
			);
		} catch (err) {
			throw err;
		}
	};

	fund = async ({tokenAmount}) => {
		try {
			let amountWithDecimals = Numbers.toSmartContractDecimals(
				tokenAmount,
				this.getDecimals()
			);
	
			/* Approve tx */
			await this.params.erc20TokenContract.approve({address : this.getAddress(), amount : tokenAmount});
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.fund(amountWithDecimals)
			);
		} catch (err) {
			throw err;
		}
	};

	removeOtherERC20Tokens = async ({tokenAddress, toAddress}) => {
		try {
			return await this.__sendTx( 
				this.params.contract
				.getContract()
				.methods.removeOtherERC20Tokens(tokenAddress, toAddress)
			);
		} catch (err) {
			throw err;
		}
	};

	__assert() {
		this.params.contract.use(fixedswap, this.getAddress());
	}

	/**
	 * @constructor Starting Function
	 */

	getDecimals = () => this.decimals || 18;

	fromIntToFloatEthereum(int) {
		return Math.round(int * 100);
	}

	   /**
     * @Functions
     */

    deploy = async({
        tradeValue, tokensForSale, startDate, endDate, 
        individualMinimumAmount=0, individualMaximumAmount=0, isTokenSwapAtomic=true, minimumRaise=0
	}) => {

        try{             
            if(_.isEmpty(this.getTokenAddress())){
                throw new Error('Token Address not provided');
			}  
            if(tradeValue <= 0){
                throw new Error('Trade Value has to be > 0');
            }  
            if(tokensForSale <= 0){
                throw new Error('Tokens for Sale has to be > 0');
            }  
            if(_.isEmpty(startDate)){
                throw new Error('Start Date not provided');
            }  
            if(_.isEmpty(endDate)){
                throw new Error('End Date not provided');
			}  
			if(individualMaximumAmount <= individualMinimumAmount){
                throw new Error('Maximum Amount is smaller than minimum Amount per User');
			}

            let params = [
                this.getTokenAddress(),
                Numbers.toSmartContractDecimals(tradeValue, 18), /* to wei */
                Numbers.toSmartContractDecimals(tokensForSale, this.getDecimals()),
                Numbers.timeToSmartContractTime(startDate),
                Numbers.timeToSmartContractTime(endDate),
				Numbers.toSmartContractDecimals(individualMinimumAmount, this.getDecimals()),
				Numbers.toSmartContractDecimals(individualMaximumAmount, this.getDecimals()),
                isTokenSwapAtomic,
                Numbers.toSmartContractDecimals(minimumRaise, this.getDecimals()), 
			];
			let res = await this.__deploy(params);
			console.log("done")
			this.params.contractAddress = res.contractAddress;
			/* Call to Backend API */

            this.__assert({contractAddress : res.contractAddress});
            return res;
        }catch(err){
            throw err
        }
    }   

	getAddress() {
		return this.params.contractAddress;
	}

	getTokenAddress() {
		return this.params.erc20TokenContract.getAddress();
	}

	getTokenContract(){
		return this.params.erc20TokenContract;
	}

	getOwner = async () => {
		try {
			return (await this.params.contract
				.getContract()
				.methods.owner()
				.call());
		} catch (err) {
			return "N/A";
		} 
	}
	/* Backend API */
	
}

export default FixedSwapContract;
