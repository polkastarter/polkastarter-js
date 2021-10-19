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
<dt><a href="#approveStakeERC20">approveStakeERC20(tokenAmount)</a></dt>
<dd><p>Approve the stake to use approved tokens</p>
</dd>
<dt><a href="#isApproved">isApproved(tokenAmount, address)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify if the address has approved the staking to deposit</p>
</dd>
<dt><a href="#withdraw">withdraw(amount)</a></dt>
<dd><p>Withdraw tokens from the stake contract</p>
</dd>
<dt><a href="#withdrawAll">withdrawAll()</a></dt>
<dd><p>Withdraw all the tokens from the stake contract</p>
</dd>
<dt><a href="#claim">claim()</a></dt>
<dd><p>Claim rewards from the staking contract</p>
</dd>
<dt><a href="#userAccumulatedRewards">userAccumulatedRewards(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the accumulated rewards</p>
</dd>
<dt><a href="#stakeTime">stakeTime(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the stake time for a wallet</p>
</dd>
<dt><a href="#lockTimePeriod">lockTimePeriod()</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the lock time perdio</p>
</dd>
<dt><a href="#getUnlockTime">getUnlockTime(address)</a> ⇒ <code>Integer</code></dt>
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

### new Staking(web3, [contractAddress], acc, [tokenAddress], [network], [test])
Staking Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| [contractAddress] | <code>string</code> | The staking contract address. (Default: Predefined addresses depending on the network) |
| acc | <code>Account</code> |  |
| [tokenAddress] | <code>string</code> | The staking token address. (Default: Predefined addresses depending on the network) |
| [network] | <code>ETH</code> \| <code>BSC</code> \| <code>MATIC</code> \| <code>DOT</code> | The network where the staking contract is. (Default: ETH) |
| [test] | <code>Boolean</code> | ? Specifies if we're on test env (Default: false) |

<a name="stake"></a>

## stake(amount)
Stakes tokens inside the stake contract

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>Integer</code> | Amount |

<a name="approveStakeERC20"></a>

## approveStakeERC20(tokenAmount)
Approve the stake to use approved tokens

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 

<a name="isApproved"></a>

## isApproved(tokenAmount, address) ⇒ <code>Boolean</code>
Verify if the address has approved the staking to deposit

**Kind**: global function  

| Param | Type |
| --- | --- |
| tokenAmount | <code>Integer</code> | 
| address | <code>Address</code> | 

<a name="withdraw"></a>

## withdraw(amount)
Withdraw tokens from the stake contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| amount | <code>Integer</code> | 

<a name="withdrawAll"></a>

## withdrawAll()
Withdraw all the tokens from the stake contract

**Kind**: global function  
<a name="claim"></a>

## claim()
Claim rewards from the staking contract

**Kind**: global function  
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

<a name="lockTimePeriod"></a>

## lockTimePeriod() ⇒ <code>Integer</code>
Returns the lock time perdio

**Kind**: global function  
**Returns**: <code>Integer</code> - lockTimePeriod  
<a name="getUnlockTime"></a>

## getUnlockTime(address) ⇒ <code>Integer</code>
Returns the stake time for a wallet

**Kind**: global function  
**Returns**: <code>Integer</code> - unlockTime  

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

