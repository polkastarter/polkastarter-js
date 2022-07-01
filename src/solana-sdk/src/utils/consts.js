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
exports.DeployerKeypair = exports.programAddress = exports.FLAGS = exports.SEEDS = exports.NAMESPACES = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const buffer_1 = require("buffer");
exports.NAMESPACES = {
    IDO: buffer_1.Buffer.from("IDO_NAMESPACE"),
    WHITELIST: buffer_1.Buffer.from("WHITELIST_NAMESPACE"),
    PURCHASE: buffer_1.Buffer.from("PURCHASE_NAMESPACE"),
};
exports.SEEDS = {
    tokenAccountAuthority: 'token_account_pda_authority',
    idoSaleTokenAccount: 'ido_sale_token_account',
    tradeInTokenAccount: 'ido_trade_in_token_account',
    idoSolAccount: 'ido_sol_account',
    srRewardsTokenAccount: 'sr_rewards_token_account',
    srStakingTokenAccount: 'sr_staking_token_account',
    stakingRewards: 'staking_rewards',
    stakingBalance: 'staking_balance',
};
exports.FLAGS = {
    IS_TOKEN_SWAP_ATOMIC: 1,
    HAS_WHITELISTING: 2,
    IS_POLS_WHITELISTED: 4,
};
exports.programAddress = 'DitGf6dr2gpNmoNyemKFEc9AYnmKMsW9aGbWSUQC5pmj';
exports.DeployerKeypair = anchor.web3.Keypair.fromSecretKey(buffer_1.Buffer.from(
    [
        236,103,81,106,243,224,125,54,140,219,24,193,30,31,44,138,230,183,101,86,81,116,236,157,246,189,69,175,169,233,200,240,192,211,109,31,48,140,9,114,171,129,144,40,99,54,112,14,241,165,25,45,61,184,134,89,63,83,253,125,144,146,128,30
    ]
));
