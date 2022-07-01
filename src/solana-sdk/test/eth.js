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
var connection;
var DeployerWallet = new anchor.Wallet(consts_1.DeployerKeypair);
context('SOL Contract', async () => {
    //consts
    const tokenPurchaseAmount = 1;
    const tokenFundAmount = 3;
    const tradeValue = 1;
    let startDate;
    let endDate;
    var fixedSwapContract;
    before(async () => {
        connection = new anchor.web3.Connection('http://127.0.0.1:8899', {
            commitment: 'finalized'
        });
        anchor.setProvider(new anchor.AnchorProvider(connection, DeployerWallet, { commitment: 'finalized' }));
        //deploy tokens
        let token = await helpers.createToken(connection, DeployerWallet.payer);
        let deployerTokenAccount = await helpers.createAccount(connection, DeployerWallet.payer, token, DeployerWallet.payer.publicKey);
        await helpers.mintTokens(connection, DeployerWallet.payer, token, deployerTokenAccount, DeployerWallet.payer, new anchor.BN(1000000000000));
        startDate = new Date(Date.now() + 1 * 60 * 1000);
        endDate = new Date(Date.now() + 4 * 60 * 1000);
        let [deployInstruction, expectedAddress, id] = await FixedSwap_1.FixedSwapContract.deploy(connection, DeployerWallet.payer.publicKey, tradeValue, tokenFundAmount, startDate, endDate, 0, tokenFundAmount, false, undefined, undefined, false, () => { }, token, anchor.web3.PublicKey.default, false, [], undefined, undefined, undefined);
        let signer = new signAndSendTx_1.TxSignerAndSender(connection, DeployerWallet.payer);
        let tx = new anchor.web3.Transaction();
        tx.add(deployInstruction);
        let txsig = await signer.signAndSendTx(tx);
        await connection.confirmTransaction(txsig, 'finalized');
        fixedSwapContract = await FixedSwap_1.FixedSwapContract.fromAddress(connection, expectedAddress, id, undefined, DeployerWallet.payer, 'finalized');
    });
    it('GET - isPreFunded', async () => {
        let res = await fixedSwapContract.isPreStart();
        (0, chai_1.expect)(res).to.be.true;
    });
    it('GET - tokensAllocated', async () => {
        let tokens = await fixedSwapContract.tokensAllocated();
        (0, chai_1.expect)(tokens).to.equal(0);
    });
    it('GET - tradeValue', async () => {
        let td = await fixedSwapContract.tradeValue();
        (0, chai_1.expect)(td).to.be.equal(tradeValue);
    });
    it('GET - swapRatio', async () => {
        let sr = await fixedSwapContract.swapRatio();
        (0, chai_1.expect)(sr).to.be.equal(1);
    });
    it('GET - tokensAvailable', async () => {
        let tokens = await fixedSwapContract.tokensAvailable();
        (0, chai_1.expect)(tokens).to.be.equal(0);
    });
    it('GET - tokensForSale', async () => {
        let tokens = await fixedSwapContract.tokensForSale();
        (0, chai_1.expect)(tokens).to.be.equal(tokenFundAmount);
    });
    let tokensLeft;
    it('GET - tokensLeft', async () => {
        let tokens = await fixedSwapContract.tokensLeft();
        tokensLeft = tokens;
        (0, chai_1.expect)(tokens).to.be.equal(tokenFundAmount);
    });
    it('should fund a Swap Contract and confirm balances', async () => {
        /* Fund */
        let res = await fixedSwapContract.hasStarted();
        (0, chai_1.expect)(res).to.not.equal(true);
        res = await fixedSwapContract.fund(tokenFundAmount);
        (0, chai_1.expect)(res).to.not.equal(false);
        await connection.confirmTransaction(res, 'finalized');
        let tokens = await fixedSwapContract.tokensAvailable();
        await fixedSwapContract._updateIdo();
        (0, chai_1.expect)(tokens).to.be.equal(tokenFundAmount);
    });
    let isFunded;
    it('GET - isFunded', async () => {
        let res = await fixedSwapContract.isFunded();
        isFunded = res;
        (0, chai_1.expect)(res).to.be.true;
    });
    it('should edit end Date', async () => {
        let oldEndDate = await fixedSwapContract.endDate();
        const newEndDate = new Date(oldEndDate.getTime() + (60 * 1000 * 1000));
        let txSig = await fixedSwapContract.setEndDate(newEndDate);
        await connection.confirmTransaction(txSig, 'finalized');
        await fixedSwapContract._updateIdo();
        let res = await fixedSwapContract.endDate();
        (0, chai_1.expect)(res.getTime()).to.equal(newEndDate.getTime());
        txSig = await fixedSwapContract.setEndDate(oldEndDate);
        await connection.confirmTransaction(txSig, 'finalized');
        await fixedSwapContract._updateIdo();
        res = await fixedSwapContract.endDate();
        (0, chai_1.expect)(res.getTime()).to.equal(oldEndDate.getTime());
    });
    let isSaleOpen;
    it('GET - isSaleOpen - before Start', async () => {
        await (0, helpers_1.delay)(1 * 60 * 1000);
        let res = await fixedSwapContract.isOpen();
        isSaleOpen = res;
        (0, chai_1.expect)(res).to.be.true;
    });
    it('GET - hasWhitelisting ', async () => {
        let res = await fixedSwapContract.hasWhitelisting();
        (0, chai_1.expect)(res).to.be.false;
    });
    it('GET - startDate ', async () => {
        let res = await fixedSwapContract.startDate();
        (0, chai_1.expect)(res.getTime()).to.be.closeTo(startDate.getTime(), 999);
        (0, chai_1.expect)(res instanceof Date).to.be.true;
    });
    it('GET - endDate ', async () => {
        let res = await fixedSwapContract.endDate();
        (0, chai_1.expect)(res.getTime()).to.be.closeTo(endDate.getTime(), 999);
        (0, chai_1.expect)(res instanceof Date).to.be.true;
    });
    let indiviMinAmount;
    it('GET - individualMinimumAmount ', async () => {
        let res = fixedSwapContract.individualMinimumAmount();
        indiviMinAmount = res;
        (0, chai_1.expect)(res).to.be.equal(0);
    });
    let indivMaxAmount;
    it('GET - individualMaximumAmount ', async () => {
        let res = fixedSwapContract.individualMaximumAmount();
        indivMaxAmount = res;
        (0, chai_1.expect)(res).to.be.equal(tokenFundAmount);
    });
    it('GET - getCostFromTokens ', async () => {
        let res = await fixedSwapContract.getCostFromTokens(tokenPurchaseAmount);
        (0, chai_1.expect)(res).to.be.equal(tokenPurchaseAmount * tradeValue);
    });
    it('check conditions for swap  ', async () => {
        let amount = tokenPurchaseAmount > 0 ? true : false;
        let tokensLeftBool = tokenPurchaseAmount <= (tokensLeft) ? true : false;
        let indiviMinAmountBool = tokenPurchaseAmount >= (indiviMinAmount) ? true : false;
        let indivMaxAmountBool = tokenPurchaseAmount <= (indivMaxAmount) ? true : false;
        (0, chai_1.expect)(isFunded).to.be.true;
        (0, chai_1.expect)(isSaleOpen).to.be.true;
        (0, chai_1.expect)(amount).to.be.true;
        (0, chai_1.expect)(tokensLeftBool).to.be.true;
        (0, chai_1.expect)(indiviMinAmountBool).to.be.true;
        (0, chai_1.expect)(indivMaxAmountBool).to.be.true;
    });
    it('GET - hasStarted', async () => {
        let res = await fixedSwapContract.hasStarted();
        (0, chai_1.expect)(res).to.be.true;
    });
    it('GET - isSaleOpen', async () => {
        let res = await fixedSwapContract.isOpen();
        (0, chai_1.expect)(res).to.be.true;
    });
    it('Edit max allocation - Admin', async () => {
        let newMax = 500;
        let res = await fixedSwapContract.setIndividualMaximumAmount(newMax);
        (0, chai_1.expect)(res).to.not.equal(false);
        await connection.confirmTransaction(res, 'finalized');
        await fixedSwapContract._updateIdo();
        let max = await fixedSwapContract.individualMaximumAmount();
        (0, chai_1.expect)(max).to.be.equal(newMax);
    });
    it('GET - tokensAvailable after fund', async () => {
        let tokens = await fixedSwapContract.tokensAvailable();
        (0, chai_1.expect)(tokens).to.be.equal(tokenFundAmount);
    });
    it('should do a non atomic swap on the Contract', async () => {
        await (0, helpers_1.delay)(5 * 1000);
        let res;
        res = await fixedSwapContract.swapWithSig(tokenPurchaseAmount, () => { }, undefined, new anchor.BN(0));
        await connection.confirmTransaction(res, 'finalized');
        await fixedSwapContract._updateIdo();
        (0, chai_1.expect)(res).to.not.equal(false);
    });
    it('GET - Purchases', async () => {
        let purchases = await fixedSwapContract.getPurchaseIds();
        (0, chai_1.expect)(purchases.length).to.equal(1);
    });
    it('GET - Distribution Information', async () => {
        let info = await fixedSwapContract.getDistributionInformation();
        (0, chai_1.expect)(info.currentSchedule).to.equal(0);
        (0, chai_1.expect)(info.vestingTime).to.equal(0);
        (0, chai_1.expect)(info.vestingSchedule.length).to.equal(0);
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
    it('GET - tokensLeft after Swap', async () => {
        let tokens = await fixedSwapContract.tokensLeft();
        tokensLeft = tokenFundAmount - tokenPurchaseAmount;
        (0, chai_1.expect)(tokens).to.equal(tokensLeft);
    });
    it('GET - Buyers', async () => {
        let buyers = await fixedSwapContract.getBuyers();
        (0, chai_1.expect)(buyers.length).to.equal(1);
    });
    it('GET - Fixed Swap is Closed', async () => {
        await (0, helpers_1.delay)(2 * 60 * 1000);
        let res = await fixedSwapContract.hasFinalized();
        (0, chai_1.expect)(res).to.equal(true);
        res = await fixedSwapContract.isOpen();
        (0, chai_1.expect)(res).to.equal(false);
    });
    it('should return withdrawable unsold amount', async () => {
        const res = await fixedSwapContract.withdrawableUnsoldTokens();
        console.log(res);
    });
    it('Redeem Sale (withdraw tokens)', async () => {
        //let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey); 
        let res = await fixedSwapContract.redeemTokens(0, DeployerWallet.payer.publicKey);
        await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(res).to.not.equal(false);
    });
    it('GET - Purchase ID 2', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        (0, chai_1.expect)(purchase.purchaser.toBase58()).to.equal(DeployerWallet.payer.publicKey.toBase58());
        (0, chai_1.expect)(purchase.wasFinalized).to.equal(true);
        (0, chai_1.expect)(purchase.reverted).to.equal(false);
    });
    it('Remove ETH From Purchases - Admin', async () => {
        let res = await fixedSwapContract.withdrawFunds();
        (0, chai_1.expect)(res).to.not.equal(false);
    });
    it('Remove Unsold Tokens - Admin', async () => {
        let res = await fixedSwapContract.withdrawUnsoldTokens();
        await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(res).to.not.equal(false);
    });
    let userBlackListed;
    it('Add to blacklist - Admin', async () => {
        userBlackListed = anchor.web3.Keypair.generate();
        let res = await fixedSwapContract.addToBlacklist(userBlackListed.publicKey);
        await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(res).to.not.equal(false);
        (0, chai_1.expect)(await fixedSwapContract.isBlacklisted(userBlackListed.publicKey)).to.equal(true);
    });
    it('Remove from blacklist - Admin', async () => {
        let res = await fixedSwapContract.removeFromBlacklist(userBlackListed.publicKey);
        await connection.confirmTransaction(res, 'finalized');
        (0, chai_1.expect)(res).to.not.equal(false);
        (0, chai_1.expect)(await fixedSwapContract.isBlacklisted(userBlackListed.publicKey)).to.equal(false);
    });
});
context('Fixed Swap with Staking rewards', async () => {
    const tokenPurchaseAmount = 1;
    const tokenFundAmount = 3;
    const tradeValue = 1;
    let startDate;
    let endDate;
    var fixedSwapContract;
    before(async () => {
        connection = new anchor.web3.Connection('http://127.0.0.1:8899', {
            commitment: 'finalized'
        });
        anchor.setProvider(new anchor.AnchorProvider(connection, DeployerWallet, { commitment: 'finalized' }));
        //deploy tokens
        let token = await helpers.createToken(connection, DeployerWallet.payer);
        let deployerTokenAccount = await helpers.createAccount(connection, DeployerWallet.payer, token, DeployerWallet.payer.publicKey);
        await helpers.mintTokens(connection, DeployerWallet.payer, token, deployerTokenAccount, DeployerWallet.payer, new anchor.BN(1000000000000));
        startDate = new Date(Date.now() + 1 * 60 * 1000);
        endDate = new Date(Date.now() + 4 * 60 * 1000);
        let [deployInstruction, expectedAddress, id] = await FixedSwap_1.FixedSwapContract.deploy(connection, DeployerWallet.payer.publicKey, tradeValue, tokenFundAmount, startDate, endDate, 0, tokenFundAmount, false, undefined, undefined, false, () => { }, token, anchor.web3.PublicKey.default, false, [], undefined, undefined, undefined);
        let signer = new signAndSendTx_1.TxSignerAndSender(connection, DeployerWallet.payer);
        let tx = new anchor.web3.Transaction();
        tx.add(deployInstruction);
        let txsig = await signer.signAndSendTx(tx);
        await connection.confirmTransaction(txsig, 'finalized');
        fixedSwapContract = await FixedSwap_1.FixedSwapContract.fromAddress(connection, expectedAddress, id, undefined, DeployerWallet.payer, 'finalized');
    });
});
