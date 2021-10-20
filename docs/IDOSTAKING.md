## Classes

<dl>
<dt><a href="#IDOStaking">IDOStaking</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#deploy">deploy(owner, rewardsDistribution, rewardsToken, stakingToken, rewardsDuration)</a></dt>
<dd><p>Deploys the IDO Staking contracts</p>
</dd>
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
<dt><a href="#notifyRewardAmountSamePeriod">notifyRewardAmountSamePeriod(amount)</a></dt>
<dd><p>add (more) rewards token to current/future period</p>
</dd>
<dt><a href="#userAccumulatedRewards">userAccumulatedRewards(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the accumulated rewards</p>
</dd>
<dt><a href="#stakeAmount">stakeAmount(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the stake amount for a wallet</p>
</dd>
<dt><a href="#setTokenSaleAddress">setTokenSaleAddress(address)</a></dt>
<dd><p>Sets the token sale address</p>
</dd>
</dl>

<a name="IDOStaking"></a>

## IDOStaking
**Kind**: global class  
<a name="new_IDOStaking_new"></a>

### new IDOStaking(web3, contractAddress, acc)
IDO Staking Object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> |  |
| contractAddress | <code>string</code> | The staking contract address. |
| acc | <code>Account</code> |  |

<a name="deploy"></a>

## deploy(owner, rewardsDistribution, rewardsToken, stakingToken, rewardsDuration)
Deploys the IDO Staking contracts

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| owner | <code>string</code> | Address of the owner |
| rewardsDistribution | <code>string</code> | Address of the distributor |
| rewardsToken | <code>string</code> | Address of the token we want to reward |
| stakingToken | <code>string</code> | Address of the token to be staked |
| rewardsDuration | <code>Integer</code> | Duration of the rewards |

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
<a name="notifyRewardAmountSamePeriod"></a>

## notifyRewardAmountSamePeriod(amount)
add (more) rewards token to current/future period

**Kind**: global function  

| Param | Type |
| --- | --- |
| amount | <code>Integer</code> | 

<a name="userAccumulatedRewards"></a>

## userAccumulatedRewards(address) ⇒ <code>Integer</code>
Returns the accumulated rewards

**Kind**: global function  
**Returns**: <code>Integer</code> - userAccumulatedRewards  

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

<a name="setTokenSaleAddress"></a>

## setTokenSaleAddress(address)
Sets the token sale address

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

