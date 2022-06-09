## Classes

<dl>
<dt><a href="#FixedNFTSwapContract">FixedNFTSwapContract</a> ⇐ <code>BaseSwapContract</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#deploy">deploy(startDate, endDate, distributionDate, [individualMaximumAmount], [minimumRaise], [feePercentage], [hasWhitelisting], [ERC20TradingAddress], categoryIds, categoriesSupply, categoriesPrice, [tradingDecimals])</a></dt>
<dd><p>Deploy the NFT swap contract</p>
</dd>
<dt><a href="#swap">swap(tokenAmount, categoryId, maxAllocation, [signature])</a></dt>
<dd><p>Swap tokens by Ethereum or ERC20</p>
</dd>
<dt><a href="#setDistributionDate">setDistributionDate(distributionDate)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the distribution date for the pool</p>
</dd>
<dt><a href="#distributionDate">distributionDate()</a> ⇒ <code>Date</code></dt>
<dd><p>Get Distribution Date of NFT</p>
</dd>
<dt><a href="#hasDistributed">hasDistributed()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the NFTs are up for distribution, if the current date is after distributionDate</p>
</dd>
<dt><a href="#tokensForSale">tokensForSale(categoryId)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens for sale by category</p>
</dd>
<dt><a href="#soldByCategoryId">soldByCategoryId(categoryId)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens for sold by category</p>
</dd>
<dt><a href="#tokensAllocated">tokensAllocated()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens spent in the contract, therefore the tokens bought until now</p>
</dd>
<dt><a href="#tokensLeft">tokensLeft(categoryId)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens owned by category</p>
</dd>
<dt><a href="#totalCost">totalCost()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total cost for buying all the nfts</p>
</dd>
<dt><a href="#getCost">getCost(amount, categoryId)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Cost for category and amount</p>
</dd>
<dt><a href="#safePullTradeToken">safePullTradeToken()</a></dt>
<dd><p>Safe Pull all trading tokens</p>
</dd>
<dt><a href="#getUserPurchases">getUserPurchases(address)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getPurchase">getPurchase(purchaseId)</a> ⇒ <code>Integer</code> | <code>Integer</code> | <code>Integer</code> | <code>Integer</code> | <code>Address</code> | <code>Date</code> | <code>Boolean</code></dt>
<dd><p>Get Purchase based on ID</p>
</dd>
<dt><a href="#getBuyers">getBuyers()</a> ⇒ <code>Array</code> | <code>Integer</code></dt>
<dd><p>Get Buyers</p>
</dd>
<dt><a href="#getPurchaseIds">getPurchaseIds()</a> ⇒ <code>Array</code> | <code>Integer</code></dt>
<dd><p>Get All Purchase Ids</p>
</dd>
<dt><a href="#getPurchaseIds">getPurchaseIds(address)</a> ⇒ <code>Array</code> | <code>Integer</code></dt>
<dd><p>Get All Purchase Ids filter by Address/Purchaser</p>
</dd>
<dt><a href="#getIsClaimedCategoryForUser">getIsClaimedCategoryForUser(address, categoryId)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#setUserClaimedCategory">setUserClaimedCategory(address, categoryId)</a> ⇒ <code>admin</code></dt>
<dd><p>Sets user claimed category</p>
</dd>
<dt><a href="#categoryIds">categoryIds()</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd></dd>
<dt><a href="#setCategories">setCategories(categoryIds, categoriesSupply, categoriesPrice, tradingDecimals)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the categories oon the contract</p>
</dd>
</dl>

<a name="FixedNFTSwapContract"></a>

## FixedNFTSwapContract ⇐ <code>BaseSwapContract</code>
**Kind**: global class  
**Extends**: <code>BaseSwapContract</code>  
<a name="new_FixedNFTSwapContract_new"></a>

### new FixedNFTSwapContract(web3, contractAddress, [client])
Fixed NFT Swap Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| contractAddress | <code>Address</code> | ? (opt) |
| [client] | <code>Client</code> | Ethereum client |

<a name="deploy"></a>

## deploy(startDate, endDate, distributionDate, [individualMaximumAmount], [minimumRaise], [feePercentage], [hasWhitelisting], [ERC20TradingAddress], categoryIds, categoriesSupply, categoriesPrice, [tradingDecimals])
Deploy the NFT swap contract

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| startDate | <code>String</code> | Start date |
| endDate | <code>String</code> | End date |
| distributionDate | <code>String</code> | Distribution date |
| [individualMaximumAmount] | <code>Float</code> | Max cap per wallet. 0 to disable it. (Default: 0) |
| [minimumRaise] | <code>Float</code> | Soft cap (Default: 0) |
| [feePercentage] | <code>Float</code> | Fee percentage (Default: 1) |
| [hasWhitelisting] | <code>Boolean</code> | Has White Listing. (Default: false) |
| [ERC20TradingAddress] | <code>String</code> | Token to use in the swap (Default: 0x0000000000000000000000000000000000000000) |
| categoryIds | <code>Array.&lt;Number&gt;</code> | Ids of the NFT categories |
| categoriesSupply | <code>Array.&lt;Number&gt;</code> | Supply of every category of NFT in same order than Ids |
| categoriesPrice | <code>Array.&lt;Float&gt;</code> | Price per unit of a category item, in same order than Ids |
| [tradingDecimals] | <code>Number</code> | To be the decimals of the currency in case (ex : USDT -> 9; ETH -> 18) (Default: 0) |

<a name="swap"></a>

## swap(tokenAmount, categoryId, maxAllocation, [signature])
Swap tokens by Ethereum or ERC20

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tokenAmount | <code>Integer</code> |  |
| categoryId | <code>Integer</code> |  |
| maxAllocation | <code>Integer</code> |  |
| [signature] | <code>string</code> | Signature for the offchain whitelist |

<a name="setDistributionDate"></a>

## setDistributionDate(distributionDate) ⇒ <code>admin</code>
Modifies the distribution date for the pool

**Kind**: global function  

| Param | Type |
| --- | --- |
| distributionDate | <code>Date</code> | 

<a name="distributionDate"></a>

## distributionDate() ⇒ <code>Date</code>
Get Distribution Date of NFT

**Kind**: global function  
<a name="hasDistributed"></a>

## hasDistributed() ⇒ <code>Boolean</code>
Verify if the NFTs are up for distribution, if the current date is after distributionDate

**Kind**: global function  
<a name="tokensForSale"></a>

## tokensForSale(categoryId) ⇒ <code>Integer</code>
Get Total tokens for sale by category

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  

| Param | Type |
| --- | --- |
| categoryId | <code>Integer</code> | 

<a name="soldByCategoryId"></a>

## soldByCategoryId(categoryId) ⇒ <code>Integer</code>
Get Total tokens for sold by category

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  

| Param | Type |
| --- | --- |
| categoryId | <code>Integer</code> | 

<a name="tokensAllocated"></a>

## tokensAllocated() ⇒ <code>Integer</code>
Get Total tokens spent in the contract, therefore the tokens bought until now

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="tokensLeft"></a>

## tokensLeft(categoryId) ⇒ <code>Integer</code>
Get Total tokens owned by category

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  

| Param | Type |
| --- | --- |
| categoryId | <code>Integer</code> | 

<a name="totalCost"></a>

## totalCost() ⇒ <code>Integer</code>
Get Total cost for buying all the nfts

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="getCost"></a>

## getCost(amount, categoryId) ⇒ <code>Integer</code>
Get Cost for category and amount

**Kind**: global function  
**Returns**: <code>Integer</code> - costAmount  

| Param | Type |
| --- | --- |
| amount | <code>Integer</code> | 
| categoryId | <code>Integer</code> | 

<a name="safePullTradeToken"></a>

## safePullTradeToken()
Safe Pull all trading tokens

**Kind**: global function  
<a name="getUserPurchases"></a>

## getUserPurchases(address) ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - purchases  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="getPurchase"></a>

## getPurchase(purchaseId) ⇒ <code>Integer</code> \| <code>Integer</code> \| <code>Integer</code> \| <code>Integer</code> \| <code>Address</code> \| <code>Date</code> \| <code>Boolean</code>
Get Purchase based on ID

**Kind**: global function  
**Returns**: <code>Integer</code> - _id<code>Integer</code> - categoryId<code>Integer</code> - amount<code>Integer</code> - amountContributed<code>Address</code> - purchaser<code>Date</code> - timestamp<code>Boolean</code> - reverted  

| Param | Type |
| --- | --- |
| purchaseId | <code>Integer</code> | 

<a name="getBuyers"></a>

## getBuyers() ⇒ <code>Array</code> \| <code>Integer</code>
Get Buyers

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Integer</code> - _ids  
<a name="getPurchaseIds"></a>

## getPurchaseIds() ⇒ <code>Array</code> \| <code>Integer</code>
Get All Purchase Ids

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Integer</code> - _ids  
<a name="getPurchaseIds"></a>

## getPurchaseIds(address) ⇒ <code>Array</code> \| <code>Integer</code>
Get All Purchase Ids filter by Address/Purchaser

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Integer</code> - _ids  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="getIsClaimedCategoryForUser"></a>

## getIsClaimedCategoryForUser(address, categoryId) ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - claimed  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 
| categoryId | <code>Number</code> | 

<a name="setUserClaimedCategory"></a>

## setUserClaimedCategory(address, categoryId) ⇒ <code>admin</code>
Sets user claimed category

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 
| categoryId | <code>Number</code> | 

<a name="categoryIds"></a>

## categoryIds() ⇒ <code>Array.&lt;Number&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Number&gt;</code> - an array containig all category ids  
<a name="setCategories"></a>

## setCategories(categoryIds, categoriesSupply, categoriesPrice, tradingDecimals) ⇒ <code>admin</code>
Modifies the categories oon the contract

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| categoryIds | <code>Array.&lt;Number&gt;</code> | Ids of the NFT categories |
| categoriesSupply | <code>Array.&lt;Number&gt;</code> | Supply of every category of NFT in same order than Ids |
| categoriesPrice | <code>Array.&lt;Float&gt;</code> | Price per unit of a category item, in same order than Ids |
| tradingDecimals | <code>Number</code> | To be the decimals of the currency in case (ex : USDT -> 9; ETH -> 18) |

