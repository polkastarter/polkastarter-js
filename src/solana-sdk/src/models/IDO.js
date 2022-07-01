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
exports.IDO = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const spltoken = __importStar(require("@solana/spl-token"));
const helpers_1 = require("../utils/helpers");
const consts_1 = require("../utils/consts");
class IDO {
    constructor(idoStruct, program, stateAddress, id) {
        this.id = id;
        this.program = program;
        this.stateAddress = stateAddress;
        this.admin = idoStruct.admin;
        this.tokenAddress = idoStruct.tokenAddress;
        this.tradeInAddress = idoStruct.tradeInAddress;
        this.startDate = idoStruct.startDate;
        this.endDate = idoStruct.endDate;
        this.tradeValue = idoStruct.tradeValue;
        this.tokensForSale = idoStruct.tokensForSale;
        this.individualMinimumAmount = idoStruct.individualMinimumAmount;
        this.individualMaximumAmount = idoStruct.individualMaximumAmount;
        this.minimumRaise = idoStruct.minimumRaise;
        this.feePercentage = idoStruct.feePercentage;
        this.vestingStart = idoStruct.vestingStart;
        this.vestingCliff = idoStruct.vestingCliff;
        this.vestingDuration = idoStruct.vestingDuration;
        this.vestingSchedule = idoStruct.vestingSchedule;
        this.isTokenSwapAtomic = idoStruct.isTokenSwapAtomic;
        this.isPolsWhitelisted = idoStruct.isPolsWhitelisted;
        this.isFunded = idoStruct.isFunded;
        this.hasWhitelisting = idoStruct.hasWhitelisting;
        this.signerPublicAddress = idoStruct.signerPublicAddress;
        this.tokensAllocated = idoStruct.tokensAllocated;
        this.paused = idoStruct.paused;
        this.unsoldTokensRedeemed = idoStruct.unsoldTokensRedeemed;
        this.feeAddress = idoStruct.feeAddress;
    }
    static async fromSaleTokenMint(program, saleTokenMint, id) {
        let [stateAddress, _] = await anchor.web3.PublicKey.findProgramAddress([consts_1.NAMESPACES.IDO, saleTokenMint.toBuffer(), Buffer.from([id])], program.programId);
        return await this.fromStateAddress(program, stateAddress, id);
    }
    static async fromStateAddress(program, stateAddress, id) {
        let idoStruct = await program.account.ido.fetch(stateAddress, 'finalized');
        return new IDO(idoStruct, program, stateAddress, id);
    }
    static async create(program, initializer, idoId, saleToken, tradeValue, tokensForSale, startDate, endDate, individualMinimumAmount, individualMaximumAmount, minimumRaise, feePercentage, flags, tradeInAddress, vestingStart, vestingCliff, vestingDuration, vestingSchedule, feeAddress) {
        let [tokenAccountAuthority, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], program.programId);
        let [idoStateAddress, _1] = await anchor.web3.PublicKey.findProgramAddress([consts_1.NAMESPACES.IDO, saleToken.toBuffer(), Buffer.from([idoId])], program.programId);
        let [idoSaleTokenAccount, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.idoSaleTokenAccount), idoStateAddress.toBuffer()], program.programId);
        let [idoTradeInTokenAccount, _3] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tradeInTokenAccount), tradeInAddress.toBuffer(), idoStateAddress.toBuffer()], program.programId);
        if (tradeInAddress == anchor.web3.PublicKey.default) {
            let [idoSolAccount, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.idoSolAccount), idoStateAddress.toBuffer()], program.programId);
            return await program.methods.solInitializeIdo(idoId, saleToken, tradeValue, tokensForSale, startDate, endDate, individualMinimumAmount, individualMaximumAmount, minimumRaise, feePercentage, flags, vestingStart, vestingCliff, vestingDuration, vestingSchedule, feeAddress ? feeAddress : null).accounts({
                initializer: initializer,
                saleTokenMint: saleToken,
                idoSolAccount: idoSolAccount,
                tokenAccountPdaAuthority: tokenAccountAuthority,
                ido: idoStateAddress,
                idoSaleTokenAccount: idoSaleTokenAccount,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: spltoken.TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY
            }).instruction();
        }
        else {
            return await program.methods.initializeIdo(idoId, saleToken, tradeValue, tokensForSale, startDate, endDate, individualMinimumAmount, individualMaximumAmount, minimumRaise, feePercentage, flags, tradeInAddress, vestingStart, vestingCliff, vestingDuration, vestingSchedule, feeAddress ? feeAddress : null).accounts({
                initializer: initializer,
                saleTokenMint: saleToken,
                tradeInTokenMint: tradeInAddress,
                tokenAccountPdaAuthority: tokenAccountAuthority,
                ido: idoStateAddress,
                idoSaleTokenAccount: idoSaleTokenAccount,
                idoTradeInTokenAccount: idoTradeInTokenAccount,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: spltoken.TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            }).instruction();
        }
    }
    async updateIdoStruct() {
        let idoStruct = await this.program.account.ido.fetch(this.stateAddress);
        this.admin = idoStruct.admin;
        this.tokenAddress = idoStruct.tokenAddress;
        this.tradeInAddress = idoStruct.tradeInAddress;
        this.startDate = idoStruct.startDate;
        this.endDate = idoStruct.endDate;
        this.tradeValue = idoStruct.tradeValue;
        this.tokensForSale = idoStruct.tokensForSale;
        this.individualMinimumAmount = idoStruct.individualMinimumAmount;
        this.individualMaximumAmount = idoStruct.individualMaximumAmount;
        this.minimumRaise = idoStruct.minimumRaise;
        this.feePercentage = idoStruct.feePercentage;
        this.vestingStart = idoStruct.vestingStart;
        this.vestingCliff = idoStruct.vestingCliff;
        this.vestingDuration = idoStruct.vestingDuration;
        this.vestingSchedule = idoStruct.vestingSchedule;
        this.isTokenSwapAtomic = idoStruct.isTokenSwapAtomic;
        this.isPolsWhitelisted = idoStruct.isPolsWhitelisted;
        this.isFunded = idoStruct.isFunded;
        this.hasWhitelisting = idoStruct.hasWhitelisting;
        this.signerPublicAddress = idoStruct.signerPublicAddress;
        this.tokensAllocated = idoStruct.tokensAllocated;
        this.paused = idoStruct.paused;
        this.unsoldTokensRedeemed = idoStruct.unsoldTokensRedeemed;
        this.feeAddress = idoStruct.feeAddress;
    }
    async fund(funder, amount) {
        let [tokenAccountPdaAuthority, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let funderTokenAccount = await spltoken.getAssociatedTokenAddress(this.tokenAddress, funder);
        let [idoSaleTokenAccount, _1] = await this._getIdoSaleTokenAccount();
        return await this.program.methods.fund(this.id, amount).accounts({
            funder: funder,
            saleTokenMint: this.tokenAddress,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            funderTokenAccount: funderTokenAccount,
            idoSaleTokenAccount: idoSaleTokenAccount,
            ido: this.stateAddress,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID
        }).instruction();
    }
    async addExistingToBlacklist(userToBlacklist) {
        let [userWhitelist, _] = await this.getWhitelistAccount(userToBlacklist);
        return await this.program.methods.addExistingToBlacklist(this.id, userToBlacklist).accounts({
            admin: this.admin,
            saleTokenMint: this.tokenAddress,
            ido: this.stateAddress,
            whitelistAccount: userWhitelist,
        }).instruction();
    }
    async addExistingToWhitelist(userToWhitelist) {
        let [userWhitelist, _] = await this.getWhitelistAccount(userToWhitelist);
        return await this.program.methods.addExistingToBlacklist(this.id, userToWhitelist).accounts({
            admin: this.admin,
            saleTokenMint: this.tokenAddress,
            ido: this.stateAddress,
            whitelistAccount: userWhitelist,
        }).instruction();
    }
    async addToBlacklist(userToBlacklist) {
        let [userWhitelist, _] = await this.getWhitelistAccount(userToBlacklist);
        return await this.program.methods.addToBlacklist(this.id, userToBlacklist).accounts({
            admin: this.admin,
            saleTokenMint: this.tokenAddress,
            ido: this.stateAddress,
            whitelistAccount: userWhitelist,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).instruction();
    }
    async addToWhitelist(userToWhitelist) {
        let [userWhitelist, _] = await this.getWhitelistAccount(userToWhitelist);
        return await this.program.methods.addToWhitelist(this.id, userToWhitelist).accounts({
            admin: this.admin,
            saleTokenMint: this.tokenAddress,
            ido: this.stateAddress,
            whitelistAccount: userWhitelist,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).instruction();
    }
    async redeemTokens(purchaseIndex, purchaser) {
        let [idoSaleTokenAccount, _] = await this._getIdoSaleTokenAccount();
        let [purchaseAddress, _2] = await anchor.web3.PublicKey.findProgramAddress([
            purchaser.toBuffer(),
            this.stateAddress.toBuffer(),
            Buffer.from([purchaseIndex])
        ], this.program.programId);
        let purchaserSaleTokenAccount = await spltoken.getAssociatedTokenAddress(this.tokenAddress, purchaser);
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        return await this.program.methods.redeemTokens(this.id, purchaseIndex, pdaAuthBump).accounts({
            ido: this.stateAddress,
            idoSaleTokenAccount: idoSaleTokenAccount,
            purchase: purchaseAddress,
            purchaser: purchaser,
            purchaserTokenAccount: purchaserSaleTokenAccount,
            saleTokenMint: this.tokenAddress,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID
        }).instruction();
    }
    async solRedeemGivenMinimumGoalNotAchieved(purchaseIndex, purchaser) {
        let [idoSolAccount, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.idoSolAccount), this.stateAddress.toBuffer()], this.program.programId);
        return await this.program.methods.solRedeemGivenMinimumGoalNotAchieved(this.id, purchaseIndex).accounts({
            purchaser: purchaser,
            saleTokenMint: this.tokenAddress,
            idoSolAccount: idoSolAccount,
            ido: this.stateAddress
        }).instruction();
    }
    async redeemGivenMinimumGoalNotAchieved(purchaseIndex, purchaser) {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let [idoSaleTokenAccount, _] = await this._getIdoSaleTokenAccount();
        let [purchaseAddress, _2] = await anchor.web3.PublicKey.findProgramAddress([
            purchaser.toBuffer(),
            this.stateAddress.toBuffer(),
            Buffer.from([purchaseIndex])
        ], this.program.programId);
        let purchaserSaleTokenAccount = await spltoken.getAssociatedTokenAddress(this.tokenAddress, purchaser);
        return await this.program.methods.redeemGivenMinimumGoalNotAchieved(this.id, purchaseIndex, pdaAuthBump).accounts({
            ido: this.stateAddress,
            idoTradeInTokenAccount: idoSaleTokenAccount,
            purchase: purchaseAddress,
            purchaser: purchaser,
            purchaserTokenAccount: purchaserSaleTokenAccount,
            saleTokenMint: this.tokenAddress,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            tradeInTokenMint: this.tradeInAddress
        }).instruction();
    }
    async withdrawUnsoldTokens() {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let adminSaleTokenAccount = await spltoken.getAssociatedTokenAddress(this.tokenAddress, this.admin);
        let [idoSaleTokenAccount, _] = await this._getIdoSaleTokenAccount();
        return await this.program.methods.withdrawUnsoldTokens(this.id, pdaAuthBump).accounts({
            admin: this.admin,
            adminSaleTokenAccount: adminSaleTokenAccount,
            ido: this.stateAddress,
            idoSaleTokenAccount: idoSaleTokenAccount,
            saleTokenMint: this.tokenAddress,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
        }).instruction();
    }
    async solWithdrawFunds() {
        let [idoSolAccount, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.idoSolAccount), this.stateAddress.toBuffer()], this.program.programId);
        return await this.program.methods.solWithdrawFunds(this.id).accounts({
            admin: this.admin,
            saleTokenMint: this.tokenAddress,
            ido: this.stateAddress,
            idoSolAccount: idoSolAccount,
            feeChargeAccount: this.feeAddress ? this.feeAddress : this.admin,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        }).instruction();
    }
    async withdrawFunds() {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let adminTradeInTokenAccount = await spltoken.getAssociatedTokenAddress(this.tradeInAddress, this.admin);
        let [idoTradeInTokenAccount, _] = await this._getIdoTradeInTokenAccount();
        return await this.program.methods.withdrawFunds(this.id, pdaAuthBump).accounts({
            admin: this.admin,
            adminTradeInTokenAccount: adminTradeInTokenAccount,
            feeChargeTokenAccount: adminTradeInTokenAccount,
            ido: this.stateAddress,
            idoTradeInTokenAccount: idoTradeInTokenAccount,
            saleTokenMint: this.tokenAddress,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            tradeInTokenMint: this.tradeInAddress,
        }).instruction();
    }
    async removeFromBlacklist(user) {
        let [userWhitelist, _] = await this.getWhitelistAccount(user);
        return await this.program.methods.removeFromBlacklist(this.id, user).accounts({
            admin: this.admin,
            saleTokenMint: this.tokenAddress,
            ido: this.stateAddress,
            whitelistAccount: userWhitelist,
        }).instruction();
    }
    async removeFromWhitelist(user) {
        let [userWhitelist, _] = await this.getWhitelistAccount(user);
        return await this.program.methods.removeFromWhitelist(this.id, user).accounts({
            admin: this.admin,
            saleTokenMint: this.tokenAddress,
            ido: this.stateAddress,
            whitelistAccount: userWhitelist,
        }).instruction();
    }
    async setEndDate(date) {
        return await this.program.methods.setEndDate(date).accounts({
            admin: this.admin,
            ido: this.stateAddress
        }).instruction();
    }
    async setHasWhitelisting(newValue) {
        return await this.program.methods.setHasWhitelisting(newValue).accounts({
            admin: this.admin,
            ido: this.stateAddress
        }).instruction();
    }
    async setIndividualMaximumAmount(newAmount) {
        return await this.program.methods.setIndividualMaximumAmount(newAmount).accounts({
            admin: this.admin,
            ido: this.stateAddress
        }).instruction();
    }
    async setSignerPublicAddress(ethAddrBytes) {
        return await this.program.methods.setSignerPublicAddress(ethAddrBytes).accounts({
            admin: this.admin,
            ido: this.stateAddress
        }).instruction();
    }
    async setStartDate(date) {
        return await this.program.methods.setStartDate(date).accounts({
            admin: this.admin,
            ido: this.stateAddress
        }).instruction();
    }
    async setVesting(start, cliff, duration, schedule) {
        return await this.program.methods.setVesting(start, cliff, duration, schedule).accounts({
            admin: this.admin,
            ido: this.stateAddress
        }).instruction();
    }
    swap(purchaser, amount, signature, purchaseIndex) {
        return this.swapWithSig(purchaser, amount, new anchor.BN(0), signature, purchaseIndex);
    }
    async swapWithSig(purchaser, amount, accountMaxAmount, signature, purchaseIndex) {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let purchaserSaleTokenAccount = await spltoken.getAssociatedTokenAddress(this.tokenAddress, purchaser);
        let [idoSaleTokenAccount, _] = await this._getIdoSaleTokenAccount();
        let [newWhitelistAccount, _1] = await this.getWhitelistAccount(purchaser);
        let [purchaseAddress, _2] = await anchor.web3.PublicKey.findProgramAddress([
            purchaser.toBuffer(),
            this.stateAddress.toBuffer(),
            Buffer.from([purchaseIndex])
        ], this.program.programId);
        let totalAmountPurchased = await this._getTotalAmountPurchased(purchaser);
        if (this.hasWhitelisting) {
            if (!signature) {
                throw Error("signature must be defined on whitelisted IDO");
            }
            if (!this.tradeInAddress) {
                let [idoSolAccount, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.idoSolAccount), this.stateAddress.toBuffer()], this.program.programId);
                return await this.program.methods.solSwapWithSig(amount, accountMaxAmount, signature, this.id, pdaAuthBump, purchaseIndex, totalAmountPurchased).accounts({
                    purchaser: purchaser,
                    saleTokenMint: this.tokenAddress,
                    ido: this.stateAddress,
                    purchaserSaleTokenAccount: purchaserSaleTokenAccount,
                    idoSaleTokenAccount: idoSaleTokenAccount,
                    tokenAccountPdaAuthority: tokenAccountPdaAuthority,
                    purchaserWhitelistAccount: newWhitelistAccount,
                    purchase: purchaseAddress,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    tokenProgram: spltoken.TOKEN_PROGRAM_ID,
                    ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
                    idoSolAccount: idoSolAccount
                }).instruction();
            }
            else {
                let [idoTradeInTokenAccount, _3] = await this._getIdoTradeInTokenAccount();
                let purchaserTradeInTokenAccount = await spltoken.getAssociatedTokenAddress(this.tradeInAddress, purchaser, false);
                return this.program.methods.swapWithSig(amount, accountMaxAmount, signature, this.id, pdaAuthBump, purchaseIndex, totalAmountPurchased).accounts({
                    purchaser: purchaser,
                    saleTokenMint: this.tokenAddress,
                    ido: this.stateAddress,
                    purchase: purchaseAddress,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    tokenProgram: spltoken.TOKEN_PROGRAM_ID,
                    tokenAccountPdaAuthority: tokenAccountPdaAuthority,
                    idoSaleTokenAccount: idoSaleTokenAccount,
                    purchaserWhitelistAccount: newWhitelistAccount,
                    purchaserSaleTokenAccount: purchaserSaleTokenAccount,
                    tradeInTokenMint: this.tradeInAddress,
                    purchaserTradeInTokenAccount: purchaserTradeInTokenAccount,
                    idoTradeInTokenAccount: idoTradeInTokenAccount,
                    ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
                }).instruction();
            }
        }
        else {
            if (!this.tradeInAddress) {
                let [idoSolAccount, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.idoSolAccount), this.stateAddress.toBuffer()], this.program.programId);
                return this.program.methods.solSwapWithSigNoWhitelist(amount, accountMaxAmount, this.id, pdaAuthBump, purchaseIndex, totalAmountPurchased).accounts({
                    purchaser: purchaser,
                    saleTokenMint: this.tokenAddress,
                    tokenAccountPdaAuthority: tokenAccountPdaAuthority,
                    purchaserSaleTokenAccount: purchaserSaleTokenAccount,
                    idoSaleTokenAccount: idoSaleTokenAccount,
                    ido: this.stateAddress,
                    idoSolAccount: idoSolAccount,
                    purchase: purchaseAddress,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    tokenProgram: spltoken.TOKEN_PROGRAM_ID
                }).instruction();
            }
            else {
                let [idoTradeInTokenAccount, _3] = await this._getIdoTradeInTokenAccount();
                let purchaserTradeInTokenAccount = await spltoken.getAssociatedTokenAddress(this.tradeInAddress, purchaser, false);
                return this.program.methods.swapWithSigNoWhitelist(amount, accountMaxAmount, this.id, pdaAuthBump, purchaseIndex, totalAmountPurchased).accounts({
                    purchaser: purchaser,
                    saleTokenMint: this.tokenAddress,
                    tradeInTokenMint: this.tradeInAddress,
                    tokenAccountPdaAuthority: tokenAccountPdaAuthority,
                    purchaserSaleTokenAccount: purchaserSaleTokenAccount,
                    idoSaleTokenAccount: idoSaleTokenAccount,
                    purchaserTradeInTokenAccount: purchaserTradeInTokenAccount,
                    idoTradeInTokenAccount: idoTradeInTokenAccount,
                    ido: this.stateAddress,
                    purchase: purchaseAddress,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    tokenProgram: spltoken.TOKEN_PROGRAM_ID
                }).instruction();
            }
        }
    }
    async transferTokens(purchaser, purchaseId, stake) {
        let [idoSaleTokenAccount, _] = await this._getIdoSaleTokenAccount();
        let purchaserSaleTokenAccount = await spltoken.getAssociatedTokenAddress(this.tokenAddress, purchaser);
        let [purchaseAddress, _1] = await anchor.web3.PublicKey.findProgramAddress([
            purchaser.toBuffer(),
            this.tokenAddress.toBuffer(),
            Buffer.from([purchaseId])
        ], this.program.programId);
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        return await this.program.methods.transferTokens(this.id, purchaseId, pdaAuthBump, stake).accounts({
            ido: this.stateAddress,
            idoSaleTokenAccount: idoSaleTokenAccount,
            purchase: purchaseAddress,
            purchaser: purchaser,
            purchaserTokenAccount: purchaserSaleTokenAccount,
            saleTokenMint: this.tokenAddress,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID
        }).instruction();
    }
    async tokensAvaliable(connection, commitment) {
        let [address, _] = await this._getIdoSaleTokenAccount();
        let tokenAccount = await spltoken.getAccount(connection, address, commitment);
        return new anchor.BN(tokenAccount.amount.toString(10), 10);
    }
    async pauseContract() {
        return await this.program.methods.pause().accounts({
            ido: this.stateAddress,
            admin: this.admin
        }).instruction();
    }
    async unpauseContract() {
        return await this.program.methods.unpause().accounts({
            ido: this.stateAddress,
            admin: this.admin
        }).instruction();
    }
    async updateFundStatus(funder) {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let funderTokenAccount = await spltoken.getAssociatedTokenAddress(this.tokenAddress, funder);
        let [idoSaleTokenAccount, _] = await this._getIdoSaleTokenAccount();
        return await this.program.methods.updateFundStatus(this.id).accounts({
            funder: funder,
            funderTokenAccount: funderTokenAccount,
            ido: this.stateAddress,
            idoSaleTokenAccount: idoSaleTokenAccount,
            saleTokenMint: this.tokenAddress,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID
        }).instruction();
    }
    async _initPurchaserAccount(connection, user, payer) {
        return await (0, helpers_1.createAccount)(connection, payer, this.tokenAddress, user);
    }
    async getTotalPurchases(user) {
        let totalPurchases = await this.program.account.purchase.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: user.toBase58(),
                }
            },
            {
                memcmp: {
                    offset: 40,
                    bytes: this.stateAddress.toBase58(),
                }
            }
        ]);
        // Return length of arr
        return totalPurchases.length;
    }
    async _getTotalAmountPurchased(purchaser) {
        let totalPurchases = await this.program.account.purchase.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: purchaser.toBase58(),
                }
            },
            {
                memcmp: {
                    offset: 40,
                    bytes: this.stateAddress.toBase58(),
                }
            }
        ]);
        return totalPurchases.map(p => p.account.amount).reduce((a, b) => a.add(b), new anchor.BN(0));
    }
    async getPurchase(purchaseAddress, commitment) {
        let purchase = await this.program.account.purchase.fetch(purchaseAddress, commitment);
        return purchase;
    }
    async getBuyers() {
        let buyersAccounts = await this.program.account.purchase.all([
            {
                memcmp: {
                    offset: 40,
                    bytes: this.stateAddress.toBase58(),
                }
            }
        ]);
        let buyersAddress = buyersAccounts.map(p => p.account.purchaser);
        buyersAddress = buyersAddress.filter((acc, index) => {
            return buyersAddress.indexOf(acc) === index;
        });
        return buyersAddress;
    }
    /*public async getPurchase(addr: anchor.web3.PublicKey, commitment?: anchor.web3.Commitment){
        let purchase = await this.program.account.purchase.fetch(addr, commitment);
        let amountLeftToRedeem = purchase.amount.sub(purchase.amountRedeemed)
    }*/
    async getWhitelistedAddresses() {
        let whitelistAccounts = await this.program.account.whitelistAccount.all([
            {
                memcmp: {
                    offset: 40,
                    bytes: this.stateAddress.toBase58(),
                }
            }
        ]);
        return whitelistAccounts.map(p => p.account.user);
    }
    async getPurchasesIds() {
        let purchases = await this.program.account.purchase.all([
            {
                memcmp: {
                    offset: 40,
                    bytes: this.stateAddress.toBase58(),
                }
            }
        ]);
        return purchases.map(p => p.publicKey);
    }
    async getAddressPurchaseIds(address) {
        let purchases = await this.program.account.purchase.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: address.toBase58(),
                }
            },
            {
                memcmp: {
                    offset: 40,
                    bytes: this.stateAddress.toBase58(),
                }
            }
        ]);
        return purchases.map(p => p.publicKey);
    }
    async isWhitelisted(user, commitment) {
        let [whitelistAddr, _] = await this.getWhitelistAccount(user);
        let whitelistAccount = await this.program.account.whitelistAccount.fetchNullable(whitelistAddr, commitment);
        if (whitelistAccount) {
            return whitelistAccount.whitelisted && !whitelistAccount.blacklisted;
        }
        else {
            return false;
        }
    }
    async isBlacklisted(user, commitment) {
        let [whitelistAddr, _] = await this.getWhitelistAccount(user);
        let whitelistAccount = await this.program.account.whitelistAccount.fetchNullable(whitelistAddr, commitment);
        if (whitelistAccount) {
            return whitelistAccount.blacklisted;
        }
        else {
            return false;
        }
    }
    async getWhitelistAccount(user) {
        return await anchor.web3.PublicKey.findProgramAddress([
            consts_1.NAMESPACES.WHITELIST,
            user.toBuffer(),
            this.stateAddress.toBuffer()
        ], this.program.programId);
    }
    _getIdoTradeInTokenAccount() {
        return anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tradeInTokenAccount), this.tradeInAddress.toBuffer(), this.stateAddress.toBuffer()], this.program.programId);
    }
    _getIdoSaleTokenAccount() {
        return anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.idoSaleTokenAccount), this.stateAddress.toBuffer()], this.program.programId);
    }
}
exports.IDO = IDO;
