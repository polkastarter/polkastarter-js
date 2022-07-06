# polkastarter-js

polkastarter-js is package to integrate Polkastarter Ethereum Integrations

## Installation

Use the package manager [npm] to install npm.

```bash
npm i polkastarter-js
```

## Docs

[Docs](/docs)

## Usage

```javascript
import moment from 'moment';
import Application from 'polkastarter-js/src/models';

/* Test Version */
let app = new Application({test : true});

/* Create Contract */
let swapContract = app.getFixedSwapContract({tokenAddress : '0x3237fff7f25a354f68b2054a019c5a00135a8955', decimals : 18});

/* Deploy */
await swapContract.deploy({
    tradeValue : 0.001, 
    tokensForSale : 100, 
    startDate : moment().add(6, 'hours'),
    endDate : moment().add(16, 'hours'),
    isETHTrade : true // isETHTrade,
    ERC20TradingAddress : // optional,
    isPOLSWhitelist : false // optional (default : false)
});

/* User Swap */

/* a) (isETHTrade == false) */
/* 1 - swap */
await swapContract.swap({
    tokenAmount : 10 
});

/* b) (isETHTrade == false) */
/* 1 - verify if approved */
await swapContract.isApprovedSwapERC20({
    tokenAmount : 10 ,
    address : /* address to be approved - user address */
});

/* 2 - approve tx (if not approved) */
await swapContract.approveSwapERC20({
    tokenAmount : 10 
});

/* 3 - swap */
await swapContract.swap({
    tokenAmount : 10 
});

```

## Testing

To run the test suite vs a local chain (ganache):

```bash
npm test
```

To run the test suite vs a testnet real chain (Kovan, BNB Testnet, etc):

```bash
CHAIN_NAME=ETH npm test
```

## Testing old deployed pools

This test will check that the current PSJS doesn't break the read method from already deployed pools, legacy or not.

```bash
npm run test-pools
```

## License

[MIT](https://choosealicense.com/licenses/mit/)