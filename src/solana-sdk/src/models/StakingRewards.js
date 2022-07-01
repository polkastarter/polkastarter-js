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
exports.StakingRewards = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const spltoken = __importStar(require("@solana/spl-token"));
const consts_1 = require("../utils/consts");
class StakingRewards {
    constructor(connection, program, struct, address, ido, idoId, commitment) {
        this.idoStateAddress = ido;
        this.idoId = idoId;
        this.commitment = commitment;
        this.connection = connection;
        this.address = address;
        this.program = program;
        this.ido = struct.ido;
        this.admin = struct.admin;
        this.stakingToken = struct.stakingToken;
        this.rewardsToken = struct.rewardsToken;
        this.periodFinish = struct.periodFinish;
        this.rewardRate = struct.rewardRate;
        this.rewardsDuration = struct.rewardsDuration;
        this.lastUpdateTime = struct.lastUpdateTime;
        this.rewardPerTokenStored = struct.rewardPerTokenStored;
        this.rewardsTokenAllocated = struct.rewardsTokenAllocated;
        this._totalSupply = struct.totalSupply;
        this.userStakeEnabled = struct.userStakeEnabled;
    }
    /*static async create(connection: anchor.web3.Connection, program: Program<Polkastarter>, address: anchor.web3.PublicKey, commitment?: anchor.web3.Commitment){
        
    }*/
    static async fromStateAddress(connection, program, address, ido, idoId, commitment) {
        let struct = await program.account.stakingRewards.fetch(address);
        return new StakingRewards(connection, program, struct, address, ido, idoId, commitment);
    }
    async withdraw(user, amount) {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        let [srRewardsTokenAccount, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srRewardsTokenAccount), stakingRewards.toBuffer()], this.program.programId);
        let [stakingBalanceAccount, _4] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingBalance), stakingRewards.toBuffer(), user.toBuffer()], this.program.programId);
        let userStakingTokenAccount = await spltoken.getAssociatedTokenAddress(this.stakingToken, user);
        return await this.program.methods.withdraw(amount, this.idoId, pdaAuthBump).accounts({
            ido: this.idoStateAddress,
            saleTokenMint: this.stakingToken,
            srStakingTokenAccount: srRewardsTokenAccount,
            stakingRewards: stakingRewards,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            user: user,
            userStakingBalance: stakingBalanceAccount,
            userStakingTokenAccount: userStakingTokenAccount
        }).instruction();
    }
    async withdrawAll(user, amount) {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        let [srRewardsTokenAccount, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srRewardsTokenAccount), stakingRewards.toBuffer()], this.program.programId);
        let [stakingBalanceAccount, _3] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingBalance), stakingRewards.toBuffer(), user.toBuffer()], this.program.programId);
        let userStakingTokenAccount = await spltoken.getAssociatedTokenAddress(this.stakingToken, user);
        return await this.program.methods.withdrawAll(this.idoId, pdaAuthBump).accounts({
            ido: this.idoStateAddress,
            saleTokenMint: this.stakingToken,
            srStakingTokenAccount: srRewardsTokenAccount,
            stakingRewards: stakingRewards,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            user: user,
            userStakingBalance: stakingBalanceAccount,
            userStakingTokenAccount: userStakingTokenAccount
        }).instruction();
    }
    async getReward(user) {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let [srRewardsTokenAccount, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srRewardsTokenAccount)], this.program.programId);
        let [stakingRewards, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        let [stakingBalanceAccount, _3] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingBalance), stakingRewards.toBuffer(), user.toBuffer()], this.program.programId);
        let userRewardsTokenAccount = await spltoken.getAssociatedTokenAddress(this.rewardsToken, user);
        return await this.program.methods.getReward(this.idoId, pdaAuthBump).accounts({
            ido: this.ido,
            rewardsTokenMint: this.rewardsToken,
            saleTokenMint: this.stakingToken,
            srRewardsTokenAccount: srRewardsTokenAccount,
            stakingRewards: stakingRewards,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            user: user,
            userRewardsTokenAccount: userRewardsTokenAccount,
            userStakingBalance: stakingBalanceAccount
        }).instruction();
    }
    async exit(user) {
        let [tokenAccountPdaAuthority, pdaAuthBump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.tokenAccountAuthority)], this.program.programId);
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        let [srRewardsTokenAccount, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srRewardsTokenAccount), stakingRewards.toBuffer()], this.program.programId);
        let [srStakingTokenAccount, _3] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srStakingTokenAccount), stakingRewards.toBuffer()], this.program.programId);
        let [stakingBalanceAccount, _4] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingBalance), stakingRewards.toBuffer(), user.toBuffer()], this.program.programId);
        let userRewardsTokenAccount = await spltoken.getAssociatedTokenAddress(this.rewardsToken, user);
        return await this.program.methods.exit(this.idoId, pdaAuthBump).accounts({
            ido: this.ido,
            rewardsTokenMint: this.rewardsToken,
            saleTokenMint: this.stakingToken,
            srRewardsTokenAccount: srRewardsTokenAccount,
            stakingRewards: stakingRewards,
            tokenAccountPdaAuthority: tokenAccountPdaAuthority,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            user: user,
            userRewardsTokenAccount: userRewardsTokenAccount,
            userStakingBalance: stakingBalanceAccount,
            srStakingTokenAccount: srStakingTokenAccount
        }).instruction();
    }
    async notifyRewardAmount(reward, user) {
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        let [srRewardsTokenAccount, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srRewardsTokenAccount), stakingRewards.toBuffer()], this.program.programId);
        let rewardDistributionTokenAccount = await spltoken.getAssociatedTokenAddress(this.rewardsToken, user);
        return await this.program.methods.notifyRewardAmount(this.idoId, reward).accounts({
            ido: this.ido,
            saleTokenMint: this.stakingToken,
            srRewardsTokenAccount: srRewardsTokenAccount,
            stakingRewards: stakingRewards,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            rewardDistribution: user,
            rewardDistributionTokenAccount: rewardDistributionTokenAccount,
            rewardTokenMint: this.rewardsToken
        }).instruction();
    }
    async transferRewardToken(reward, user) {
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        let [srRewardsTokenAccount, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srRewardsTokenAccount), stakingRewards.toBuffer()], this.program.programId);
        let rewardDistributionTokenAccount = await spltoken.getAssociatedTokenAddress(this.rewardsToken, user);
        return await this.program.methods.transferRewardToken(this.idoId, reward).accounts({
            ido: this.ido,
            saleTokenMint: this.stakingToken,
            srRewardsTokenAccount: srRewardsTokenAccount,
            stakingRewards: stakingRewards,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            rewardDistribution: user,
            rewardDistributionTokenAccount: rewardDistributionTokenAccount,
            rewardTokenMint: this.rewardsToken
        }).instruction();
    }
    async notifyRewardAmountSamePeriod(reward, user) {
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        let [srRewardsTokenAccount, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srRewardsTokenAccount), stakingRewards.toBuffer()], this.program.programId);
        let rewardDistributionTokenAccount = await spltoken.getAssociatedTokenAddress(this.rewardsToken, user);
        return await this.program.methods.notifyRewardAmountSamePeriod(this.idoId, reward).accounts({
            ido: this.ido,
            saleTokenMint: this.stakingToken,
            srRewardsTokenAccount: srRewardsTokenAccount,
            stakingRewards: stakingRewards,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            rewardDistribution: user,
            rewardDistributionTokenAccount: rewardDistributionTokenAccount,
            rewardTokenMint: this.rewardsToken
        }).instruction();
    }
    async transferRewardTokenSamePeriod(reward, user) {
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        let [srRewardsTokenAccount, _2] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.srRewardsTokenAccount), stakingRewards.toBuffer()], this.program.programId);
        let rewardDistributionTokenAccount = await spltoken.getAssociatedTokenAddress(this.rewardsToken, user);
        return await this.program.methods.transferRewardTokenSamePeriod(this.idoId, reward).accounts({
            ido: this.ido,
            saleTokenMint: this.stakingToken,
            srRewardsTokenAccount: srRewardsTokenAccount,
            stakingRewards: stakingRewards,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            rewardDistribution: user,
            rewardDistributionTokenAccount: rewardDistributionTokenAccount,
            rewardTokenMint: this.rewardsToken
        });
    }
    async setRewardsDuration(rewardsDuration) {
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        return await this.program.methods.setRewardsDuration(rewardsDuration).accounts({
            admin: this.admin,
            stakingRewards: stakingRewards
        }).instruction();
    }
    async pause() {
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        return await this.program.methods.pauseSr().accounts({
            admin: this.admin,
            stakingRewards: stakingRewards
        }).instruction();
    }
    async unpause() {
        let [stakingRewards, _] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(consts_1.SEEDS.stakingRewards), this.idoStateAddress.toBuffer()], this.program.programId);
        return await this.program.methods.unpauseSr().accounts({
            admin: this.admin,
            stakingRewards: stakingRewards
        }).instruction();
    }
    totalSupply() {
        return this._totalSupply;
    }
    async balanceOf(address) {
        let stakingBalanceStruct = await this.program.account.stakingBalance.fetch(address);
        return stakingBalanceStruct.balanceStaked;
    }
    async balanceRewardsToken() {
        let programTokenAddress = await spltoken.getAssociatedTokenAddress(this.rewardsToken, this.address);
        let account = await spltoken.getAccount(this.connection, programTokenAddress, this.commitment);
        let balance = new anchor.BN(account.amount.toString(10), 10);
        if (this.rewardsToken.toBase58() == this.stakingToken.toBase58())
            return balance.sub(this.totalSupply());
        else
            return balance;
    }
    getRewardForDuration() {
        return this.rewardRate.mul(this.rewardsDuration);
    }
    async lastTimeRewardApplicable() {
        let blockHeight = await this.connection.getBlockHeight(this.commitment);
        let blockTime = await this.connection.getBlockTime(blockHeight);
        if (blockTime)
            return anchor.BN.min(new anchor.BN(blockTime), this.periodFinish);
        else
            throw Error("getBlockTime failed");
    }
    async rewardPerToken() {
        if (this._totalSupply.eqn(0))
            return this.rewardPerTokenStored;
        return this.rewardPerTokenStored.add((await this.lastTimeRewardApplicable()).sub(this.lastUpdateTime).muln(1e10).div(this._totalSupply));
    }
    async earned(address) {
        let stakingBalanceStruct = await this.program.account.stakingBalance.fetch(address);
        return stakingBalanceStruct.balanceStaked.mul((await this.rewardPerToken())
            .sub(stakingBalanceStruct.userRewardPerTokenPaid))
            .divn(1e10)
            .add(stakingBalanceStruct.rewards);
    }
}
exports.StakingRewards = StakingRewards;
