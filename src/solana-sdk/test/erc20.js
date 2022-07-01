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
const chai_1 = require("chai");
const anchor = __importStar(require("@project-serum/anchor"));
const helpers = __importStar(require("../src/utils/helpers"));
const signAndSendTx_1 = require("../src/utils/signAndSendTx");
const FixedSwap_1 = require("../src/models/FixedSwap");
const helpers_1 = require("../src/utils/helpers");
const consts_1 = require("../src/utils/consts");
context('ERC-20 Contract', async () => {
    var connection;
    var DeployerWallet = new anchor.Wallet(consts_1.DeployerKeypair);
    const tokenPurchaseAmount = 1;
    const tokenFundAmount = 3;
    const tradeValue = 1;
    var fixedSwapContract;
    before(async () => {
        connection = new anchor.web3.Connection('http://127.0.0.1:8899', {
            commitment: 'finalized'
        });
        anchor.setProvider(new anchor.AnchorProvider(connection, DeployerWallet, { commitment: 'finalized' }));
        //deploy tokens
        let token = await helpers.createToken(connection, DeployerWallet.payer);
        let inToken = await helpers.createToken(connection, DeployerWallet.payer, 10);
        let deployerTokenAccount = await helpers.createAccount(connection, DeployerWallet.payer, token, DeployerWallet.payer.publicKey);
        let deployerInTokenAccount = await helpers.createAccount(connection, DeployerWallet.payer, inToken, DeployerWallet.payer.publicKey);
        await helpers.mintTokens(connection, DeployerWallet.payer, token, deployerTokenAccount, DeployerWallet.payer, new anchor.BN(1000000000000));
        await helpers.mintTokens(connection, DeployerWallet.payer, inToken, deployerInTokenAccount, DeployerWallet.payer, new anchor.BN(1000000000000));
        let [deployInstruction, expectedAddress, id] = await FixedSwap_1.FixedSwapContract.deploy(connection, DeployerWallet.payer.publicKey, tradeValue, tokenFundAmount, Date.now() + 1 * 60 * 1000, Date.now() + 3 * 60 * 1000, 0, tokenFundAmount, true, undefined, undefined, false, () => { }, token, inToken, false, [100], undefined, undefined, undefined);
        let signer = new signAndSendTx_1.TxSignerAndSender(connection, DeployerWallet.payer);
        let tx = new anchor.web3.Transaction();
        tx.add(deployInstruction);
        let txsig = await signer.signAndSendTx(tx);
        await connection.confirmTransaction(txsig, 'finalized');
        console.log("expectedAddress", expectedAddress);
        fixedSwapContract = await FixedSwap_1.FixedSwapContract.fromAddress(connection, expectedAddress, id, undefined, DeployerWallet.payer, 'finalized');
    });
    it('GET - isPreFunded', async () => {
        let res = await fixedSwapContract.isPreStart();
        (0, chai_1.expect)(res).to.equal(true);
    });
    it('GET - tokensAllocated', async () => {
        let tokens = await fixedSwapContract.tokensAllocated();
        (0, chai_1.expect)(tokens).to.equal(0);
    });
    it('GET - tradeValue', async () => {
        let td = await fixedSwapContract.tradeValue();
        (0, chai_1.expect)(td).to.equal(tradeValue);
    });
    it('GET - tokensAvailable', async () => {
        let tokens = await fixedSwapContract.tokensAvailable();
        (0, chai_1.expect)(tokens).to.equal(0);
    });
    it('GET - owner', async () => {
        let res = await fixedSwapContract.owner();
        (0, chai_1.expect)(res.toBase58()).to.equal(DeployerWallet.payer.publicKey.toBase58());
    });
    it('GET - tokensForSale', async () => {
        let tokens = await fixedSwapContract.tokensForSale();
        (0, chai_1.expect)(tokens).to.equal(tokenFundAmount);
    });
    let tokensLeft;
    it('GET - tokensLeft', async () => {
        let tokens = await fixedSwapContract.tokensLeft();
        tokensLeft = tokens;
        (0, chai_1.expect)(tokens).to.equal(tokenFundAmount);
    });
    it('should fund a Swap Contract and confirm balances', async () => {
        /* Fund */
        let res = await fixedSwapContract.hasStarted();
        (0, chai_1.expect)(res).to.equal(false);
        res = await fixedSwapContract.fund(tokenFundAmount);
        await connection.confirmTransaction(res, 'finalized');
        await fixedSwapContract._updateIdo();
        (0, chai_1.expect)(res).to.not.equal(false);
    });
    it('GET - tokensAvailable', async () => {
        let tokens = await fixedSwapContract.tokensAvailable();
        (0, chai_1.expect)(tokens).to.equal(tokenFundAmount);
    });
    let isFunded;
    it('GET - isFunded', async () => {
        let res = await fixedSwapContract.isFunded();
        isFunded = res;
        (0, chai_1.expect)(res).to.equal(true);
    });
    let isSaleOpen;
    it('GET - isSaleOpen - before Start', async () => {
        await (0, helpers_1.delay)(1 * 60 * 1000);
        let res = await fixedSwapContract.isOpen();
        isSaleOpen = res;
        (0, chai_1.expect)(res).to.equal(true);
    });
    it('should do a non atomic swap on the Contract', async () => {
        await (0, helpers_1.delay)(15 * 1000);
        let res = await fixedSwapContract.swap(tokenPurchaseAmount);
        await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(res).to.not.equal(false);
    });
    it('GET - Purchases', async () => {
        let purchases = await fixedSwapContract.getPurchaseIds();
        (0, chai_1.expect)(purchases.length).to.equal(1);
    });
    it('GET - My Purchases', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        (0, chai_1.expect)(purchases.length).to.equal(1);
    });
    it('GET - Purchase ID', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        (0, chai_1.expect)(purchase.amount).to.equal(tokenPurchaseAmount);
        (0, chai_1.expect)(purchase.purchaser.toBase58()).to.equal(DeployerWallet.payer.publicKey.toBase58());
        (0, chai_1.expect)(purchase.wasFinalized).to.equal(true);
        (0, chai_1.expect)(purchase.reverted).to.equal(false);
    });
    let tokensAvailable;
    it('GET - tokensAvailable after Swap', async () => {
        let tokens = await fixedSwapContract.tokensAvailable();
        tokensAvailable = tokenFundAmount - tokenPurchaseAmount;
        (0, chai_1.expect)(tokens).to.equal(tokensAvailable);
    });
    it('GET - Buyers', async () => {
        let buyers = await fixedSwapContract.getBuyers();
        (0, chai_1.expect)(buyers.length).to.equal(1);
    });
    it('GET - Fixed Swap is Closed', async () => {
        await (0, helpers_1.delay)(3 * 60 * 1000);
        let res = await fixedSwapContract.hasFinalized();
        (0, chai_1.expect)(res).to.equal(true);
        res = await fixedSwapContract.isOpen();
        (0, chai_1.expect)(res).to.equal(false);
    });
    it('GET - tokensAvailable after closed', async () => {
        let res = await fixedSwapContract.tokensAvailable();
        (0, chai_1.expect)(res).to.equal(tokensAvailable);
    });
    it('Remove Tokens From Purchases - Admin', async () => {
        let res = await fixedSwapContract.withdrawFunds();
        await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(res).to.not.equal(false);
    });
    it('Remove Unsold Tokens - Admin', async () => {
        let res = await fixedSwapContract.withdrawUnsoldTokens();
        await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(res).to.not.equal(false);
    });
});
