/**
 * SolanaWallet
 * @constructor Wallet
 * @param {Connection} connection Solana connection
*/
class SolanaWallet {

    constructor(connection) {
        this.connection = connection;
    }

    /**
	 * @function signAndSendTx
	 * @description Signs and send a tx
    */
    async signAndSendTx(transaction, signer) {
        if(typeof window === 'undefined') {            
            return await this.connection.sendTransaction(transaction, [signer], {});
        } else {
            await window.solana.signAndSendTx(transaction);
        }
    }
    
}

export default SolanaWallet;