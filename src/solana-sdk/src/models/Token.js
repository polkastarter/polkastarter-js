"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const spltoken = __importStar(require("@solana/spl-token"));
const anchor = __importStar(require("@project-serum/anchor"));
const signAndSendTx_1 = require("../utils/signAndSendTx");
class Token {
    constructor(connection, mint, user) {
        this.connection = connection;
        this.address = mint.address;
        this.decimals = mint.decimals;
        this.freezeAuthority = mint.freezeAuthority;
        this.isInitialized = mint.isInitialized;
        this.mintAuthority = mint.mintAuthority;
        this.supply = mint.supply;
        if (user && 'publicKey' in user) {
            this.user = user.publicKey;
        }
        else {
            //to be used in web environment (there is probably a better way to do it)
            this.user = user;
        }
        this.txSignerAndSender = new signAndSendTx_1.TxSignerAndSender(connection, user, {
            maxRetries: 10, preflightCommitment: 'finalized', skipPreflight: false
        });
    }
    static async fromAddress(connection, address, user, commitment) {
        let mint = await spltoken.getMint(connection, address, commitment);
        return new Token(connection, mint, user);
    }
    getAddress() {
        return this.address;
    }
    setNewOwner(newOwner, authType, currentOwner, signers) {
        const instruction = spltoken.createSetAuthorityInstruction(this.address, currentOwner ? currentOwner.publicKey : this.user, authType ? authType : spltoken.AuthorityType.AccountOwner, newOwner);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    transferTokenAmount(toAddress, amount) {
        const amountWithDecimals = BigInt(amount) * BigInt(10 ** this.decimals);
        const instruction = spltoken.createTransferInstruction(this.user, toAddress, this.user, amountWithDecimals);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async getTokenAmount(address, commitment) {
        let userTokenAddress = await spltoken.getAssociatedTokenAddress(this.address, address, true);
        let account = await spltoken.getAccount(this.connection, userTokenAddress, commitment);
        return account.amount;
    }
    async totalSupply() {
        return (await spltoken.getMint(this.connection, this.address, 'finalized')).supply;
    }
    getDecimals() {
        return this.decimals;
    }
}
exports.Token = Token;
