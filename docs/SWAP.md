## Classes

<dl>
<dt><a href="#FixedSwapContract">FixedSwapContract</a></dt>
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
<dt><a href="#erc20">erc20()</a> ⇒ <code>Address</code></dt>
<dd><p>Get Token Address</p>
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
<dt><a href="#isFinalized">isFinalized()</a> ⇒ <code>Boolean</code></dt>
<dd><p>To see if contract was finalized</p>
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
<dt><a href="#hasMinimumRaise">hasMinimumRaise()</a> ⇒ <code>Boolea</code></dt>
<dd><p>See if hasMinimumRaise</p>
</dd>
<dt><a href="#minimumReached">minimumReached()</a> ⇒ <code>Integer</code></dt>
<dd><p>See if minimumRaise was Reached</p>
</dd>
<dt><a href="#tokensAvailable">tokensAvailable()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens owned by the Pool</p>
</dd>
<dt><a href="#tokensLeft">tokensLeft()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens available to be sold in the pool</p>
</dd>
<dt><a href="#setSignerPublicAddress">setSignerPublicAddress(address)</a></dt>
<dd><p>Set the public address of the signer</p>
</dd>
<dt><a href="#signerPublicAddress">signerPublicAddress()</a> ⇒ <code>string</code></dt>
<dd><p>Get the public address of the signer</p>
</dd>
<dt><a href="#withdrawableUnsoldTokens">withdrawableUnsoldTokens()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens available to be withdrawn by the admin</p>
</dd>
<dt><a href="#withdrawableFunds">withdrawableFunds()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total funds raised to be withdrawn by the admin</p>
</dd>
<dt><a href="#isTokenSwapAtomic">isTokenSwapAtomic()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Swap is atomic on this pool</p>
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
<dt><a href="#isETHTrade">isETHTrade()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if Token Sale is against Ethereum</p>
</dd>
<dt><a href="#isPOLSWhitelisted">isPOLSWhitelisted()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if Token Sale is POLS Whitelisted</p>
</dd>
<dt><a href="#isAddressPOLSWhitelisted">isAddressPOLSWhitelisted()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if Address is Whitelisted by POLS (returns false if not needed)</p>
</dd>
<dt><a href="#getTradingDecimals">getTradingDecimals()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Trading Decimals (18 if isETHTrade, X if not)</p>
</dd>
<dt><a href="#getTradingERC20Address">getTradingERC20Address()</a> ⇒ <code>Address</code></dt>
<dd><p>Get Trading Address if ERC20</p>
</dd>
<dt><a href="#isPreStart">isPreStart()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Sale in not open yet, where the admin can fund the pool</p>
</dd>
<dt><a href="#getCurrentSchedule">getCurrentSchedule()</a> ⇒ <code>Integer</code></dt>
<dd><p>Gets Current Schedule</p>
</dd>
<dt><a href="#getVestingSchedule">getVestingSchedule(Position)</a> ⇒ <code>Array</code> | <code>Integer</code></dt>
<dd><p>Gets Vesting Schedule</p>
</dd>
<dt><a href="#getPurchase">getPurchase(purchase_id)</a> ⇒ <code>Integer</code> | <code>Integer</code> | <code>Address</code> | <code>Integer</code> | <code>Date</code> | <code>Integer</code> | <code>Boolean</code> | <code>Boolean</code></dt>
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
<dt><a href="#getCostFromTokens">getCostFromTokens(tokenAmount)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Cost from Tokens Amount</p>
</dd>
<dt><a href="#getDistributionInformation">getDistributionInformation()</a> ⇒ <code>Integer</code> | <code>Integer</code> | <code>Array</code> | <code>Integer</code></dt>
<dd><p>Get Distribution Information</p>
</dd>
<dt><a href="#swap">swap(tokenAmount, [signature])</a></dt>
<dd><p>Swap tokens by Ethereum or ERC20</p>
</dd>
<dt><a href="#redeemTokens(isStandard)">redeemTokens(purchase_id)</a></dt>
<dd><p>Reedem tokens bought</p>
</dd>
<dt><a href="#redeemGivenMinimumGoalNotAchieved(isStandard)">redeemGivenMinimumGoalNotAchieved(purchase_id)</a></dt>
<dd><p>Reedem Ethereum from sale that did not achieve minimum goal</p>
</dd>
<dt><a href="#withdrawUnsoldTokens">withdrawUnsoldTokens()</a></dt>
<dd><p>Withdraw unsold tokens of sale</p>
</dd>
<dt><a href="#withdrawFunds">withdrawFunds()</a></dt>
<dd><p>Withdraw all funds from tokens sold</p>
</dd>
<dt><a href="#approveFundERC20">approveFundERC20(tokenAmount)</a></dt>
<dd><p>Approve the pool to use approved tokens for sale</p>
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
<dt><a href="#setHasWhitelisting">setHasWhitelisting(hasWhitelist)</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies if the pool has whitelisting or not</p>
</dd>
<dt><a href="#setVesting">setVesting([vestingSchedule], [vestingStart], [vestingCliff], [vestingDuration])</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the current vesting config</p>
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
<dt><a href="#fund">fund(tokenAmount)</a></dt>
<dd><p>Send tokens to pool for sale, fund the sale</p>
</dd>
<dt><a href="#addWhitelistedAddress">addWhitelistedAddress(Addresses)</a></dt>
<dd><p>add WhiteListed Address</p>
</dd>
<dt><a href="#removeWhitelistedAddress">removeWhitelistedAddress(addresses, index)</a></dt>
<dd><p>remove WhiteListed Address</p>
</dd>
<dt><a href="#safePull">safePull()</a></dt>
<dd><p>Safe Pull all tokens &amp; ETH</p>
</dd>
<dt><a href="#removeOtherERC20Tokens">removeOtherERC20Tokens(tokenAddress, toAddress)</a></dt>
<dd><p>Remove Tokens from other ERC20 Address (in case of accident)</p>
</dd>
<dt><a href="#deploy">deploy(tradeValue, tokensForSale, endDate, startDate, [ERC20TradingAddress], [individualMinimumAmount], [individualMaximumAmount], [isTokenSwapAtomic], [minimumRaise], [feeAmount], [tradingDecimals], [hasWhitelisting], [isPOLSWhitelist], [vestingSchedule], [vestingStart], [vestingCliff], [vestingDuration])</a></dt>
<dd><p>Deploy the Pool Contract</p>
</dd>
<dt><a href="#getSmartContractVersion">getSmartContractVersion(Address)</a></dt>
<dd><p>Returns the version of the smart contract that is currently inside psjs</p>
</dd>
<dt><a href="#getBalance">getBalance(Balance)</a></dt>
<dd><p>Get Balance of Contract</p>
</dd>
</dl>

<a name="FixedSwapContract"></a>

## FixedSwapContract
**Kind**: global class  
<a name="new_FixedSwapContract_new"></a>

### new FixedSwapContract(web3, tokenAddress, contractAddress)
Fixed Swap Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| tokenAddress | <code>Address</code> |  |
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
<a name="erc20"></a>

## erc20() ⇒ <code>Address</code>
Get Token Address

**Kind**: global function  
**Returns**: <code>Address</code> - Token Address  
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
<a name="isFinalized"></a>

## isFinalized() ⇒ <code>Boolean</code>
To see if contract was finalized

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
<a name="hasMinimumRaise"></a>

## hasMinimumRaise() ⇒ <code>Boolea</code>
See if hasMinimumRaise

**Kind**: global function  
<a name="minimumReached"></a>

## minimumReached() ⇒ <code>Integer</code>
See if minimumRaise was Reached

**Kind**: global function  
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
<a name="withdrawableUnsoldTokens"></a>

## withdrawableUnsoldTokens() ⇒ <code>Integer</code>
Get Total tokens available to be withdrawn by the admin

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in Tokens  
<a name="withdrawableFunds"></a>

## withdrawableFunds() ⇒ <code>Integer</code>
Get Total funds raised to be withdrawn by the admin

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount in ETH  
<a name="isTokenSwapAtomic"></a>

## isTokenSwapAtomic() ⇒ <code>Boolean</code>
Verify if the Token Swap is atomic on this pool

**Kind**: global function  
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
<a name="isETHTrade"></a>

## isETHTrade() ⇒ <code>Boolean</code>
Verify if Token Sale is against Ethereum

**Kind**: global function  
<a name="isPOLSWhitelisted"></a>

## isPOLSWhitelisted() ⇒ <code>Boolean</code>
Verify if Token Sale is POLS Whitelisted

**Kind**: global function  
<a name="isAddressPOLSWhitelisted"></a>

## isAddressPOLSWhitelisted() ⇒ <code>Boolean</code>
Verify if Address is Whitelisted by POLS (returns false if not needed)

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
Verify if the Token Sale in not open yet, where the admin can fund the pool

**Kind**: global function  
<a name="getCurrentSchedule"></a>

## getCurrentSchedule() ⇒ <code>Integer</code>
Gets Current Schedule

**Kind**: global function  
<a name="getVestingSchedule"></a>

## getVestingSchedule(Position) ⇒ <code>Array</code> \| <code>Integer</code>
Gets Vesting Schedule

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| Position | <code>Integer</code> | Get Position of Integer |

<a name="getPurchase"></a>

## getPurchase(purchase_id) ⇒ <code>Integer</code> \| <code>Integer</code> \| <code>Address</code> \| <code>Integer</code> \| <code>Date</code> \| <code>Integer</code> \| <code>Boolean</code> \| <code>Boolean</code>
Get Purchase based on ID

**Kind**: global function  
**Returns**: <code>Integer</code> - _id<code>Integer</code> - amount<code>Address</code> - purchaser<code>Integer</code> - costAmount<code>Date</code> - timestamp<code>Integer</code> - amountReedemed<code>Boolean</code> - wasFinalized<code>Boolean</code> - reverted  

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

<a name="getCostFromTokens"></a>

## getCostFromTokens(tokenAmount) ⇒ <code>Integer</code>
Get Cost from Tokens Amount

**Kind**: global function  
**Returns**: <code>Integer</code> - costAmount  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

<a name="getDistributionInformation"></a>

## getDistributionInformation() ⇒ <code>Integer</code> \| <code>Integer</code> \| <code>Array</code> \| <code>Integer</code>
Get Distribution Information

**Kind**: global function  
**Returns**: <code>Integer</code> - currentSchedule (Ex : 1)<code>Integer</code> - vestingTime (Ex : 1)<code>Array</code> \| <code>Integer</code> - vestingSchedule (Ex : [100])  
<a name="swap"></a>

## swap(tokenAmount, [signature])
Swap tokens by Ethereum or ERC20

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tokenAmount | <code>Integer</code> |  |
| [signature] | <code>string</code> | Signature for the offchain whitelist |

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

## withdrawUnsoldTokens()
Withdraw unsold tokens of sale

**Kind**: global function  
<a name="withdrawFunds"></a>

## withdrawFunds()
Withdraw all funds from tokens sold

**Kind**: global function  
<a name="approveFundERC20"></a>

## approveFundERC20(tokenAmount)
Approve the pool to use approved tokens for sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

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

<a name="setHasWhitelisting"></a>

## setHasWhitelisting(hasWhitelist) ⇒ <code>admin</code>
Modifies if the pool has whitelisting or not

**Kind**: global function  

| Param | Type |
| --- | --- |
| hasWhitelist | <code>boolean</code> | 

<a name="setVesting"></a>

## setVesting([vestingSchedule], [vestingStart], [vestingCliff], [vestingDuration]) ⇒ <code>admin</code>
Modifies the current vesting config

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [vestingSchedule] | <code>Array.&lt;Integer&gt;</code> | Vesting schedule in % |
| [vestingStart] | <code>String</code> | Vesting start date (Default: endDate) |
| [vestingCliff] | <code>Number</code> | Seconds between every vesting schedule (Default: 0) |
| [vestingDuration] | <code>Number</code> | Vesting duration (Default: 0) |

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

<a name="fund"></a>

## fund(tokenAmount)
Send tokens to pool for sale, fund the sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

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

<a name="safePull"></a>

## safePull()
Safe Pull all tokens & ETH

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

## deploy(tradeValue, tokensForSale, endDate, startDate, [ERC20TradingAddress], [individualMinimumAmount], [individualMaximumAmount], [isTokenSwapAtomic], [minimumRaise], [feeAmount], [tradingDecimals], [hasWhitelisting], [isPOLSWhitelist], [vestingSchedule], [vestingStart], [vestingCliff], [vestingDuration])
Deploy the Pool Contract

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tradeValue | <code>Float</code> | Buy price |
| tokensForSale | <code>Float</code> | Tokens for sale |
| endDate | <code>String</code> | End date |
| startDate | <code>String</code> | Start date |
| [ERC20TradingAddress] | <code>String</code> | Token to use in the swap (Default: 0x0000000000000000000000000000000000000000) |
| [individualMinimumAmount] | <code>Float</code> | Min cap per wallet. 0 to disable it. (Default: 0) |
| [individualMaximumAmount] | <code>Float</code> | Max cap per wallet. 0 to disable it. (Default: 0) |
| [isTokenSwapAtomic] | <code>Boolean</code> | Receive tokens right after the swap. (Default: false) |
| [minimumRaise] | <code>Float</code> | Soft cap (Default: 0) |
| [feeAmount] | <code>Float</code> | Fee amount (Default: 1) |
| [tradingDecimals] | <code>Number</code> | To be the decimals of the currency in case (ex : USDT -> 9; ETH -> 18) (Default: 0) |
| [hasWhitelisting] | <code>Boolean</code> | Has White Listing. (Default: false) |
| [isPOLSWhitelist] | <code>Boolean</code> | Has White Listing. (Default: false) |
| [vestingSchedule] | <code>Array.&lt;Integer&gt;</code> | Vesting schedule in % |
| [vestingStart] | <code>String</code> | Vesting start date (Default: endDate) |
| [vestingCliff] | <code>Number</code> | Seconds between every vesting schedule (Default: 0) |
| [vestingDuration] | <code>Number</code> | Vesting duration (Default: 0) |

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

