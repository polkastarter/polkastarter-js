"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "polkastarter",
    "instructions": [
        {
            "name": "initializeIdo",
            "accounts": [
                {
                    "name": "initializer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tradeInTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "tokenAddress",
                    "type": "publicKey"
                },
                {
                    "name": "tradeValue",
                    "type": "u64"
                },
                {
                    "name": "tokensForSale",
                    "type": "u64"
                },
                {
                    "name": "startDate",
                    "type": "i64"
                },
                {
                    "name": "endDate",
                    "type": "i64"
                },
                {
                    "name": "individualMinimumAmount",
                    "type": "u64"
                },
                {
                    "name": "individualMaximumAmount",
                    "type": "u64"
                },
                {
                    "name": "minimumRaise",
                    "type": "u64"
                },
                {
                    "name": "feePercentage",
                    "type": "u32"
                },
                {
                    "name": "flags",
                    "type": "u32"
                },
                {
                    "name": "tradeInAddress",
                    "type": {
                        "option": "publicKey"
                    }
                },
                {
                    "name": "vestingStart",
                    "type": "u64"
                },
                {
                    "name": "vestingCliff",
                    "type": "u64"
                },
                {
                    "name": "vestingDuration",
                    "type": "u64"
                },
                {
                    "name": "vestingSchedule",
                    "type": {
                        "vec": "u64"
                    }
                },
                {
                    "name": "feeAddress",
                    "type": {
                        "option": "publicKey"
                    }
                }
            ]
        },
        {
            "name": "solInitializeIdo",
            "accounts": [
                {
                    "name": "initializer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "idoSolAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "tokenAddress",
                    "type": "publicKey"
                },
                {
                    "name": "tradeValue",
                    "type": "u64"
                },
                {
                    "name": "tokensForSale",
                    "type": "u64"
                },
                {
                    "name": "startDate",
                    "type": "i64"
                },
                {
                    "name": "endDate",
                    "type": "i64"
                },
                {
                    "name": "individualMinimumAmount",
                    "type": "u64"
                },
                {
                    "name": "individualMaximumAmount",
                    "type": "u64"
                },
                {
                    "name": "minimumRaise",
                    "type": "u64"
                },
                {
                    "name": "feePercentage",
                    "type": "u32"
                },
                {
                    "name": "flags",
                    "type": "u32"
                },
                {
                    "name": "vestingStart",
                    "type": "u64"
                },
                {
                    "name": "vestingCliff",
                    "type": "u64"
                },
                {
                    "name": "vestingDuration",
                    "type": "u64"
                },
                {
                    "name": "vestingSchedule",
                    "type": {
                        "vec": "u64"
                    }
                },
                {
                    "name": "feeAddress",
                    "type": {
                        "option": "publicKey"
                    }
                }
            ]
        },
        {
            "name": "setIndividualMaximumAmount",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "individualMaximumAmount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "setStartDate",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "startDate",
                    "type": "i64"
                }
            ]
        },
        {
            "name": "setEndDate",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "endDate",
                    "type": "i64"
                }
            ]
        },
        {
            "name": "setVesting",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "vestingStart",
                    "type": "u64"
                },
                {
                    "name": "vestingCliff",
                    "type": "u64"
                },
                {
                    "name": "vestingDuration",
                    "type": "u64"
                },
                {
                    "name": "vestingSchedule",
                    "type": {
                        "vec": "u64"
                    }
                }
            ]
        },
        {
            "name": "fund",
            "accounts": [
                {
                    "name": "funder",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "funderTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "updateFundStatus",
            "accounts": [
                {
                    "name": "funder",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "funderTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "swapWithSig",
            "accounts": [
                {
                    "name": "purchaser",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "purchaserWhitelistAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tradeInTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "purchaserSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchaserTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchase",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ixSysvar",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "accountMaxAmount",
                    "type": "u64"
                },
                {
                    "name": "signature",
                    "type": {
                        "array": [
                            "u8",
                            65
                        ]
                    }
                },
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                },
                {
                    "name": "purchaseIndex",
                    "type": "u8"
                },
                {
                    "name": "purchaserTotalAmountPurchased",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "swapWithSigNoWhitelist",
            "accounts": [
                {
                    "name": "purchaser",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tradeInTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "purchaserSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchaserTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchase",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "accountMaxAmount",
                    "type": "u64"
                },
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                },
                {
                    "name": "purchaseIndex",
                    "type": "u8"
                },
                {
                    "name": "purchaserTotalAmountPurchased",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "solSwapWithSig",
            "accounts": [
                {
                    "name": "purchaser",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "purchaserWhitelistAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "purchaserSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSolAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchase",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ixSysvar",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "accountMaxAmount",
                    "type": "u64"
                },
                {
                    "name": "signature",
                    "type": {
                        "array": [
                            "u8",
                            65
                        ]
                    }
                },
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                },
                {
                    "name": "purchaseIndex",
                    "type": "u8"
                },
                {
                    "name": "purchaserTotalAmountPurchased",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "solSwapWithSigNoWhitelist",
            "accounts": [
                {
                    "name": "purchaser",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "purchaserSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSolAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchase",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "accountMaxAmount",
                    "type": "u64"
                },
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                },
                {
                    "name": "purchaseIndex",
                    "type": "u8"
                },
                {
                    "name": "purchaserTotalAmountPurchased",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "transferTokens",
            "accounts": [
                {
                    "name": "purchaser",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "purchaserTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchase",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "purchaseIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                },
                {
                    "name": "stake",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "redeemTokens",
            "accounts": [
                {
                    "name": "purchaser",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "purchaserTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchase",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "purchaseIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "redeemGivenMinimumGoalNotAchieved",
            "accounts": [
                {
                    "name": "purchaser",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tradeInTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "purchaserTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchase",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "purchaseIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "solRedeemGivenMinimumGoalNotAchieved",
            "accounts": [
                {
                    "name": "purchaser",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "idoSolAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "purchase",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "purchaseIndex",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "setHasWhitelisting",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "val",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "setSignerPublicAddress",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "signerPublicAddress",
                    "type": {
                        "array": [
                            "u8",
                            20
                        ]
                    }
                }
            ]
        },
        {
            "name": "addToWhitelist",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelistAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "user",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "addExistingToWhitelist",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelistAccount",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "user",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "removeFromWhitelist",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelistAccount",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "user",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "addToBlacklist",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelistAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "user",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "addExistingToBlacklist",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelistAccount",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "user",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "removeFromBlacklist",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelistAccount",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "user",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "withdrawFunds",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tradeInTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "feeChargeTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "adminTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "solWithdrawFunds",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSolAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "feeChargeAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "withdrawUnsoldTokens",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "adminSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "pause",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "unpause",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "safePullSol",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "idoSolAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "safePullSaleToken",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "adminSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "safePullTradeToken",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tradeInTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "idoTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "adminTradeInTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "amIWhitelisted",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelistAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ixSysvar",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "maxAlloc",
                    "type": "u64"
                },
                {
                    "name": "signature",
                    "type": {
                        "array": [
                            "u8",
                            65
                        ]
                    }
                }
            ]
        },
        {
            "name": "stakeTransfer",
            "accounts": [
                {
                    "name": "quienfirma",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "stakingRewards",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "idoSaleTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "stakingRewardsSaleTokenAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "userStakingBalance",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "userAccount",
                    "type": "publicKey"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                },
                {
                    "name": "idoIndex",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "initializeStakingRewards",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "idoAdmin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rewardsTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "srStakingTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "srRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "rewardsDuration",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "withdraw",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "srStakingTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userStakingTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userStakingBalance",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "withdrawAll",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "srStakingTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userStakingTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userStakingBalance",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "getReward",
            "accounts": [
                {
                    "name": "user",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rewardsTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "userRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "srRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userStakingBalance",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "exit",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rewardsTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenAccountPdaAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "srStakingTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "srRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userStakingTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userStakingBalance",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "pdaAuthorityBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "setRewardsDuration",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "stakingRewards",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "rewardsDuration",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "notifyRewardAmount",
            "accounts": [
                {
                    "name": "rewardDistribution",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "rewardDistributionTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rewardTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "srRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "reward",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "transferRewardToken",
            "accounts": [
                {
                    "name": "rewardDistribution",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "rewardDistributionTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rewardTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "srRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "reward",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "notifyRewardAmountSamePeriod",
            "accounts": [
                {
                    "name": "rewardDistribution",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "rewardDistributionTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rewardTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "srRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "reward",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "transferRewardTokenSamePeriod",
            "accounts": [
                {
                    "name": "rewardDistribution",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "rewardDistributionTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "saleTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rewardTokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ido",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "stakingRewards",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "srRewardsTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "idoIndex",
                    "type": "u8"
                },
                {
                    "name": "reward",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "pauseSr",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "stakingRewards",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "unpauseSr",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "stakingRewards",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "ido",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "admin",
                        "type": "publicKey"
                    },
                    {
                        "name": "tokenAddress",
                        "type": "publicKey"
                    },
                    {
                        "name": "tradeInAddress",
                        "type": {
                            "option": "publicKey"
                        }
                    },
                    {
                        "name": "startDate",
                        "type": "i64"
                    },
                    {
                        "name": "endDate",
                        "type": "i64"
                    },
                    {
                        "name": "tradeValue",
                        "type": "u64"
                    },
                    {
                        "name": "tokensForSale",
                        "type": "u64"
                    },
                    {
                        "name": "individualMinimumAmount",
                        "type": "u64"
                    },
                    {
                        "name": "individualMaximumAmount",
                        "type": "u64"
                    },
                    {
                        "name": "minimumRaise",
                        "type": "u64"
                    },
                    {
                        "name": "feePercentage",
                        "type": "u32"
                    },
                    {
                        "name": "vestingStart",
                        "type": "u64"
                    },
                    {
                        "name": "vestingCliff",
                        "type": "u64"
                    },
                    {
                        "name": "vestingDuration",
                        "type": "u64"
                    },
                    {
                        "name": "vestingSchedule",
                        "type": {
                            "vec": "u64"
                        }
                    },
                    {
                        "name": "isTokenSwapAtomic",
                        "type": "bool"
                    },
                    {
                        "name": "isPolsWhitelisted",
                        "type": "bool"
                    },
                    {
                        "name": "isFunded",
                        "type": "bool"
                    },
                    {
                        "name": "hasWhitelisting",
                        "type": "bool"
                    },
                    {
                        "name": "signerPublicAddress",
                        "type": {
                            "array": [
                                "u8",
                                20
                            ]
                        }
                    },
                    {
                        "name": "tokensAllocated",
                        "type": "u64"
                    },
                    {
                        "name": "paused",
                        "type": "bool"
                    },
                    {
                        "name": "unsoldTokensRedeemed",
                        "type": "bool"
                    },
                    {
                        "name": "feeAddress",
                        "type": {
                            "option": "publicKey"
                        }
                    }
                ]
            }
        },
        {
            "name": "purchase",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "purchaser",
                        "type": "publicKey"
                    },
                    {
                        "name": "ido",
                        "type": "publicKey"
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    },
                    {
                        "name": "wasFinalized",
                        "type": "bool"
                    },
                    {
                        "name": "reverted",
                        "type": "bool"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "costAmount",
                        "type": "u64"
                    },
                    {
                        "name": "amountRedeemed",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "whitelistAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "publicKey"
                    },
                    {
                        "name": "ido",
                        "type": "publicKey"
                    },
                    {
                        "name": "whitelisted",
                        "type": "bool"
                    },
                    {
                        "name": "blacklisted",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "stakingRewards",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "ido",
                        "type": "publicKey"
                    },
                    {
                        "name": "admin",
                        "type": "publicKey"
                    },
                    {
                        "name": "stakingToken",
                        "type": "publicKey"
                    },
                    {
                        "name": "rewardsToken",
                        "type": "publicKey"
                    },
                    {
                        "name": "periodFinish",
                        "type": "u64"
                    },
                    {
                        "name": "rewardRate",
                        "type": "u64"
                    },
                    {
                        "name": "rewardsDuration",
                        "type": "u64"
                    },
                    {
                        "name": "lastUpdateTime",
                        "type": "u64"
                    },
                    {
                        "name": "rewardPerTokenStored",
                        "type": "u128"
                    },
                    {
                        "name": "totalSupply",
                        "type": "u64"
                    },
                    {
                        "name": "rewardDistribution",
                        "type": "publicKey"
                    },
                    {
                        "name": "paused",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "stakingBalance",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "publicKey"
                    },
                    {
                        "name": "stakingRewards",
                        "type": "publicKey"
                    },
                    {
                        "name": "balanceStaked",
                        "type": "u64"
                    },
                    {
                        "name": "rewards",
                        "type": "u64"
                    },
                    {
                        "name": "userRewardPerTokenPaid",
                        "type": "u128"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "ListType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Whitelist"
                    },
                    {
                        "name": "Blacklist"
                    }
                ]
            }
        }
    ],
    "events": [
        {
            "name": "Pause",
            "fields": []
        },
        {
            "name": "Unpause",
            "fields": []
        },
        {
            "name": "PurchaseEvent",
            "fields": [
                {
                    "name": "amount",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "purchaser",
                    "type": "publicKey",
                    "index": true
                },
                {
                    "name": "timestamp",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "PurchaseEvent",
            "fields": [
                {
                    "name": "amount",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "purchaser",
                    "type": "publicKey",
                    "index": true
                },
                {
                    "name": "timestamp",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "PurchaseEvent",
            "fields": [
                {
                    "name": "amount",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "purchaser",
                    "type": "publicKey",
                    "index": true
                },
                {
                    "name": "timestamp",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "PurchaseEvent",
            "fields": [
                {
                    "name": "amount",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "purchaser",
                    "type": "publicKey",
                    "index": true
                },
                {
                    "name": "timestamp",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "RewardAdded",
            "fields": [
                {
                    "name": "reward",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "Staked",
            "fields": [
                {
                    "name": "user",
                    "type": "publicKey",
                    "index": true
                },
                {
                    "name": "amount",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "Withdrawn",
            "fields": [
                {
                    "name": "user",
                    "type": "publicKey",
                    "index": true
                },
                {
                    "name": "amount",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "RewardPaid",
            "fields": [
                {
                    "name": "user",
                    "type": "publicKey",
                    "index": true
                },
                {
                    "name": "reward",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "RewardsDurationUpdated",
            "fields": [
                {
                    "name": "newDuration",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "PauseStakingRewards",
            "fields": []
        },
        {
            "name": "UnpauseStakingRewards",
            "fields": []
        },
        {
            "name": "SetHasWhitelisting",
            "fields": [
                {
                    "name": "hasWhitelisting",
                    "type": "bool",
                    "index": false
                }
            ]
        },
        {
            "name": "AddedToWhitelist",
            "fields": [
                {
                    "name": "user",
                    "type": "publicKey",
                    "index": true
                }
            ]
        },
        {
            "name": "AddedToBlacklist",
            "fields": [
                {
                    "name": "user",
                    "type": "publicKey",
                    "index": true
                }
            ]
        },
        {
            "name": "RemovedFromWhitelist",
            "fields": [
                {
                    "name": "user",
                    "type": "publicKey",
                    "index": true
                }
            ]
        },
        {
            "name": "RemovedFromBlacklist",
            "fields": [
                {
                    "name": "user",
                    "type": "publicKey",
                    "index": true
                }
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "StartDateInThePast",
            "msg": "start date is in the past"
        },
        {
            "code": 6001,
            "name": "EndDateInThePast",
            "msg": "end date has to be in the future"
        },
        {
            "code": 6002,
            "name": "NoTokenForSale",
            "msg": "no token for sale"
        },
        {
            "code": 6003,
            "name": "TokensForSaleBelowMin",
            "msg": "tokensForSale < individual min"
        },
        {
            "code": 6004,
            "name": "MinimumRaiseExceedsTokensForSale",
            "msg": "minimumRaise > tokensForSale"
        },
        {
            "code": 6005,
            "name": "InvalidFeePercentage",
            "msg": "Fee Percentage has to be < 100"
        },
        {
            "code": 6006,
            "name": "UnsupportedFlagSet",
            "msg": "unsupported flags set"
        },
        {
            "code": 6007,
            "name": "VestingAlreadyStarted",
            "msg": "vesting already started"
        },
        {
            "code": 6008,
            "name": "VestingCliffBeforeEndDate",
            "msg": "vestingCliff before endDate"
        },
        {
            "code": 6009,
            "name": "VestingCliffExceedsVestingDuration",
            "msg": "vestingCliff > vestingDuration"
        },
        {
            "code": 6010,
            "name": "TotalVestingTimeOverTenYears",
            "msg": "total vesting time > 10 years"
        },
        {
            "code": 6011,
            "name": "VestingDurationIsZero",
            "msg": "vesting intervalls provided, but vestingDuration = 0"
        },
        {
            "code": 6012,
            "name": "FirstVestingPeriodOver100Percent",
            "msg": "first vesting period >= 100%"
        },
        {
            "code": 6013,
            "name": "NonAtomicSwap",
            "msg": "sale has to be non Atomic swap"
        },
        {
            "code": 6014,
            "name": "SaleNotFinalized",
            "msg": "sale has to be finalized"
        },
        {
            "code": 6015,
            "name": "SaleNotOpen",
            "msg": "sale has to be open"
        },
        {
            "code": 6016,
            "name": "NotBeforeStart",
            "msg": "not before start time/date"
        },
        {
            "code": 6017,
            "name": "SaleNotFunded",
            "msg": "token sale is not funded"
        },
        {
            "code": 6018,
            "name": "NotAdmin",
            "msg": "caller has not admin role"
        },
        {
            "code": 6019,
            "name": "NotWhitelistOwner",
            "msg": "caller is not WhitelistOwner"
        },
        {
            "code": 6020,
            "name": "NotWhitelistedOnChain",
            "msg": "not on on-chain whitelist"
        },
        {
            "code": 6021,
            "name": "NotWhitelistedOffChainOrWrongMaxAlloc",
            "msg": "not on off-chain whitelist or wrong max allocation"
        },
        {
            "code": 6022,
            "name": "InvalidWhitelistDataAccount",
            "msg": "invalid whitelist data account"
        },
        {
            "code": 6023,
            "name": "BlacklistedOnchain",
            "msg": "on-chain blacklisted"
        },
        {
            "code": 6024,
            "name": "Secp256k1ProgramInstructionMissing",
            "msg": "Secp256k1Program instruction not provided"
        },
        {
            "code": 6025,
            "name": "NotEnoughTokensForSale",
            "msg": "amount > tokens available"
        },
        {
            "code": 6026,
            "name": "AmountBelowMinimum",
            "msg": "amount < minimum amount"
        },
        {
            "code": 6027,
            "name": "AmountAboveMaximum",
            "msg": "amount > maximum amount"
        },
        {
            "code": 6028,
            "name": "IndividualMaxBelowIndividualMin",
            "msg": "individual max < min amount"
        },
        {
            "code": 6029,
            "name": "AmountOverIndividualMax",
            "msg": "amount goes over individual max"
        },
        {
            "code": 6030,
            "name": "EndDateBeforeStartDate",
            "msg": "end date before start date"
        },
        {
            "code": 6031,
            "name": "ExcessOfSaleTokens",
            "msg": "more tokens than needed for sale"
        },
        {
            "code": 6032,
            "name": "AddressIsNotPurchaser",
            "msg": "Address is not buyer"
        },
        {
            "code": 6033,
            "name": "VestingAmountCalculationInternalError",
            "msg": "INTERNAL ERROR in vesting amount calculation"
        },
        {
            "code": 6034,
            "name": "NotNonAtomicSwap",
            "msg": "has to be non Atomic swap"
        },
        {
            "code": 6035,
            "name": "TokenSaleNotFinalized",
            "msg": "token sale not finalized"
        },
        {
            "code": 6036,
            "name": "SaleIsPaused",
            "msg": "token sale contract is paused"
        },
        {
            "code": 6037,
            "name": "MinimumRaiseNotSet",
            "msg": "no minimum raise has been set"
        },
        {
            "code": 6038,
            "name": "MinimumRaiseReached",
            "msg": "minimum raise has been reached"
        },
        {
            "code": 6039,
            "name": "MinimumRaiseNotReached",
            "msg": "minimum raise not reached"
        },
        {
            "code": 6040,
            "name": "AllTokensAlreadyRedeemed",
            "msg": "all token already redeemed"
        },
        {
            "code": 6041,
            "name": "VestingNotStarted",
            "msg": "vesting period not yet started"
        },
        {
            "code": 6042,
            "name": "VestingCliffNotReached",
            "msg": "vesting cliff not yet reached"
        },
        {
            "code": 6043,
            "name": "NothingToRedeem",
            "msg": "nothing to redeem"
        },
        {
            "code": 6044,
            "name": "AmountRedeemedWouldBeLargerThanAmount",
            "msg": "INTERNAL ERROR : amountRedeemed would be larger then purchase amount"
        },
        {
            "code": 6045,
            "name": "PurchaseAmountIsZero",
            "msg": "purchase amount is zero"
        },
        {
            "code": 6046,
            "name": "PurchaseIsFinalized",
            "msg": "purchase is finalized"
        },
        {
            "code": 6047,
            "name": "UnsoldTokensRedeemed",
            "msg": "unsold tokens redeemed"
        },
        {
            "code": 6048,
            "name": "CannotStakeZero",
            "msg": "Cannot stake 0"
        },
        {
            "code": 6049,
            "name": "UserCannotDirectlyStake",
            "msg": "user can not directly stake"
        },
        {
            "code": 6050,
            "name": "CannotWithdrawZero",
            "msg": "Cannot withdraw 0"
        },
        {
            "code": 6051,
            "name": "RewardsPeriodNotFinished",
            "msg": "Previous rewards period must be complete before changing the duration for the new period"
        },
        {
            "code": 6052,
            "name": "NotRewardsDistribution",
            "msg": "Caller is not RewardsDistribution contract"
        },
        {
            "code": 6053,
            "name": "RewardTooHigh",
            "msg": "Provided reward too high"
        },
        {
            "code": 6054,
            "name": "IdoIsPaused",
            "msg": "IDO is paused"
        },
        {
            "code": 6055,
            "name": "IdoIsNotPaused",
            "msg": "IDO is not paused"
        },
        {
            "code": 6056,
            "name": "TestError",
            "msg": "testing error"
        }
    ]
};
