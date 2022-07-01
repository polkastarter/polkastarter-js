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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const anchor = __importStar(require("@project-serum/anchor"));
const helpers = __importStar(require("../src/utils/helpers"));
const signAndSendTx_1 = require("../src/utils/signAndSendTx");
const FixedSwap_1 = require("../src/models/FixedSwap");
const helpers_1 = require("../src/utils/helpers");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
var connection;
const walletKeypair = anchor.web3.Keypair.fromSecretKey(Buffer.from([143, 51, 109, 99, 65, 73, 103, 5, 85, 69, 235, 222, 184, 190, 78, 125, 163, 82, 122, 76, 52, 38, 76, 2, 190, 50, 95, 93, 2, 94, 59, 158, 172, 88, 229, 183, 191, 132, 173, 44, 215, 96, 65, 85, 214, 59, 64, 185, 16, 176, 98, 181, 7, 124, 246, 86, 207, 174, 53, 16, 202, 172, 174, 217]));
var DeployerWallet = new anchor.Wallet(walletKeypair);
context('Vesting schedule 20-80', async () => {
    //consts
    const tokenPurchaseAmount = 1;
    const tokenFundAmount = 3;
    const tradeValue = 1;
    let startDate;
    let endDate;
    var fixedSwapContract;
    let expectedAddress;
    let id;
    let token;
    before(async () => {
        connection = new anchor.web3.Connection('http://127.0.0.1:8899', {
            commitment: 'finalized'
        });
        anchor.setProvider(new anchor.AnchorProvider(connection, DeployerWallet, { commitment: 'finalized' }));
        //deploy tokens
        token = await helpers.createToken(connection, DeployerWallet.payer);
        let deployerTokenAccount = await helpers.createAccount(connection, DeployerWallet.payer, token, DeployerWallet.payer.publicKey);
        await helpers.mintTokens(connection, DeployerWallet.payer, token, deployerTokenAccount, DeployerWallet.payer, new anchor.BN(1000000000000));
        startDate = new Date(Date.now() + 1 * 60 * 1000);
        endDate = new Date(Date.now() + 3 * 60 * 1000);
        let deployInstruction;
        [deployInstruction, expectedAddress, id] = await FixedSwap_1.FixedSwapContract.deploy(connection, DeployerWallet.payer.publicKey, tradeValue, tokenFundAmount, startDate, endDate, 0, tokenFundAmount, false, undefined, undefined, false, () => { }, token, anchor.web3.PublicKey.default, false, [20, 80], undefined, undefined, new anchor.BN(60));
        let signer = new signAndSendTx_1.TxSignerAndSender(connection, DeployerWallet.payer);
        let tx = new anchor.web3.Transaction();
        tx.add(deployInstruction);
        let txsig = await signer.signAndSendTx(tx);
        await connection.confirmTransaction(txsig, 'finalized');
    });
    it('should get a Fixed Swap Contract From contractAddress', async () => {
        fixedSwapContract = await FixedSwap_1.FixedSwapContract.fromAddress(connection, expectedAddress, id, undefined, DeployerWallet.payer, 'finalized');
        (0, chai_1.expect)(fixedSwapContract.token.address.toBase58()).to.equal(token.toBase58());
    });
    it('should fund a Swap Contract and confirm balances', async () => {
        /* Fund */
        let res = await fixedSwapContract.hasStarted();
        (0, chai_1.expect)(res).to.equal(false);
        res = await fixedSwapContract.fund(tokenFundAmount);
        let tx = await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(tx.value.err).to.be.null;
    });
    it('should do a non atomic swap on the Contract', async () => {
        await (0, helpers_1.delay)(1 * 60 * 1000);
        let res = await fixedSwapContract.swap(tokenPurchaseAmount);
        let tx = await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(tx.value.err).to.be.null;
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
        (0, chai_1.expect)(purchase.wasFinalized).to.equal(false);
        (0, chai_1.expect)(purchase.reverted).to.equal(false);
        (0, chai_1.expect)(purchase.amountToRedeemNow.isZero()).to.be.true;
    });
    it('GET - Fixed Swap is Closed', async () => {
        await (0, helpers_1.delay)(2 * 60 * 1000);
        let res = await fixedSwapContract.hasFinalized();
        (0, chai_1.expect)(res).to.equal(true);
        res = await fixedSwapContract.isOpen();
        (0, chai_1.expect)(res).to.equal(false);
    });
    it('Should Redeem Tokens - First time', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        let redeemTokens = await fixedSwapContract.redeemTokens(0, DeployerWallet.payer.publicKey);
        let tx = await connection.confirmTransaction(redeemTokens, 'finalized');
        (0, chai_1.expect)(tx.value.err).to.be.null;
    });
    it('GET - Distribution Info', async () => {
        let info = await fixedSwapContract.getDistributionInformation();
        (0, chai_1.expect)(info.vestingTime).to.eq(2);
        (0, chai_1.expect)(info.vestingSchedule[0]).to.equal(20);
    });
    it('Shouldnt Redeem Tokens - Second time', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        (0, chai_1.expect)(fixedSwapContract.redeemTokens(0, DeployerWallet.payer.publicKey)).to.be.rejected;
    });
    it('GET - Purchase ID After Redeem', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        (0, chai_1.expect)(purchase.amount).to.equal(tokenPurchaseAmount);
        (0, chai_1.expect)(purchase.purchaser.toBase58()).to.equal(DeployerWallet.payer.publicKey.toBase58());
        (0, chai_1.expect)(purchase.wasFinalized).to.equal(false);
        (0, chai_1.expect)(purchase.reverted).to.equal(false);
        (0, chai_1.expect)(purchase.amountToRedeemNow.isZero()).to.be.true;
    });
    it('Should Redeem Tokens - Third time (second period)', async () => {
        await (0, helpers_1.delay)(1 * 60 * 1000);
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        let redeemTokens = await fixedSwapContract.redeemTokens(0, DeployerWallet.payer.publicKey);
        let tx = await connection.confirmTransaction(redeemTokens, 'finalized');
        (0, chai_1.expect)(tx.value.err).to.be.null;
    });
    it('GET - Purchase ID After second Redeem', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        (0, chai_1.expect)(purchase.amount).to.equal(tokenPurchaseAmount);
        (0, chai_1.expect)(purchase.amountLeftToRedeem).to.equal(0);
        (0, chai_1.expect)(purchase.purchaser.toBase58()).to.equal(DeployerWallet.payer.publicKey.toBase58());
        (0, chai_1.expect)(purchase.wasFinalized).to.equal(true);
        (0, chai_1.expect)(purchase.reverted).to.equal(false);
        (0, chai_1.expect)(purchase.amountToRedeemNow.isZero()).to.be.true;
    });
});
