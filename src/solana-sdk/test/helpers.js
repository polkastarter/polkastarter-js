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
context('Helpers', async () => {
    it('test fromDecimals', async () => {
        (0, chai_1.expect)(helpers.fromDecimals(new anchor.BN("970000000000000000"), 16)).to.equal(97);
        (0, chai_1.expect)(helpers.fromDecimals(new anchor.BN("97000000000000000"), 18)).to.equal(0.097);
    });
    it('test toSmartContractDecimals', async () => {
        (0, chai_1.expect)(helpers.toSmartContractDecimals(0.097, 18).eq(new anchor.BN("97000000000000000")));
        (0, chai_1.expect)(helpers.toSmartContractDecimals(0.097234523452345, 18).eq(new anchor.BN("97234523452345000")));
        (0, chai_1.expect)(helpers.toSmartContractDecimals(0.017234523453345333, 18).eq(new anchor.BN("17234523453345333")));
    });
    it('test BNToBigInt', async () => {
        let bigint = helpers.BNtoBigInt(new anchor.BN(1000));
        (0, chai_1.expect)(bigint).to.equal(1000n);
    });
    it('test BigIntToBN', async () => {
        let bigNumber = helpers.BigInttoBN(1000n);
        (0, chai_1.expect)(bigNumber.eq(new anchor.BN(1000))).to.be.true;
    });
});
