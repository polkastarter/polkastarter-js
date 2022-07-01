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
exports.FixedSwapContract = void 0;
const spltoken = __importStar(require("@solana/spl-token"));
const anchor = __importStar(require("@project-serum/anchor"));
const helpers_1 = require("../utils/helpers");
const signAndSendTx_1 = require("../utils/signAndSendTx");
const IDO_1 = require("./IDO");
const Token_1 = require("./Token");
const polkastarter_json_1 = __importDefault(require("../interfaces/polkastarter.json"));
const consts_1 = require("../utils/consts");
const StakingRewards_1 = require("./StakingRewards");
class FixedSwapContract {
    constructor(connection, ido, tradeIn, token, user, commitment) {
        this.ido = ido;
        this.token = token;
        this.tradeInToken = tradeIn;
        this.connection = connection;
        this.commitment = commitment;
        this.txSignerAndSender = new signAndSendTx_1.TxSignerAndSender(connection, user, {
            maxRetries: 10, preflightCommitment: 'finalized', skipPreflight: false
        });
        if (user && 'publicKey' in user) {
            this.userAddr = user.publicKey;
        }
        else {
            //to be used in web environment (there is probably a better way to do it)
            this.userAddr = user;
        }
    }
    static async fromAddress(connection, address, id, provider, user, commitment) {
        let program = new anchor.Program(polkastarter_json_1.default, consts_1.programAddress, provider);
        const ido = await IDO_1.IDO.fromStateAddress(program, address, id);
        let token = await Token_1.Token.fromAddress(connection, ido.tokenAddress, user, commitment);
        let tradeInToken;
        if (ido.tradeInAddress) {
            tradeInToken = await Token_1.Token.fromAddress(connection, ido.tradeInAddress, user, commitment);
        }
        return new FixedSwapContract(connection, ido, tradeInToken, token, user);
    }
    static async deploy(connection, address, tradeValue, tokensForSale, startDate, endDate, individualMinimumAmount = 0, individualMaximumAmount = 0, isTokenSwapAtomic = false, minimumRaise = 0, feeAmount = 1, hasWhitelisting = false, callback, tokenAddress, ERC20TradingAddress, isPOLSWhitelist = false, vestingSchedule = [], vestingStart, vestingCliff = new anchor.BN(0), vestingDuration = new anchor.BN(0), provider, feeAddress) {
        vestingStart = vestingStart ? vestingStart : (0, helpers_1.timeToSmartContractTime)(endDate);
        let program = new anchor.Program(polkastarter_json_1.default, consts_1.programAddress, provider);
        let idosWithToken = await program.account.ido.all([
            {
                memcmp: {
                    offset: 40,
                    bytes: tokenAddress.toBase58(),
                }
            }
        ]);
        let [expectedStateAddress, _] = await anchor.web3.PublicKey.findProgramAddress([consts_1.NAMESPACES.IDO, tokenAddress.toBuffer(), Buffer.from([idosWithToken.length])], program.programId);
        let tokenMint = await spltoken.getMint(connection, tokenAddress);
        let tokensForSaleBN = (0, helpers_1.toSmartContractDecimals)(tokensForSale, tokenMint.decimals);
        let individualMinimumAmountBN = (0, helpers_1.toSmartContractDecimals)(individualMinimumAmount, tokenMint.decimals);
        let individualMaximumAmountBN = (0, helpers_1.toSmartContractDecimals)(individualMaximumAmount, tokenMint.decimals);
        let minimumRaiseBN = (0, helpers_1.toSmartContractDecimals)(minimumRaise, tokenMint.decimals);
        let inTokenMint, tradeValueBN;
        if (ERC20TradingAddress != anchor.web3.PublicKey.default) {
            inTokenMint = await spltoken.getMint(connection, ERC20TradingAddress);
            tradeValueBN = (0, helpers_1.toSmartContractDecimals)(tradeValue, inTokenMint.decimals);
        }
        else {
            tradeValueBN = (0, helpers_1.toSmartContractDecimals)(tradeValue, 9); //decimals of sol native token
        }
        let vestingScheduleBN = vestingSchedule.map((v) => (0, helpers_1.toSmartContractDecimals)(v, 12));
        return [await IDO_1.IDO.create(program, address, idosWithToken.length, tokenAddress, tradeValueBN, tokensForSaleBN, (0, helpers_1.timeToSmartContractTime)(startDate), (0, helpers_1.timeToSmartContractTime)(endDate), individualMinimumAmountBN, individualMaximumAmountBN, minimumRaiseBN, feeAmount, (isTokenSwapAtomic ? consts_1.FLAGS.IS_TOKEN_SWAP_ATOMIC : 0) | (hasWhitelisting ? consts_1.FLAGS.HAS_WHITELISTING : 0) | (isPOLSWhitelist ? consts_1.FLAGS.IS_POLS_WHITELISTED : 0), ERC20TradingAddress, vestingStart, vestingCliff, vestingDuration, vestingScheduleBN, feeAddress), expectedStateAddress, idosWithToken.length];
    }
    async _updateIdo() {
        await this.ido.updateIdoStruct();
    }
    async addToBlacklist(address) {
        const instruction = await this.ido.addToBlacklist(address);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async removeFromBlacklist(address) {
        const instruction = await this.ido.removeFromBlacklist(address);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    isBlacklisted(user) {
        return this.ido.isBlacklisted(user, this.commitment);
    }
    owner() {
        return this.ido.admin;
    }
    isPaused() {
        return this.ido.paused;
    }
    async pauseContract() {
        const instruction = await this.ido.pauseContract();
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    //should i rename it?
    erc20() {
        return this.token;
    }
    async unpauseContract() {
        const instruction = await this.ido.unpauseContract();
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    swapRatio() {
        return 1 / this.tradeValue();
    }
    tradeValue() {
        return (0, helpers_1.fromDecimals)(this.ido.tradeValue, this.getTradingDecimals());
    }
    vestingStart() {
        return (0, helpers_1.smartContractTimeToDate)(this.ido.vestingStart);
    }
    startDate() {
        return (0, helpers_1.smartContractTimeToDate)(this.ido.startDate);
    }
    endDate() {
        return (0, helpers_1.smartContractTimeToDate)(this.ido.endDate);
    }
    individualMinimumAmount() {
        return (0, helpers_1.fromDecimals)(this.ido.individualMinimumAmount, this.getDecimals());
    }
    individualMaximumAmount() {
        return (0, helpers_1.fromDecimals)(this.ido.individualMaximumAmount, this.getDecimals());
    }
    minimumRaise() {
        return (0, helpers_1.fromDecimals)(this.ido.minimumRaise, this.getDecimals());
    }
    tokensAllocated() {
        return (0, helpers_1.fromDecimals)(this.ido.tokensAllocated, this.getDecimals());
    }
    tokensForSale() {
        return (0, helpers_1.fromDecimals)(this.ido.tokensForSale, this.getDecimals());
    }
    hasMinimumRaise() {
        return !this.ido.minimumRaise.isZero();
    }
    minimumReached() {
        if (this.hasMinimumRaise()) {
            let tokensAllocated = this.tokensAllocated();
            let minimumRaise = this.minimumRaise();
            return tokensAllocated > minimumRaise;
        }
        else {
            return true;
        }
    }
    async tokensAvailable() {
        return (0, helpers_1.fromDecimals)(await this.ido.tokensAvaliable(this.connection, this.commitment), this.getDecimals());
    }
    tokensLeft() {
        return (0, helpers_1.fromDecimals)(this.ido.tokensForSale.sub(this.ido.tokensAllocated), this.getDecimals());
    }
    async setSignerPublicAddress(address) {
        if (address.startsWith('0x') && address.length == 42)
            address = address.slice(2);
        else if (address.length != 40) {
            throw Error('Invalid address');
        }
        let addr = [];
        for (let i = 0; i < address.length; i += 2) {
            addr.push(Number.parseInt(address[i] + address[i + 1], 16));
        }
        const instruction = await this.ido.setSignerPublicAddress(addr);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    signerPublicAddress() {
        return this.ido.signerPublicAddress;
    }
    async withdrawableUnsoldTokens() {
        let res = 0;
        if (await this.hasFinalized() &&
            !(this.wereUnsoldTokensReedemed())) {
            if (this.minimumReached()) {
                res = this.tokensForSale() - this.tokensAllocated();
            }
            else {
                res = this.tokensForSale();
            }
        }
        return res;
    }
    async withdrawableFunds() {
        let hasFinalized = await this.hasFinalized();
        let wasMinimumRaiseReached = await this.minimumReached();
        if (hasFinalized && wasMinimumRaiseReached)
            return await this.getBalance();
        else
            return BigInt(0);
    }
    isTokenSwapAtomic() {
        return this.ido.isTokenSwapAtomic;
    }
    hasWhitelisting() {
        return this.ido.hasWhitelisting;
    }
    isWhitelisted(user) {
        return this.ido.isWhitelisted(user, this.commitment);
    }
    wereUnsoldTokensReedemed() {
        return this.ido.unsoldTokensRedeemed;
    }
    isFunded() {
        return this.ido.isFunded;
    }
    async isOpen() {
        return (await this.hasStarted()) && !(await this.hasFinalized());
    }
    async hasStarted() {
        let blockHeight = await this.connection.getBlockHeight(this.commitment);
        let blockTime = await this.connection.getBlockTime(blockHeight);
        if (blockTime)
            return this.ido.startDate.lte(new anchor.BN(blockTime));
        else
            throw Error("getBlockTime failed");
    }
    async hasFinalized() {
        let blockHeight = await this.connection.getBlockHeight(this.commitment);
        let blockTime = await this.connection.getBlockTime(blockHeight);
        if (blockTime)
            return this.ido.endDate.lt(new anchor.BN(blockTime));
        else
            throw Error("getBlockTime failed");
    }
    //should i rename it?
    isETHtrade() {
        return this.ido.tradeInAddress ? false : true;
    }
    getTradingDecimals() {
        if (this.isETHtrade())
            return 9;
        else
            return this.tradeInToken.decimals;
    }
    getTradingERC20Address() {
        if (this.isETHtrade()) {
            return anchor.web3.PublicKey.default;
        }
        else
            return this.tradeInToken.address;
    }
    async isPreStart() {
        let blockHeight = await this.connection.getBlockHeight(this.commitment);
        let blockTime = await this.connection.getBlockTime(blockHeight);
        if (blockTime)
            return this.ido.startDate.gte(new anchor.BN(blockTime));
        else
            throw Error("getBlockTime failed");
    }
    async getCurrentSchedule() {
        let blockHeight = await this.connection.getBlockHeight(this.commitment);
        let blockTime = await this.connection.getBlockTime(blockHeight);
        if (blockTime) {
            if (this.ido.vestingStart.gte(new anchor.BN(blockTime)))
                return 0;
            if (this.ido.vestingDuration.eq(new anchor.BN(0)))
                return 1;
            return (blockTime - this.ido.vestingStart.toNumber()) / this.ido.vestingDuration.toNumber() + 1;
        }
        else
            throw Error("getBlockTime failed");
    }
    getVestingSchedule(position) {
        return this.ido.vestingSchedule[position];
    }
    async getPurchase(purchase) {
        let purchaseInfo = await this.ido.getPurchase(purchase, this.commitment);
        let amount = (0, helpers_1.fromDecimals)(purchaseInfo.amount, this.getDecimals());
        let costAmount = (0, helpers_1.fromDecimals)(purchaseInfo.costAmount, this.getTradingDecimals());
        let amountRedeemed = (0, helpers_1.fromDecimals)(purchaseInfo.amountRedeemed, this.getDecimals());
        let amountLeftToRedeem = (0, helpers_1.fromDecimals)(purchaseInfo.amount.sub(purchaseInfo.amountRedeemed), this.getDecimals());
        let hasFinalized = await this.hasFinalized();
        let blockHeight = await this.connection.getBlockHeight(this.commitment);
        let blockTime = await this.connection.getBlockTime(blockHeight);
        if (!blockTime) {
            throw Error("getBlockTime failed");
        }
        let amountToRedeemNow = new anchor.BN(0);
        if (hasFinalized &&
            purchaseInfo.amountRedeemed.lt(purchaseInfo.amount) &&
            (new anchor.BN(blockTime)).gte(this.ido.vestingStart) &&
            (new anchor.BN(blockTime)).gte(this.ido.vestingStart.add(this.ido.vestingCliff))) {
            if (this.ido.vestingSchedule.length == 0) {
                if (this.ido.vestingStart.add(this.ido.vestingDuration).lten(blockTime)) {
                    amountToRedeemNow = purchaseInfo.amount.sub(purchaseInfo.amountRedeemed);
                }
                else {
                    amountToRedeemNow = purchaseInfo.amount.mul((new anchor.BN(blockTime)).sub(this.ido.vestingStart)).div(this.ido.vestingDuration).sub(purchaseInfo.amountRedeemed);
                }
            }
            else {
                let currentSchedule = (new anchor.BN(blockTime)).sub(this.ido.vestingStart).div(this.ido.vestingDuration);
                if (currentSchedule.gten(this.ido.vestingSchedule.length)) {
                    amountToRedeemNow = purchaseInfo.amount.sub(purchaseInfo.amountRedeemed);
                }
                else {
                    let currentEligibleAmount = purchaseInfo.amount.mul(this.getVestingSchedule(currentSchedule.toNumber())).div((new anchor.BN(10)).pow(new anchor.BN(14)));
                    if (currentEligibleAmount.lt(purchaseInfo.amountRedeemed))
                        throw Error("INTERNAL ERROR in vesting amount calculation");
                    amountToRedeemNow = currentEligibleAmount.sub(purchaseInfo.amountRedeemed);
                }
            }
        }
        return {
            _id: purchase,
            amount: amount,
            purchaser: purchaseInfo.purchaser,
            costAmount: costAmount,
            timestamp: (0, helpers_1.smartContractTimeToDate)(purchaseInfo.timestamp),
            amountRedeemed: amountRedeemed,
            amountLeftToRedeem: amountLeftToRedeem,
            amountToRedeemNow: amountToRedeemNow,
            wasFinalized: purchaseInfo.wasFinalized,
            reverted: purchaseInfo.reverted,
        };
    }
    getWhitelistedAddresses() {
        return this.ido.getWhitelistedAddresses();
    }
    getBuyers() {
        return this.ido.getBuyers();
    }
    getPurchaseIds() {
        return this.ido.getPurchasesIds();
    }
    getAddressPurchaseIds(address) {
        return this.ido.getAddressPurchaseIds(address);
    }
    getCostFromTokens(amount) {
        return amount * this.tradeValue();
        /*
        let amountWithDecimals = toSmartContractDecimals(amount, this.getDecimals());
        return amountWithDecimals.muln(this.tradeValue()).div(new anchor.BN(10**this.token.decimals));
        */
    }
    async getDistributionInformation() {
        let currentSchedule = 0;
        if (await this.hasStarted()) {
            currentSchedule = await this.getCurrentSchedule();
        }
        let vestingTime = this.ido.vestingSchedule.length ? this.ido.vestingSchedule.length + 1 : 0;
        let vestingSchedule = this.ido.vestingSchedule.map((v) => (0, helpers_1.fromDecimals)(v, 12));
        let vestingStart = this.vestingStart();
        return {
            currentSchedule,
            vestingTime,
            vestingSchedule,
            vestingStart
        };
    }
    async swapWithSig(tokenAmount, callback, signature, accountMaxAmount) {
        let amountWithDecimals = (0, helpers_1.toSmartContractDecimals)(tokenAmount, await this.getDecimals());
        let userPurchaseIndex = await this.ido.getTotalPurchases(this.userAddr);
        let instruction = await this.ido.swapWithSig(this.userAddr, amountWithDecimals, accountMaxAmount, signature, userPurchaseIndex);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async swap(tokenAmount, callback, signature) {
        let amountWithDecimals = (0, helpers_1.toSmartContractDecimals)(tokenAmount, await this.getDecimals());
        let cost = await this.getCostFromTokens(tokenAmount);
        let costToDecimals = (0, helpers_1.toSmartContractDecimals)(cost, await this.getTradingDecimals());
        let userPurchaseIndex = await this.ido.getTotalPurchases(this.userAddr);
        let instruction = await this.ido.swap(this.userAddr, amountWithDecimals, signature, userPurchaseIndex);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async redeemTokens(purchaseIndex, purchaser) {
        const instruction = await this.ido.redeemTokens(purchaseIndex, purchaser);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async redeemGivenMinimumGoalNotAchieved(purchaseIndex) {
        let instruction;
        if (this.isETHtrade()) {
            instruction = await this.ido.solRedeemGivenMinimumGoalNotAchieved(purchaseIndex, this.userAddr);
        }
        else {
            instruction = await this.ido.redeemGivenMinimumGoalNotAchieved(purchaseIndex, this.userAddr);
        }
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async withdrawUnsoldTokens() {
        const instruction = await this.ido.withdrawUnsoldTokens();
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async withdrawFunds() {
        let instruction;
        if (this.isETHtrade()) {
            instruction = await this.ido.solWithdrawFunds();
        }
        else {
            instruction = await this.ido.withdrawFunds();
        }
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async setIndividualMaximumAmount(amount) {
        const amountBN = (0, helpers_1.toSmartContractDecimals)(amount, this.getDecimals());
        const instruction = await this.ido.setIndividualMaximumAmount(amountBN);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async setEndDate(endDate) {
        const date = (0, helpers_1.timeToSmartContractTime)(endDate);
        const instruction = await this.ido.setEndDate(date);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async setStartDate(startDate) {
        const date = (0, helpers_1.timeToSmartContractTime)(startDate);
        const instruction = await this.ido.setStartDate(date);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async setHasWhitelisting(hasWhitelisting) {
        const instruction = await this.ido.setHasWhitelisting(hasWhitelisting);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async setVesting(vestingSchedule, vestingStart = this.ido.endDate.toNumber(), vestingCliff, vestingDuration) {
        if (vestingSchedule.length > 0 && vestingSchedule.reduce((a, b) => a + b, 0) != 100) {
            throw new Error("'vestingSchedule' sum has to be equal to 100");
        }
        const DECIMALS_PERCENT_MUL = 10 ** 12;
        const vestingScheduleBigNumber = vestingSchedule.map((num) => (new anchor.BN(num)).muln(DECIMALS_PERCENT_MUL));
        const instruction = await this.ido.setVesting((0, helpers_1.timeToSmartContractTime)(vestingStart), new anchor.BN(vestingCliff), new anchor.BN(vestingDuration), vestingScheduleBigNumber);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async addWhitelistedAddress(address) {
        const instruction = await this.ido.addToWhitelist(address);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async removeWhitelistedAddress(address) {
        const instruction = await this.ido.removeFromWhitelist(address);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    async fund(tokenAmount, callback) {
        const bnTokens = (0, helpers_1.toSmartContractDecimals)(tokenAmount, this.getDecimals());
        const instruction = await this.ido.fund(this.userAddr, bnTokens);
        const transaction = new anchor.web3.Transaction();
        transaction.add(instruction);
        return this.txSignerAndSender.signAndSendTx(transaction);
    }
    getDecimals() {
        return this.token.decimals;
    }
    getAddress() {
        return this.ido.stateAddress;
    }
    getTokenAddress() {
        return this.ido.tokenAddress;
    }
    getTokenContract() {
        return this.token;
    }
    async getBalance() {
        let [idoSaleTokenAccount, _] = await this.ido._getIdoSaleTokenAccount();
        return this.token.getTokenAmount(idoSaleTokenAccount);
    }
    async getIDOStaking() {
        let [stakingAddress, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.ido.stateAddress.toBuffer()], this.ido.program.programId);
        return await StakingRewards_1.StakingRewards.fromStateAddress(this.connection, this.ido.program, stakingAddress, this.ido.stateAddress, this.ido.id, this.commitment);
    }
}
exports.FixedSwapContract = FixedSwapContract;
