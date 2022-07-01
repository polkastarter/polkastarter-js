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
exports.BigInttoBN = exports.BNtoBigInt = exports.mintTokens = exports.delay = exports.fromDecimals = exports.toSmartContractDecimals = exports.smartContractTimeToDate = exports.timeToSmartContractTime = exports.createAccount = exports.getOrCreateTokenAccount = exports.createToken = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const spltoken = __importStar(require("@solana/spl-token"));
/**
 * @param connection Connection to rpc
 * @param creator Keypair of the creator (mint authority)
 * @returns mint token address
 */
async function createToken(connection, creator, decimals = 8) {
    let mint = await spltoken.createMint(connection, // Conn
    creator, // Payer
    creator.publicKey, // Mint Authority
    null, // Freeze Authority
    decimals, undefined, {
        commitment: "finalized"
    });
    return mint;
}
exports.createToken = createToken;
async function getOrCreateTokenAccount(connection, payer, token, owner, allowPDA = false) {
    let accountAddress = await spltoken.createAssociatedTokenAccount(connection, payer, token, owner, {
        commitment: 'finalized'
    });
    return accountAddress;
}
exports.getOrCreateTokenAccount = getOrCreateTokenAccount;
async function createAccount(connection, payer, token, owner) {
    return await spltoken.createAccount(connection, payer, token, owner, undefined, {
        commitment: 'finalized'
    });
}
exports.createAccount = createAccount;
function timeToSmartContractTime(time) {
    let scTime = new Date(time).getTime() / 1000;
    return new anchor.BN(scTime);
}
exports.timeToSmartContractTime = timeToSmartContractTime;
function smartContractTimeToDate(time) {
    return new Date(time.muln(1000).toNumber());
}
exports.smartContractTimeToDate = smartContractTimeToDate;
function toSmartContractDecimals(value, decimals) {
    let strval = value.toFixed(decimals);
    strval = strval.replace('.', '');
    return new anchor.BN(strval);
}
exports.toSmartContractDecimals = toSmartContractDecimals;
function fromDecimals(value, decimals) {
    if (value == null) {
        return 0 + '';
    }
    let strval = value.toString(10);
    if (strval.length > decimals) {
        let decimalPart = strval.slice(-decimals);
        let wholePart = strval.slice(0, strval.length - decimals);
        return Number(parseFloat(`${wholePart}.${decimalPart}`));
    }
    else {
        let wholePart = '0';
        let decimalPart = strval.padStart(decimals, '0');
        return Number(parseFloat(`${wholePart}.${decimalPart}`));
    }
}
exports.fromDecimals = fromDecimals;
async function delay(ms) {
    let prom = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
    await prom;
}
exports.delay = delay;
async function mintTokens(connection, payer, token, receiver, tokenCreator, amount) {
    /*let receiverTokenAccount = await getOrCreateTokenAccount(
        connection,
        payer,
        token,
        receiver,
        false
    )*/
    let mint = await spltoken.mintTo(connection, payer, token, receiver, tokenCreator.publicKey, BNtoBigInt(amount), [tokenCreator], {
        commitment: 'finalized'
    });
    return mint;
}
exports.mintTokens = mintTokens;
function BNtoBigInt(bn) {
    return BigInt(bn.toString(10));
}
exports.BNtoBigInt = BNtoBigInt;
function BigInttoBN(bigint) {
    return new anchor.BN(bigint.toString(10), 10);
}
exports.BigInttoBN = BigInttoBN;
