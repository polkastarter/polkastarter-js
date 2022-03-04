## Classes

<dl>
<dt><a href="#BaseSwapContract">BaseSwapContract</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#hasWhitelisting">hasWhitelisting()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if swap has whitelisting</p>
</dd>
<dt><a href="#isWhitelisted">isWhitelisted(address)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if address is whitelisted</p>
</dd>
<dt><a href="#setHasWhitelisting">setHasWhitelisting(hasWhitelist)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies if the pool has whitelisting or not</p>
</dd>
<dt><a href="#addWhitelistedAddress">addWhitelistedAddress(address)</a></dt>
<dd><p>add WhiteListed Address</p>
</dd>
<dt><a href="#removeWhitelistedAddress">removeWhitelistedAddress(addresses, index)</a></dt>
<dd><p>remove WhiteListed Address</p>
</dd>
<dt><a href="#setSignerPublicAddress">setSignerPublicAddress(address)</a></dt>
<dd><p>Set the public address of the signer</p>
</dd>
<dt><a href="#signerPublicAddress">signerPublicAddress()</a> ⇒ <code>string</code></dt>
<dd><p>Get the public address of the signer</p>
</dd>
<dt><a href="#getWhiteListedAddresses">getWhiteListedAddresses()</a> ⇒ <code>Array</code> | <code>Address</code></dt>
<dd><p>Get Whitelisted Addresses</p>
</dd>
<dt><a href="#getBalance">getBalance(Balance)</a></dt>
<dd><p>Get Balance of Contract</p>
</dd>
<dt><a href="#removeOtherERC20Tokens">removeOtherERC20Tokens(tokenAddress, toAddress)</a></dt>
<dd><p>Remove Tokens from other ERC20 Address (in case of accident)</p>
</dd>
<dt><a href="#minimumRaise">minimumRaise()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Minimum Raise amount for Token Sale</p>
</dd>
<dt><a href="#hasMinimumRaise">hasMinimumRaise()</a> ⇒ <code>Boolean</code></dt>
<dd><p>See if hasMinimumRaise</p>
</dd>
<dt><a href="#minimumReached">minimumReached()</a> ⇒ <code>Boolean</code></dt>
<dd><p>See if minimumRaise was Reached</p>
</dd>
<dt><a href="#tokensAllocated">tokensAllocated()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens spent in the contract, therefore the tokens bought until now</p>
</dd>
<dt><a href="#safePull">safePull()</a></dt>
<dd><p>Safe Pull all tokens &amp; ETH</p>
</dd>
<dt><a href="#withdrawFunds">withdrawFunds()</a></dt>
<dd><p>Withdraw all funds from tokens sold</p>
</dd>
<dt><a href="#withdrawableFunds">withdrawableFunds()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total funds raised to be withdrawn by the admin</p>
</dd>
<dt><a href="#wereUnsoldTokensReedemed">wereUnsoldTokensReedemed()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the admin already reemeded unsold tokens</p>
</dd>
<dt><a href="#redeemGivenMinimumGoalNotAchieved(isStandard)">redeemGivenMinimumGoalNotAchieved(purchaseId)</a></dt>
<dd><p>Reedem Ethereum from sale that did not achieve minimum goal</p>
</dd>
<dt><a href="#setIndividualMaximumAmount">setIndividualMaximumAmount(individualMaximumAmount)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the max allocation</p>
</dd>
<dt><a href="#individualMaximumAmount">individualMaximumAmount()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Individual Maximum Amount for each address</p>
</dd>
<dt><a href="#isApproved">isApproved(tokenAmount, address)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Admin has approved the pool to use receive the tokens for sale</p>
</dd>
<dt><a href="#isApprovedSwapERC20">isApprovedSwapERC20(tokenAmount, address)</a></dt>
<dd><p>Verify if it is approved to invest</p>
</dd>
<dt><a href="#approveSwapERC20">approveSwapERC20(tokenAmount)</a></dt>
<dd><p>Approve the investor to use approved tokens for the sale</p>
</dd>
<dt><a href="#getTradingERC20Address">getTradingERC20Address()</a> ⇒ <code>Address</code></dt>
<dd><p>Get Trading Address if ERC20</p>
</dd>
<dt><a href="#isETHTrade">isETHTrade()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if Token Sale is against Ethereum</p>
</dd>
<dt><a href="#getTradingDecimals">getTradingDecimals()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Trading Decimals (18 if isETHTrade, X if not)</p>
</dd>
<dt><a href="#startDate">startDate()</a> ⇒ <code>Date</code></dt>
<dd><p>Get Start Date of Change</p>
</dd>
<dt><a href="#endDate">endDate()</a> ⇒ <code>Date</code></dt>
<dd><p>Get End Date of Change</p>
</dd>
<dt><a href="#setEndDate">setEndDate(endDate)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the end date for the pool</p>
</dd>
<dt><a href="#setStartDate">setStartDate(startDate)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the start date for the pool</p>
</dd>
<dt><a href="#isFinalized">isFinalized()</a> ⇒ <code>Boolean</code></dt>
<dd><p>To see if contract was finalized</p>
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
<dd><p>Verify if the Token Sale in not open yet</p>
</dd>
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
<dt><a href="#getSmartContractVersion">getSmartContractVersion(Address)</a></dt>
<dd><p>Returns the version of the smart contract that is currently inside psjs</p>
</dd>
</dl>

<a name="BaseSwapContract"></a>

## BaseSwapContract
**Kind**: global class  
<a name="new_BaseSwapContract_new"></a>

### new BaseSwapContract(web3, contractAddress)
Base Swap Contract Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| contractAddress | <code>Address</code> | ? (opt) |

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

<a name="setHasWhitelisting"></a>

## setHasWhitelisting(hasWhitelist) ⇒ <code>admin</code>
Modifies if the pool has whitelisting or not

**Kind**: global function  

| Param | Type |
| --- | --- |
| hasWhitelist | <code>boolean</code> | 

<a name="addWhitelistedAddress"></a>

## addWhitelistedAddress(address)
add WhiteListed Address

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="removeWhitelistedAddress"></a>

## removeWhitelistedAddress(addresses, index)
remove WhiteListed Address

**Kind**: global function  

| Param | Type |
| --- | --- |
| addresses | <code>Array</code> \| <code>Addresses</code> | 
| index | <code>Integer</code> | 

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
<a name="getWhiteListedAddresses"></a>

## getWhiteListedAddresses() ⇒ <code>Array</code> \| <code>Address</code>
Get Whitelisted Addresses

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Address</code> - addresses  
<a name="getBalance"></a>

## getBalance(Balance)
Get Balance of Contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| Balance | <code>Integer</code> | 

<a name="removeOtherERC20Tokens"></a>

## removeOtherERC20Tokens(tokenAddress, toAddress)
Remove Tokens from other ERC20 Address (in case of accident)

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAddress | <code>Address</code> | 
| toAddress | <code>Address</code> | 

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

## minimumReached() ⇒ <code>Boolean</code>
See if minimumRaise was Reached

**Kind**: global function  
<a name="tokensAllocated"></a>

## tokensAllocated() ⇒ <code>Integer</code>
Get Total tokens spent in the contract, therefore the tokens bought until now

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="safePull"></a>

## safePull()
Safe Pull all tokens & ETH

**Kind**: global function  
<a name="withdrawFunds"></a>

## withdrawFunds()
Withdraw all funds from tokens sold

**Kind**: global function  
<a name="withdrawableFunds"></a>

## withdrawableFunds() ⇒ <code>Integer</code>
Get Total funds raised to be withdrawn by the admin

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in ETH  
<a name="wereUnsoldTokensReedemed"></a>

## wereUnsoldTokensReedemed() ⇒ <code>Boolean</code>
Verify if the admin already reemeded unsold tokens

**Kind**: global function  
<a name="redeemGivenMinimumGoalNotAchieved(isStandard)"></a>

## redeemGivenMinimumGoalNotAchieved(purchaseId)
Reedem Ethereum from sale that did not achieve minimum goal

**Kind**: global function  

| Param | Type |
| --- | --- |
| purchaseId | <code>Integer</code> | 

<a name="setIndividualMaximumAmount"></a>

## setIndividualMaximumAmount(individualMaximumAmount) ⇒ <code>admin</code>
Modifies the max allocation

**Kind**: global function  

| Param | Type |
| --- | --- |
| individualMaximumAmount | <code>Integer</code> | 

<a name="individualMaximumAmount"></a>

## individualMaximumAmount() ⇒ <code>Integer</code>
Get Individual Maximum Amount for each address

**Kind**: global function  
<a name="isApproved"></a>

## isApproved(tokenAmount, address) ⇒ <code>Boolean</code>
Verify if the Admin has approved the pool to use receive the tokens for sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 
| address | <code>Address</code> | 

<a name="isApprovedSwapERC20"></a>

## isApprovedSwapERC20(tokenAmount, address)
Verify if it is approved to invest

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 
| address | <code>Address</code> | 

<a name="approveSwapERC20"></a>

## approveSwapERC20(tokenAmount)
Approve the investor to use approved tokens for the sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

<a name="getTradingERC20Address"></a>

## getTradingERC20Address() ⇒ <code>Address</code>
Get Trading Address if ERC20

**Kind**: global function  
<a name="isETHTrade"></a>

## isETHTrade() ⇒ <code>Boolean</code>
Verify if Token Sale is against Ethereum

**Kind**: global function  
<a name="getTradingDecimals"></a>

## getTradingDecimals() ⇒ <code>Integer</code>
Get Trading Decimals (18 if isETHTrade, X if not)

**Kind**: global function  
<a name="startDate"></a>

## startDate() ⇒ <code>Date</code>
Get Start Date of Change

**Kind**: global function  
<a name="endDate"></a>

## endDate() ⇒ <code>Date</code>
Get End Date of Change

**Kind**: global function  
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

<a name="isFinalized"></a>

## isFinalized() ⇒ <code>Boolean</code>
To see if contract was finalized

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
Verify if the Token Sale in not open yet

**Kind**: global function  
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
<a name="getSmartContractVersion"></a>

## getSmartContractVersion(Address)
Returns the version of the smart contract that is currently inside psjs

**Kind**: global function  

| Param | Type |
| --- | --- |
| Address | <code>Address</code> | 

