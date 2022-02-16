## Classes

<dl>
<dt><a href="#FixedNFTSwapContract">FixedNFTSwapContract</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#addToBlacklist">addToBlacklist(address)</a></dt>
<dd><p>Adds an address to the blacklist</p>
</dd>
<dt><a href="#removeFromBlacklist">removeFromBlacklist(address)</a></dt>
<dd><p>Removes an address from the blacklist</p>
</dd>
<dt><a href="#isBlackListed">isBlackListed(address)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if the address is in the blacklist</p>
</dd>
<dt><a href="#isPaused">isPaused()</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns if the contract is paused or not</p>
</dd>
<dt><a href="#pauseContract">pauseContract()</a> ⇒ <code>admin</code></dt>
<dd><p>Pause Contract</p>
</dd>
<dt><a href="#unpauseContract">unpauseContract()</a> ⇒ <code>admin</code></dt>
<dd><p>Unpause Contract</p>
</dd>
<dt><a href="#startDate">startDate()</a> ⇒ <code>Date</code></dt>
<dd><p>Get Start Date of Change</p>
</dd>
<dt><a href="#endDate">endDate()</a> ⇒ <code>Date</code></dt>
<dd><p>Get End Date of Change</p>
</dd>
<dt><a href="#distributionDate">distributionDate()</a> ⇒ <code>Date</code></dt>
<dd><p>Get Distribution Date of NFT</p>
</dd>
<dt><a href="#isFinalized">isFinalized()</a> ⇒ <code>Boolean</code></dt>
<dd><p>To see if contract was finalized</p>
</dd>
<dt><a href="#individualMaximumAmount">individualMaximumAmount()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Individual Maximum Amount for each address</p>
</dd>
<dt><a href="#minimumRaise">minimumRaise()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Minimum Raise amount for Token Sale</p>
</dd>
<dt><a href="#hasMinimumRaise">hasMinimumRaise()</a> ⇒ <code>Boolean</code></dt>
<dd><p>See if hasMinimumRaise</p>
</dd>
<dt><a href="#minimumReached">minimumReached()</a> ⇒ <code>Integer</code></dt>
<dd><p>See if minimumRaise was Reached</p>
</dd>
<dt><a href="#tokensAllocated">tokensAllocated()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens spent in the contract, therefore the tokens bought until now</p>
</dd>
<dt><a href="#tokensForSale">tokensForSale(categoryId)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens for sale by category</p>
</dd>
<dt><a href="#soldByCategoryId">soldByCategoryId(categoryId)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens for sold by category</p>
</dd>
<dt><a href="#tokensLeft">tokensLeft(categoryId)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens owned by category</p>
</dd>
<dt><a href="#totalCost">totalCost()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total cost for buying all the nfts</p>
</dd>
<dt><a href="#categoryIds">categoryIds()</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd></dd>
<dt><a href="#withdrawFunds">withdrawFunds()</a></dt>
<dd><p>Withdraw all funds from tokens sold</p>
</dd>
<dt><a href="#setSignerPublicAddress">setSignerPublicAddress(address)</a></dt>
<dd><p>Set the public address of the signer</p>
</dd>
<dt><a href="#signerPublicAddress">signerPublicAddress()</a> ⇒ <code>string</code></dt>
<dd><p>Get the public address of the signer</p>
</dd>
<dt><a href="#withdrawableFunds">withdrawableFunds()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total funds raised to be withdrawn by the admin</p>
</dd>
<dt><a href="#hasWhitelisting">hasWhitelisting()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if swap has whitelisting</p>
</dd>
<dt><a href="#isWhitelisted">isWhitelisted(address)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if address is whitelisted</p>
</dd>
<dt><a href="#wereUnsoldTokensReedemed">wereUnsoldTokensReedemed()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the admin already reemeded unsold tokens</p>
</dd>
<dt><a href="#isOpen">isOpen()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Sale is Open for Swap</p>
</dd>
<dt><a href="#hasStarted">hasStarted()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Sale has started the Swap</p>
</dd>
<dt><a href="#hasFinalized">hasFinalized()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Sale has finalized, if the current date is after endDate</p>
</dd>
<dt><a href="#hasDistributed">hasDistributed()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the NFTs are up for distribution, if the current date is after distributionDate</p>
</dd>
<dt><a href="#isETHTrade">isETHTrade()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if Token Sale is against Ethereum</p>
</dd>
<dt><a href="#getTradingDecimals">getTradingDecimals()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Trading Decimals (18 if isETHTrade, X if not)</p>
</dd>
<dt><a href="#getTradingERC20Address">getTradingERC20Address()</a> ⇒ <code>Address</code></dt>
<dd><p>Get Trading Address if ERC20</p>
</dd>
<dt><a href="#isPreStart">isPreStart()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Sale in not open yet</p>
</dd>
<dt><a href="#getUserPurchases">getUserPurchases(address)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#getPurchase">getPurchase(purchase_id)</a> ⇒ <code>Integer</code> | <code>Integer</code> | <code>Integer</code> | <code>Integer</code> | <code>Address</code> | <code>Date</code> | <code>Boolean</code></dt>
<dd><p>Get Purchase based on ID</p>
</dd>
<dt><a href="#getWhiteListedAddresses">getWhiteListedAddresses()</a> ⇒ <code>Array</code> | <code>Address</code></dt>
<dd><p>Get Whitelisted Addresses</p>
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
<dt><a href="#getCost">getCost(amount, categoryId)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Cost for category and amount</p>
</dd>
<dt><a href="#swap">swap(tokenAmount, categoryId, maxAllocation, [signature])</a></dt>
<dd><p>Swap tokens by Ethereum or ERC20</p>
</dd>
<dt><a href="#redeemGivenMinimumGoalNotAchieved(isStandard)">redeemGivenMinimumGoalNotAchieved(purchase_id)</a></dt>
<dd><p>Reedem Ethereum from sale that did not achieve minimum goal</p>
</dd>
<dt><a href="#setUserClaimedCategory">setUserClaimedCategory(address, categoryId)</a> ⇒ <code>admin</code></dt>
<dd><p>Sets user claimed category</p>
</dd>
<dt><a href="#setIndividualMaximumAmount">setIndividualMaximumAmount(individualMaximumAmount)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the max allocation</p>
</dd>
<dt><a href="#setEndDate">setEndDate(endDate)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the end date for the pool</p>
</dd>
<dt><a href="#setStartDate">setStartDate(startDate)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the start date for the pool</p>
</dd>
<dt><a href="#setDistributionDate">setDistributionDate(distributionDate)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the distribution date for the pool</p>
</dd>
<dt><a href="#setCategories">setCategories(categoryIds, categoriesSupply, categoriesPrice, tradingDecimals)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the categories oon the contract</p>
</dd>
<dt><a href="#setHasWhitelisting">setHasWhitelisting(hasWhitelist)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies if the pool has whitelisting or not</p>
</dd>
<dt><a href="#approveSwapERC20">approveSwapERC20(tokenAmount)</a></dt>
<dd><p>Approve the investor to use approved tokens for the sale</p>
</dd>
<dt><a href="#isApprovedSwapERC20">isApprovedSwapERC20(tokenAmount, address)</a></dt>
<dd><p>Verify if it is approved to invest</p>
</dd>
<dt><a href="#isApproved">isApproved(tokenAmount, address)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Admin has approved the pool to use receive the tokens for sale</p>
</dd>
<dt><a href="#addWhitelistedAddress">addWhitelistedAddress(Addresses)</a></dt>
<dd><p>add WhiteListed Address</p>
</dd>
<dt><a href="#removeWhitelistedAddress">removeWhitelistedAddress(addresses, index)</a></dt>
<dd><p>remove WhiteListed Address</p>
</dd>
<dt><a href="#safePullETH">safePullETH()</a></dt>
<dd><p>Safe Pull all ETH</p>
</dd>
<dt><a href="#safePullTradeToken">safePullTradeToken()</a></dt>
<dd><p>Safe Pull all trading tokens</p>
</dd>
<dt><a href="#removeOtherERC20Tokens">removeOtherERC20Tokens(tokenAddress, toAddress)</a></dt>
<dd><p>Remove Tokens from other ERC20 Address (in case of accident)</p>
</dd>
<dt><a href="#deploy">deploy(startDate, endDate, distributionDate, [individualMaximumAmount], [minimumRaise], [feePercentage], [hasWhitelisting], [ERC20TradingAddress], categoryIds, categoriesSupply, categoriesPrice, [tradingDecimals])</a></dt>
<dd><p>Deploy the NFT swap contract</p>
</dd>
<dt><a href="#getSmartContractVersion">getSmartContractVersion(Address)</a></dt>
<dd><p>Returns the version of the smart contract that is currently inside psjs</p>
</dd>
<dt><a href="#getBalance">getBalance(Balance)</a></dt>
<dd><p>Get Balance of Contract</p>
</dd>
</dl>

<a name="FixedNFTSwapContract"></a>

## FixedNFTSwapContract
**Kind**: global class  
<a name="new_FixedNFTSwapContract_new"></a>

### new FixedNFTSwapContract(web3, contractAddress)
Fixed NFT Swap Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| contractAddress | <code>Address</code> | ? (opt) |

<a name="addToBlacklist"></a>

## addToBlacklist(address)
Adds an address to the blacklist

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="removeFromBlacklist"></a>

## removeFromBlacklist(address)
Removes an address from the blacklist

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="isBlackListed"></a>

## isBlackListed(address) ⇒ <code>boolean</code>
Returns true if the address is in the blacklist

**Kind**: global function  
**Returns**: <code>boolean</code> - isBlackListed  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="isPaused"></a>

## isPaused() ⇒ <code>boolean</code>
Returns if the contract is paused or not

**Kind**: global function  
<a name="pauseContract"></a>

## pauseContract() ⇒ <code>admin</code>
Pause Contract

**Kind**: global function  
<a name="unpauseContract"></a>

## unpauseContract() ⇒ <code>admin</code>
Unpause Contract

**Kind**: global function  
<a name="startDate"></a>

## startDate() ⇒ <code>Date</code>
Get Start Date of Change

**Kind**: global function  
<a name="endDate"></a>

## endDate() ⇒ <code>Date</code>
Get End Date of Change

**Kind**: global function  
<a name="distributionDate"></a>

## distributionDate() ⇒ <code>Date</code>
Get Distribution Date of NFT

**Kind**: global function  
<a name="isFinalized"></a>

## isFinalized() ⇒ <code>Boolean</code>
To see if contract was finalized

**Kind**: global function  
<a name="individualMaximumAmount"></a>

## individualMaximumAmount() ⇒ <code>Integer</code>
Get Individual Maximum Amount for each address

**Kind**: global function  
<a name="minimumRaise"></a>

## minimumRaise() ⇒ <code>Integer</code>
Get Minimum Raise amount for Token Sale

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="hasMinimumRaise"></a>

## hasMinimumRaise() ⇒ <code>Boolean</code>
See if hasMinimumRaise

**Kind**: global function  
<a name="minimumReached"></a>

## minimumReached() ⇒ <code>Integer</code>
See if minimumRaise was Reached

**Kind**: global function  
<a name="tokensAllocated"></a>

## tokensAllocated() ⇒ <code>Integer</code>
Get Total tokens spent in the contract, therefore the tokens bought until now

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
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
<a name="categoryIds"></a>

## categoryIds() ⇒ <code>Array.&lt;Number&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Number&gt;</code> - an array containig all category ids  
<a name="withdrawFunds"></a>

## withdrawFunds()
Withdraw all funds from tokens sold

**Kind**: global function  
<a name="setSignerPublicAddress"></a>

## setSignerPublicAddress(address)
Set the public address of the signer

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="signerPublicAddress"></a>

## signerPublicAddress() ⇒ <code>string</code>
Get the public address of the signer

**Kind**: global function  
**Returns**: <code>string</code> - address  
<a name="withdrawableFunds"></a>

## withdrawableFunds() ⇒ <code>Integer</code>
Get Total funds raised to be withdrawn by the admin

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in ETH  
<a name="hasWhitelisting"></a>

## hasWhitelisting() ⇒ <code>Boolean</code>
Verify if swap has whitelisting

**Kind**: global function  
<a name="isWhitelisted"></a>

## isWhitelisted(address) ⇒ <code>Boolean</code>
Verify if address is whitelisted

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="wereUnsoldTokensReedemed"></a>

## wereUnsoldTokensReedemed() ⇒ <code>Boolean</code>
Verify if the admin already reemeded unsold tokens

**Kind**: global function  
<a name="isOpen"></a>

## isOpen() ⇒ <code>Boolean</code>
Verify if the Token Sale is Open for Swap

**Kind**: global function  
<a name="hasStarted"></a>

## hasStarted() ⇒ <code>Boolean</code>
Verify if the Token Sale has started the Swap

**Kind**: global function  
<a name="hasFinalized"></a>

## hasFinalized() ⇒ <code>Boolean</code>
Verify if the Token Sale has finalized, if the current date is after endDate

**Kind**: global function  
<a name="hasDistributed"></a>

## hasDistributed() ⇒ <code>Boolean</code>
Verify if the NFTs are up for distribution, if the current date is after distributionDate

**Kind**: global function  
<a name="isETHTrade"></a>

## isETHTrade() ⇒ <code>Boolean</code>
Verify if Token Sale is against Ethereum

**Kind**: global function  
<a name="getTradingDecimals"></a>

## getTradingDecimals() ⇒ <code>Integer</code>
Get Trading Decimals (18 if isETHTrade, X if not)

**Kind**: global function  
<a name="getTradingERC20Address"></a>

## getTradingERC20Address() ⇒ <code>Address</code>
Get Trading Address if ERC20

**Kind**: global function  
<a name="isPreStart"></a>

## isPreStart() ⇒ <code>Boolean</code>
Verify if the Token Sale in not open yet

**Kind**: global function  
<a name="getUserPurchases"></a>

## getUserPurchases(address) ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - purchases  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="getPurchase"></a>

## getPurchase(purchase_id) ⇒ <code>Integer</code> \| <code>Integer</code> \| <code>Integer</code> \| <code>Integer</code> \| <code>Address</code> \| <code>Date</code> \| <code>Boolean</code>
Get Purchase based on ID

**Kind**: global function  
**Returns**: <code>Integer</code> - _id<code>Integer</code> - categoryId<code>Integer</code> - amount<code>Integer</code> - amountContributed<code>Address</code> - purchaser<code>Date</code> - timestamp<code>Boolean</code> - reverted  

| Param | Type |
| --- | --- |
| purchase_id | <code>Integer</code> | 

<a name="getWhiteListedAddresses"></a>

## getWhiteListedAddresses() ⇒ <code>Array</code> \| <code>Address</code>
Get Whitelisted Addresses

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Address</code> - addresses  
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

<a name="getCost"></a>

## getCost(amount, categoryId) ⇒ <code>Integer</code>
Get Cost for category and amount

**Kind**: global function  
**Returns**: <code>Integer</code> - costAmount  

| Param | Type |
| --- | --- |
| amount | <code>Integer</code> | 
| categoryId | <code>Integer</code> | 

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

<a name="redeemGivenMinimumGoalNotAchieved(isStandard)"></a>

## redeemGivenMinimumGoalNotAchieved(purchase_id)
Reedem Ethereum from sale that did not achieve minimum goal

**Kind**: global function  

| Param | Type |
| --- | --- |
| purchase_id | <code>Integer</code> | 

<a name="setUserClaimedCategory"></a>

## setUserClaimedCategory(address, categoryId) ⇒ <code>admin</code>
Sets user claimed category

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 
| categoryId | <code>Number</code> | 

<a name="setIndividualMaximumAmount"></a>

## setIndividualMaximumAmount(individualMaximumAmount) ⇒ <code>admin</code>
Modifies the max allocation

**Kind**: global function  

| Param | Type |
| --- | --- |
| individualMaximumAmount | <code>Integer</code> | 

<a name="setEndDate"></a>

## setEndDate(endDate) ⇒ <code>admin</code>
Modifies the end date for the pool

**Kind**: global function  

| Param | Type |
| --- | --- |
| endDate | <code>Date</code> | 

<a name="setStartDate"></a>

## setStartDate(startDate) ⇒ <code>admin</code>
Modifies the start date for the pool

**Kind**: global function  

| Param | Type |
| --- | --- |
| startDate | <code>Date</code> | 

<a name="setDistributionDate"></a>

## setDistributionDate(distributionDate) ⇒ <code>admin</code>
Modifies the distribution date for the pool

**Kind**: global function  

| Param | Type |
| --- | --- |
| distributionDate | <code>Date</code> | 

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

<a name="setHasWhitelisting"></a>

## setHasWhitelisting(hasWhitelist) ⇒ <code>admin</code>
Modifies if the pool has whitelisting or not

**Kind**: global function  

| Param | Type |
| --- | --- |
| hasWhitelist | <code>boolean</code> | 

<a name="approveSwapERC20"></a>

## approveSwapERC20(tokenAmount)
Approve the investor to use approved tokens for the sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

<a name="isApprovedSwapERC20"></a>

## isApprovedSwapERC20(tokenAmount, address)
Verify if it is approved to invest

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 
| address | <code>Address</code> | 

<a name="isApproved"></a>

## isApproved(tokenAmount, address) ⇒ <code>Boolean</code>
Verify if the Admin has approved the pool to use receive the tokens for sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 
| address | <code>Address</code> | 

<a name="addWhitelistedAddress"></a>

## addWhitelistedAddress(Addresses)
add WhiteListed Address

**Kind**: global function  

| Param | Type |
| --- | --- |
| Addresses | <code>Array</code> \| <code>Addresses</code> | 

<a name="removeWhitelistedAddress"></a>

## removeWhitelistedAddress(addresses, index)
remove WhiteListed Address

**Kind**: global function  

| Param | Type |
| --- | --- |
| addresses | <code>Array</code> \| <code>Addresses</code> | 
| index | <code>Integer</code> | 

<a name="safePullETH"></a>

## safePullETH()
Safe Pull all ETH

**Kind**: global function  
<a name="safePullTradeToken"></a>

## safePullTradeToken()
Safe Pull all trading tokens

**Kind**: global function  
<a name="removeOtherERC20Tokens"></a>

## removeOtherERC20Tokens(tokenAddress, toAddress)
Remove Tokens from other ERC20 Address (in case of accident)

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAddress | <code>Address</code> | 
| toAddress | <code>Address</code> | 

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

<a name="getSmartContractVersion"></a>

## getSmartContractVersion(Address)
Returns the version of the smart contract that is currently inside psjs

**Kind**: global function  

| Param | Type |
| --- | --- |
| Address | <code>Address</code> | 

<a name="getBalance"></a>

## getBalance(Balance)
Get Balance of Contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| Balance | <code>Integer</code> | 

