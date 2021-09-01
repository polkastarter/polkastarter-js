## Classes

<dl>
<dt><a href="#Staking">Staking</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#stake">stake(amount)</a></dt>
<dd><p>Stakes tokens inside the stake contract</p>
</dd>
<dt><a href="#withdraw">withdraw()</a></dt>
<dd><p>Withdraw tokens from the stake contract</p>
</dd>
<dt><a href="#claim">claim()</a></dt>
<dd><p>Claim rewards from the staking contract</p>
</dd>
<dt><a href="#setTokenSaleContract">setTokenSaleContract(address)</a></dt>
<dd><p>Changes the token sale contract</p>
</dd>
<dt><a href="#userAccumulatedRewards">userAccumulatedRewards(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the accumulated rewards</p>
</dd>
<dt><a href="#stakeTime">stakeTime(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the stake time for a wallet</p>
</dd>
<dt><a href="#stakeAmount">stakeAmount(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the stake amount for a wallet</p>
</dd>
</dl>

<a name="Staking"></a>

## Staking
**Kind**: global class  
<a name="new_Staking_new"></a>

### new Staking(web3, [contractAddress], acc)
Staking Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| [contractAddress] | <code>string</code> | The staking contract address. (Default: Predefined addresses depending on the network) |
| acc | <code>Account</code> |  |

<a name="stake"></a>

## stake(amount)
Stakes tokens inside the stake contract

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>Integer</code> | Amount |

<a name="withdraw"></a>

## withdraw()
Withdraw tokens from the stake contract

**Kind**: global function  
<a name="claim"></a>

## claim()
Claim rewards from the staking contract

**Kind**: global function  
<a name="setTokenSaleContract"></a>

## setTokenSaleContract(address)
Changes the token sale contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="userAccumulatedRewards"></a>

## userAccumulatedRewards(address) ⇒ <code>Integer</code>
Returns the accumulated rewards

**Kind**: global function  
**Returns**: <code>Integer</code> - userAccumulatedRewards  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="stakeTime"></a>

## stakeTime(address) ⇒ <code>Integer</code>
Returns the stake time for a wallet

**Kind**: global function  
**Returns**: <code>Integer</code> - stakeTime  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="stakeAmount"></a>

## stakeAmount(address) ⇒ <code>Integer</code>
Returns the stake amount for a wallet

**Kind**: global function  
**Returns**: <code>Integer</code> - stakeAmount  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

