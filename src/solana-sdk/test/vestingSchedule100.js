"use strict";
/*import chai, { expect, use } from 'chai';
import * as anchor from '@project-serum/anchor';
import * as helpers from '../src/utils/helpers';
import { TxSignerAndSender } from '../src/utils/signAndSendTx';
import { FixedSwapContract } from '../src/models/FixedSwap'
import { delay } from '../src/utils/helpers';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

var connection: anchor.web3.Connection;
    const walletKeypair = anchor.web3.Keypair.fromSecretKey(
        Buffer.from(
            [143,51,109,99,65,73,103,5,85,69,235,222,184,190,78,125,163,82,122,76,52,38,76,2,190,50,95,93,2,94,59,158,172,88,229,183,191,132,173,44,215,96,65,85,214,59,64,185,16,176,98,181,7,124,246,86,207,174,53,16,202,172,174,217]
        )
    );
var DeployerWallet = new anchor.Wallet(walletKeypair);
context('SOL Contract', async () => {

    //consts
    const tokenPurchaseAmount: anchor.BN = new anchor.BN(1);
    const tokenFundAmount: anchor.BN = new anchor.BN(3);
    const tradeValue: anchor.BN = new anchor.BN(1);
    let startDate: Date;
    let endDate: Date;
    var fixedSwapContract: FixedSwapContract;
    let expectedAddress: anchor.web3.PublicKey;
    let id: number;
    let token: anchor.web3.PublicKey;
    before( async ()=>{
        connection = new anchor.web3.Connection(
        'http://127.0.0.1:8899',
            {
                commitment: 'finalized'
            }
        );
        anchor.setProvider(new anchor.AnchorProvider(connection,DeployerWallet,{commitment: 'finalized'}))
        //deploy tokens
        token = await helpers.createToken(connection, DeployerWallet.payer);
        let deployerTokenAccount = await helpers.createAccount(connection, DeployerWallet.payer, token, DeployerWallet.payer.publicKey);
        await helpers.mintTokens(connection, DeployerWallet.payer, token, deployerTokenAccount, DeployerWallet.payer, new anchor.BN(1000000000000));
        startDate = new Date(Date.now()+1*60*1000);
        endDate = new Date(Date.now()+3*60*1000);
        let deployInstruction
        [deployInstruction, expectedAddress, id] = await FixedSwapContract.deploy(
            connection,
            DeployerWallet.payer.publicKey,
            tradeValue,
            tokenFundAmount,
            startDate,
            endDate,
            new anchor.BN(0),
            tokenFundAmount,
            false,
            undefined,
            undefined,
            false,
            ()=>{},
            token,
            anchor.web3.PublicKey.default,
            false,
            [],
            undefined,
            undefined,
            new anchor.BN(60)
        )
        let signer = new TxSignerAndSender(connection, DeployerWallet.payer);
        let tx = new anchor.web3.Transaction();
        tx.add(deployInstruction);
        let txsig = await signer.signAndSendTx(tx);
        await connection.confirmTransaction(txsig, 'finalized');
    })

    it('should get a Fixed Swap Contract From contractAddress', async () => {
        fixedSwapContract = await FixedSwapContract.fromAddress(connection, expectedAddress, id, DeployerWallet.payer, 'finalized');
        expect(fixedSwapContract.token.address.toBase58()).to.equal(token.toBase58());
    });

    it('should fund a Swap Contract and confirm balances', async () => {
        let res: any = await fixedSwapContract.hasStarted();
        expect(res).to.equal(false);
        res = await fixedSwapContract.fund(tokenFundAmount);
        let tx = await connection.confirmTransaction(res, 'finalized');
        expect(tx.value.err).to.be.null;
    });

    it('GET - isSaleOpen - before Start', async () => {
        let res = await fixedSwapContract.isOpen();
        expect(res).to.equal(true);
    });

    it('should do a non atomic swap on the Contract', async () => {
        let res = await fixedSwapContract.swap(tokenPurchaseAmount);
        expect(res).to.not.equal(false);
    });

    it('GET - Purchases', async () => {
        let purchases = await fixedSwapContract.getPurchaseIds();
        expect(purchases.length).to.equal(1);
    });


    it('GET - My Purchases', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        expect(purchases.length).to.equal(1);
    });

    it('GET - Fixed Swap is Closed', async () => {
        await delay(2*60*1000);
        let res = await fixedSwapContract.hasFinalized();
        expect(res).to.equal(true);
        res = await fixedSwapContract.isOpen();
        expect(res).to.equal(false);
    });

    it('GET - Purchase ID', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        expect(purchase.amount.eq(tokenPurchaseAmount)).to.be.true;
        expect(purchase.purchaser.toBase58()).to.equal(DeployerWallet.payer.publicKey.toBase58());
        expect(purchase.wasFinalized).to.equal(false);
        expect(purchase.reverted).to.equal(false);
        expect(purchase.amountToRedeemNow.isZero()).to.be.true;
    });

    it('Should Redeem Tokens', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        let redeemTokens = await fixedSwapContract.redeemTokens(0, DeployerWallet.payer.publicKey);
        let tx = await connection.confirmTransaction(redeemTokens, 'finalized');
        expect(tx.value.err).to.be.null;
    });

    it('GET - Distribution Info', async () => {
        let info = await fixedSwapContract.getDistributionInformation();
        expect(info.vestingTime).to.eq(1);
        expect(info.vestingSchedule[0].eqn(100)).to.be.true;
    });

    it('GET - Purchase ID After Redeem', async () => {
        let purchases = await fixedSwapContract.getAddressPurchaseIds(DeployerWallet.payer.publicKey);
        let purchase = await fixedSwapContract.getPurchase(purchases[0]);
        expect(purchase.amount.eq(tokenPurchaseAmount)).to.be.true;
        expect(purchase.purchaser.toBase58()).to.equal(DeployerWallet.payer.publicKey.toBase58());
        expect(purchase.wasFinalized).to.equal(false);
        expect(purchase.reverted).to.equal(false);
        expect(purchase.amountToRedeemNow.isZero()).to.be.true;
    });
});*/ 
