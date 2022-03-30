## Classes

<dl>
<dt><a href="#FixedSwapContract">FixedSwapContract</a> ⇐ <code>BaseSwapContract</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#deploy">deploy(tradeValue, [swapRatio], tokensForSale, endDate, startDate, [ERC20TradingAddress], [individualMinimumAmount], [individualMaximumAmount], [isTokenSwapAtomic], [minimumRaise], [feeAmount], [tradingDecimals], [hasWhitelisting], [isPOLSWhitelist], [vestingSchedule], [vestingStart], [vestingCliff], [vestingDuration])</a></dt>
<dd><p>Deploy the Pool Contract</p>
</dd>
<dt><a href="#setStakingRewards">setStakingRewards(address)</a> ⇒ <code>admin</code></dt>
<dd><p>Sets the staking rewards address</p>
</dd>
<dt><a href="#getIDOStaking">getIDOStaking()</a> ⇒ <code>IDOStaking</code></dt>
<dd><p>Returns the contract for the ido staking</p>
</dd>
<dt><a href="#erc20">erc20()</a> ⇒ <code>Address</code></dt>
<dd><p>Get Token Address</p>
</dd>
<dt><a href="#tradeValue">tradeValue()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get trade value for the pool</p>
</dd>
<dt><a href="#swapRatio">swapRatio()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get swap ratio for the pool</p>
</dd>
<dt><a href="#vestingStart">vestingStart()</a> ⇒ <code>Date</code></dt>
<dd><p>Get Start Date of the Vesting</p>
</dd>
<dt><a href="#individualMinimumAmount">individualMinimumAmount()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Individual Minimum Amount for each address</p>
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
<dt><a href="#individualMaximumAmount">individualMaximumAmount()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Individual Maximum Amount for each address</p>
</dd>
<dt><a href="#withdrawableUnsoldTokens">withdrawableUnsoldTokens()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get Total tokens available to be withdrawn by the admin</p>
</dd>
<dt><a href="#isTokenSwapAtomic">isTokenSwapAtomic()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Swap is atomic on this pool</p>
</dd>
<dt><a href="#isFunded">isFunded()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the Token Sale is Funded with all Tokens proposed in tokensForSale</p>
</dd>
<dt><a href="#isPOLSWhitelisted">isPOLSWhitelisted()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if Token Sale is POLS Whitelisted</p>
</dd>
<dt><a href="#isAddressPOLSWhitelisted">isAddressPOLSWhitelisted()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if Address is Whitelisted by POLS (returns false if not needed)</p>
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
<dt><a href="#getDistributionInformation">getDistributionInformation()</a> ⇒ <code>Integer</code> | <code>Integer</code> | <code>Array</code> | <code>Integer</code> | <code>Date</code></dt>
<dd><p>Get Distribution Information</p>
</dd>
<dt><a href="#swapWithSig">swapWithSig(tokenAmount, accountMaxAmount, [signature])</a></dt>
<dd><p>Swap tokens by Ethereum or ERC20</p>
</dd>
<dt><a href="#swap">swap(tokenAmount, [signature])</a></dt>
<dd><p>Swap tokens by Ethereum or ERC20</p>
</dd>
<dt><a href="#redeemTokens(isStandard)">redeemTokens(purchase_id, [stake])</a></dt>
<dd><p>Reedem tokens bought</p>
</dd>
<dt><a href="#withdrawUnsoldTokens">withdrawUnsoldTokens()</a></dt>
<dd><p>Withdraw unsold tokens of sale</p>
</dd>
<dt><a href="#approveFundERC20">approveFundERC20(tokenAmount)</a></dt>
<dd><p>Approve the pool to use approved tokens for sale</p>
</dd>
<dt><a href="#setVesting">setVesting([vestingSchedule], [vestingStart], [vestingCliff], [vestingDuration])</a> ⇒ <code>admin</code></dt>
<dd><p>Modifies the current vesting config</p>
</dd>
<dt><a href="#fund">fund(tokenAmount)</a></dt>
<dd><p>Send tokens to pool for sale, fund the sale</p>
</dd>
</dl>

<a name="FixedSwapContract"></a>

## FixedSwapContract ⇐ <code>BaseSwapContract</code>
**Kind**: global class  
**Extends**: <code>BaseSwapContract</code>  
<a name="new_FixedSwapContract_new"></a>

### new FixedSwapContract(web3, tokenAddress, contractAddress)
Fixed Swap Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| tokenAddress | <code>Address</code> |  |
| contractAddress | <code>Address</code> | ? (opt) |

<a name="deploy"></a>

## deploy(tradeValue, [swapRatio], tokensForSale, endDate, startDate, [ERC20TradingAddress], [individualMinimumAmount], [individualMaximumAmount], [isTokenSwapAtomic], [minimumRaise], [feeAmount], [tradingDecimals], [hasWhitelisting], [isPOLSWhitelist], [vestingSchedule], [vestingStart], [vestingCliff], [vestingDuration])
Deploy the Pool Contract

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tradeValue | <code>Float</code> | Buy price |
| [swapRatio] | <code>Float</code> | Instead of the tradeValue you can optionally send the swap ratio, how much tokens for 1 eth/bnb (Default: null) |
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
| [vestingCliff] | <code>Number</code> | Seconds to wait for the first unlock after the vesting start (Default: 0) |
| [vestingDuration] | <code>Number</code> | Seconds to wait between every unlock (Default: 0) |

<a name="setStakingRewards"></a>

## setStakingRewards(address) ⇒ <code>admin</code>
Sets the staking rewards address

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="getIDOStaking"></a>

## getIDOStaking() ⇒ <code>IDOStaking</code>
Returns the contract for the ido staking

**Kind**: global function  
<a name="erc20"></a>

## erc20() ⇒ <code>Address</code>
Get Token Address

**Kind**: global function  
**Returns**: <code>Address</code> - Token Address  
<a name="tradeValue"></a>

## tradeValue() ⇒ <code>Integer</code>
Get trade value for the pool

**Kind**: global function  
**Returns**: <code>Integer</code> - trade value against ETH  
<a name="swapRatio"></a>

## swapRatio() ⇒ <code>Integer</code>
Get swap ratio for the pool

**Kind**: global function  
**Returns**: <code>Integer</code> - trade value against 1 ETH  
<a name="vestingStart"></a>

## vestingStart() ⇒ <code>Date</code>
Get Start Date of the Vesting

**Kind**: global function  
<a name="individualMinimumAmount"></a>

## individualMinimumAmount() ⇒ <code>Integer</code>
Get Individual Minimum Amount for each address

**Kind**: global function  
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
<a name="individualMaximumAmount"></a>

## individualMaximumAmount() ⇒ <code>Integer</code>
Get Individual Maximum Amount for each address

**Kind**: global function  
<a name="withdrawableUnsoldTokens"></a>

## withdrawableUnsoldTokens() ⇒ <code>Integer</code>
Get Total tokens available to be withdrawn by the admin

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
<a name="isPOLSWhitelisted"></a>

## isPOLSWhitelisted() ⇒ <code>Boolean</code>
Verify if Token Sale is POLS Whitelisted

**Kind**: global function  
<a name="isAddressPOLSWhitelisted"></a>

## isAddressPOLSWhitelisted() ⇒ <code>Boolean</code>
Verify if Address is Whitelisted by POLS (returns false if not needed)

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

## getDistributionInformation() ⇒ <code>Integer</code> \| <code>Integer</code> \| <code>Array</code> \| <code>Integer</code> \| <code>Date</code>
Get Distribution Information

**Kind**: global function  
**Returns**: <code>Integer</code> - currentSchedule (Ex : 1)<code>Integer</code> - vestingTime (Ex : 1)<code>Array</code> \| <code>Integer</code> - vestingSchedule (Ex : [100])<code>Date</code> - vestingStart  
<a name="swapWithSig"></a>

## swapWithSig(tokenAmount, accountMaxAmount, [signature])
Swap tokens by Ethereum or ERC20

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tokenAmount | <code>Integer</code> |  |
| accountMaxAmount | <code>string</code> | Max alloc in wei |
| [signature] | <code>string</code> | Signature for the offchain whitelist |

<a name="swap"></a>

## swap(tokenAmount, [signature])
Swap tokens by Ethereum or ERC20

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tokenAmount | <code>Integer</code> |  |
| [signature] | <code>string</code> | Signature for the offchain whitelist |

<a name="redeemTokens(isStandard)"></a>

## redeemTokens(purchase_id, [stake])
Reedem tokens bought

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| purchase_id | <code>Integer</code> |  |
| [stake] | <code>Boolean</code> | If true send token to the ido staking contract |

<a name="withdrawUnsoldTokens"></a>

## withdrawUnsoldTokens()
Withdraw unsold tokens of sale

**Kind**: global function  
<a name="approveFundERC20"></a>

## approveFundERC20(tokenAmount)
Approve the pool to use approved tokens for sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

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

<a name="fund"></a>

## fund(tokenAmount)
Send tokens to pool for sale, fund the sale

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

