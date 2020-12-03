## Classes

<dl>
<dt><a href="#FixedSwapContract">FixedSwapContract</a> : <code>Object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#setNewOwner">setNewOwner(address)</a></dt>
<dd><p>Set New Owner of the Contract</p>
</dd>
<dt><a href="#owner">owner()</a> ⇒ <code>string</code></dt>
<dd><p>Get Owner of the Contract</p>
</dd>
<dt><a href="#isPaused">isPaused()</a> ⇒ <code>boolean</code></dt>
<dd><p>Get Owner of the Contract</p>
</dd>
<dt><a href="#pauseContract">pauseContract()</a> ⇒ <code>admin</code></dt>
<dd><p>Pause Contract</p>
</dd>
<dt><a href="#unpauseContract">unpauseContract()</a> ⇒ <code>admin</code></dt>
<dd><p>Unpause Contract</p>
</dd>
<dt><a href="#tradeValue">tradeValue()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get swapratio for the pool</p>
</dd>
<dt><a href="#startDate">startDate()</a> ⇒ <code>Date</code></dt>
<dd><p>Get Start Date of Pool</p>
</dd>
<dt><a href="#endDate">endDate()</a> ⇒ <code>Date</code></dt>
<dd><p>Get End Date of Pool</p>
</dd>
<dt><a href="#individualMinimumAmount">individualMinimumAmount()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Individual Minimum Amount for each address</p>
</dd>
<dt><a href="#individualMaximumAmount">individualMaximumAmount()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Individual Maximum Amount for each address</p>
</dd>
<dt><a href="#minimumRaise">minimumRaise()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Minimum Raise amount for Token Sale</p>
</dd>
<dt><a href="#tokensAllocated">tokensAllocated()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens Allocated already, therefore the tokens bought until now</p>
</dd>
<dt><a href="#tokensForSale">tokensForSale()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens Allocated/In Sale for the Pool</p>
</dd>
<dt><a href="#tokensAvailable">tokensAvailable()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens owned by the Pool</p>
</dd>
<dt><a href="#tokensLeft">tokensLeft()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens available to be sold in the pool</p>
</dd>
<dt><a href="#isTokenSwapAtomic">isTokenSwapAtomic()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Swap is atomic on this pool</p>
</dd>
<dt><a href="#isFunded">isFunded()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Sale is Funded with all Tokens proposed in tokensForSale</p>
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
<dt><a href="#isPreStart">isPreStart()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Sale in not open yet, where the admin can fund the pool</p>
</dd>
<dt><a href="#getPurchase">getPurchase(purchase_id)</a> ⇒ <code>Integer</code> | <code>Integer</code> | <code>Address</code> | <code>Integer</code> | <code>Date</code> | <code>Boolean</code> | <code>Boolean</code></dt>
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
<dt><a href="#getETHCostFromTokens">getETHCostFromTokens(tokenAmount)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get ETH Cost from Tokens Amount</p>
</dd>
<dt><a href="#swap">swap(tokenAmount)</a></dt>
<dd><p>Swap tokens by Ethereum</p>
</dd>
<dt><a href="#redeemTokens(isStandard)">redeemTokens(purchase_id)</a></dt>
<dd><p>Reedem tokens bought</p>
</dd>
<dt><a href="#redeemGivenMinimumGoalNotAchieved(isStandard)">redeemGivenMinimumGoalNotAchieved(purchase_id)</a></dt>
<dd><p>Reedem Ethereum from sale that did not achieve minimum goal</p>
</dd>
<dt><a href="#withdrawUnsoldTokens">withdrawUnsoldTokens()</a> ⇒ <code>admin</code></dt>
<dd><p>Withdraw unsold tokens of sale</p>
</dd>
<dt><a href="#withdrawFunds">withdrawFunds()</a> ⇒ <code>admin</code></dt>
<dd><p>Withdraw all funds from tokens sold</p>
</dd>
<dt><a href="#approveFundERC20">approveFundERC20()</a> ⇒ <code>admin</code></dt>
<dd><p>Approve the pool to use approved tokens for sale</p>
</dd>
<dt><a href="#isApproved">isApproved(tokenAmount, address)</a> ⇒ <code>admin</code> | <code>Boolean</code></dt>
<dd><p>Verify if the Admin has approved the pool to use receive the tokens for sale</p>
</dd>
<dt><a href="#fund">fund(tokenAmount)</a> ⇒ <code>admin</code></dt>
<dd><p>Send tokens to pool for sale, fund the sale</p>
</dd>
<dt><a href="#removeOtherERC20Tokens">removeOtherERC20Tokens(tokenAddress, toAddress)</a> ⇒ <code>admin</code></dt>
<dd><p>Remove Tokens from other ERC20 Address (in case of accident)</p>
</dd>
<dt><a href="#deploy">deploy(tradeValue, tokensForSale, startDate, endDate, individualMinimumAmount, individualMaximumAmount, isTokenSwapAtomic, minimumRaise, feeAmount)</a> ⇒ <code>admin</code></dt>
<dd><p>Deploy the Pool Contract</p>
</dd>
<dt><a href="#getOwner">getOwner(Address)</a> ⇒ <code>admin</code></dt>
<dd><p>Get owner address of contract</p>
</dd>
</dl>

<a name="FixedSwapContract"></a>

## FixedSwapContract : <code>Object</code>
**Kind**: global class  
<a name="new_FixedSwapContract_new"></a>

### new FixedSwapContract(web3, tokenAddress, decimals, contractAddress)
Fixed Swap Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| tokenAddress | <code>Address</code> |  |
| decimals | <code>Integer</code> |  |
| contractAddress | <code>Address</code> | ? (opt) |

<a name="setNewOwner"></a>

## setNewOwner(address)
Set New Owner of the Contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="owner"></a>

## owner() ⇒ <code>string</code>
Get Owner of the Contract

**Kind**: global function  
**Returns**: <code>string</code> - address  
<a name="isPaused"></a>

## isPaused() ⇒ <code>boolean</code>
Get Owner of the Contract

**Kind**: global function  
<a name="pauseContract"></a>

## pauseContract() ⇒ <code>admin</code>
Pause Contract

**Kind**: global function  
<a name="unpauseContract"></a>

## unpauseContract() ⇒ <code>admin</code>
Unpause Contract

**Kind**: global function  
<a name="tradeValue"></a>

## tradeValue() ⇒ <code>Integer</code>
Get swapratio for the pool

**Kind**: global function  
**Returns**: <code>Integer</code> - trade value against ETH  
<a name="startDate"></a>

## startDate() ⇒ <code>Date</code>
Get Start Date of Pool

**Kind**: global function  
<a name="endDate"></a>

## endDate() ⇒ <code>Date</code>
Get End Date of Pool

**Kind**: global function  
<a name="individualMinimumAmount"></a>

## individualMinimumAmount() ⇒ <code>Integer</code>
Get Individual Minimum Amount for each address

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
<a name="tokensAllocated"></a>

## tokensAllocated() ⇒ <code>Integer</code>
Get Total tokens Allocated already, therefore the tokens bought until now

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="tokensForSale"></a>

## tokensForSale() ⇒ <code>Integer</code>
Get Total tokens Allocated/In Sale for the Pool

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="tokensAvailable"></a>

## tokensAvailable() ⇒ <code>Integer</code>
Get Total tokens owned by the Pool

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="tokensLeft"></a>

## tokensLeft() ⇒ <code>Integer</code>
Get Total tokens available to be sold in the pool

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="isTokenSwapAtomic"></a>

## isTokenSwapAtomic() ⇒ <code>Boolean</code>
Verify if the Token Swap is atomic on this pool

**Kind**: global function  
<a name="isFunded"></a>

## isFunded() ⇒ <code>Boolean</code>
Verify if the Token Sale is Funded with all Tokens proposed in tokensForSale

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
<a name="isPreStart"></a>

## isPreStart() ⇒ <code>Boolean</code>
Verify if the Token Sale in not open yet, where the admin can fund the pool

**Kind**: global function  
<a name="getPurchase"></a>

## getPurchase(purchase_id) ⇒ <code>Integer</code> \| <code>Integer</code> \| <code>Address</code> \| <code>Integer</code> \| <code>Date</code> \| <code>Boolean</code> \| <code>Boolean</code>
Get Purchase based on ID

**Kind**: global function  
**Returns**: <code>Integer</code> - _id<code>Integer</code> - amount<code>Address</code> - purchaser<code>Integer</code> - ethAmount<code>Date</code> - timestamp<code>Boolean</code> - wasFinalized<code>Boolean</code> - reverted  

| Param | Type |
| --- | --- |
| purchase_id | <code>Integer</code> | 

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

<a name="getETHCostFromTokens"></a>

## getETHCostFromTokens(tokenAmount) ⇒ <code>Integer</code>
Get ETH Cost from Tokens Amount

**Kind**: global function  
**Returns**: <code>Integer</code> - ethAmount  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

<a name="swap"></a>

## swap(tokenAmount)
Swap tokens by Ethereum

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

<a name="redeemTokens(isStandard)"></a>

## redeemTokens(purchase_id)
Reedem tokens bought

**Kind**: global function  

| Param | Type |
| --- | --- |
| purchase_id | <code>Integer</code> | 

<a name="redeemGivenMinimumGoalNotAchieved(isStandard)"></a>

## redeemGivenMinimumGoalNotAchieved(purchase_id)
Reedem Ethereum from sale that did not achieve minimum goal

**Kind**: global function  

| Param | Type |
| --- | --- |
| purchase_id | <code>Integer</code> | 

<a name="withdrawUnsoldTokens"></a>

## withdrawUnsoldTokens() ⇒ <code>admin</code>
Withdraw unsold tokens of sale

**Kind**: global function  
<a name="withdrawFunds"></a>

## withdrawFunds() ⇒ <code>admin</code>
Withdraw all funds from tokens sold

**Kind**: global function  
<a name="approveFundERC20"></a>

## approveFundERC20() ⇒ <code>admin</code>
Approve the pool to use approved tokens for sale

**Kind**: global function  
<a name="isApproved"></a>

## isApproved(tokenAmount, address) ⇒ <code>admin</code> \| <code>Boolean</code>
Verify if the Admin has approved the pool to use receive the tokens for sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 
| address | <code>Address</code> | 

<a name="fund"></a>

## fund(tokenAmount) ⇒ <code>admin</code>
Send tokens to pool for sale, fund the sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

<a name="removeOtherERC20Tokens"></a>

## removeOtherERC20Tokens(tokenAddress, toAddress) ⇒ <code>admin</code>
Remove Tokens from other ERC20 Address (in case of accident)

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAddress | <code>Address</code> | 
| toAddress | <code>Address</code> | 

<a name="deploy"></a>

## deploy(tradeValue, tokensForSale, startDate, endDate, individualMinimumAmount, individualMaximumAmount, isTokenSwapAtomic, minimumRaise, feeAmount) ⇒ <code>admin</code>
Deploy the Pool Contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| tradeValue | <code>Integer</code> | 
| tokensForSale | <code>Integer</code> | 
| startDate | <code>Date</code> | 
| endDate | <code>Date</code> | 
| individualMinimumAmount | <code>Integer</code> | 
| individualMaximumAmount | <code>Integer</code> | 
| isTokenSwapAtomic | <code>Boolean</code> | 
| minimumRaise | <code>Integer</code> | 
| feeAmount | <code>Integer</code> | 

<a name="getOwner"></a>

## getOwner(Address) ⇒ <code>admin</code>
Get owner address of contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| Address | <code>Address</code> | 

