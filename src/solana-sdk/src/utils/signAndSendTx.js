"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxSignerAndSender = void 0;
class TxSignerAndSender {
    constructor(connection, signer, SendOptions) {
        this.connection = connection;
        if ('publicKey' in signer) {
            if (process.env.web) {
                this.signer = signer.publicKey;
            }
            else
                this.signer = signer;
        }
        else if (process.env.web) {
            this.signer = signer;
        }
        else
            throw Error('signer must be web3.Signer in non web environment');
        this.sendOptions = SendOptions;
    }
    async signAndSendTx(transaction, signers) {
        if (process.env.web) {
            let latestBlockhash = await this.connection.getLatestBlockhash('finalized');
            transaction.recentBlockhash = latestBlockhash.blockhash;
            transaction.feePayer = this.signer;
            return (await window.solana.signAndSendTransaction(transaction)).signature;
        }
        else {
            let signer = this.signer;
            return await this.connection.sendTransaction(transaction, signers ? [signer, ...signers] : [signer], this.sendOptions);
        }
    }
}
exports.TxSignerAndSender = TxSignerAndSender;
