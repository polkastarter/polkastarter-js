/* istanbul ignore file */

/**
 * Client utils object
 * @constructor Network
*/
class Client {
    metamaskCall = async ({ f, acc, value, callback=()=> {} }) => {
		return new Promise( (resolve, reject) => {
			// Detect possible error on tx
			f.estimateGas({gas: 5000000}, (error, gasAmount) => {
				//if(error){reject("Transaction will fail : " + error);}
				if(gasAmount >= 5000000){
					reject("Transaction will fail, too much gas");
				}

				// all alright
				f.send({
					from: acc,
					value: value,
				})
				.on("confirmation", (confirmationNumber, receipt) => {
					callback(confirmationNumber)
					if (confirmationNumber > 0) {
						resolve(receipt);
					}
				})
				.on("error", (err) => {
					reject(err);
				});
			});
		});
	};

	sendTx = async (web3, acc, contract, f, call = false, value, callback=()=>{}) => {
		var res;
		if (!acc && !call) {
			const accounts = await web3.eth.getAccounts();
			res = await this.metamaskCall({ f, acc: accounts[0], value, callback });
		} else if (acc && !call) {
			let data = f.encodeABI();
			res = await contract.send(
				acc.getAccount(),
				data,
				value
			);
		} else if (acc && call) {
			res = await f.call({ from: acc.getAddress() });
		} else {
			res = await f.call();
		}
		return res;
	};
}
export default Client;
