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
<dd><p>Claim rewards from the staking V3 contract</p>
</dd>
<dt><a href="#userAccumulatedRewards">userAccumulatedRewards(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the accumulated rewards</p>
</dd>
<dt><a href="#stakeTime">stakeTime(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the stake time for a wallet</p>
</dd>
<dt><a href="#getUnlockTime">getUnlockTime(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the stake time for a wallet</p>
</dd>
<dt><a href="#stakeAmount">stakeAmount(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the stake amount for a wallet</p>
</dd>
<dt><a href="#getLockTimePeriod">getLockTimePeriod()</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns the default lock time period</p>
</dd>
<dt><a href="#setLockTimePeriodDefault">setLockTimePeriodDefault(defaultLockTime)</a></dt>
<dd><p>Setup time in seconds for default lock time period</p>
</dd>
<dt><a href="#remainingLockPeriod">remainingLockPeriod(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Return remaining lock time period</p>
</dd>
<dt><a href="#getLockTimePeriodOptions">getLockTimePeriodOptions()</a> ⇒ <code>Array.&lt;Integer&gt;</code></dt>
<dd><p>Get all the lock time periods available</p>
</dd>
<dt><a href="#getLockTimePeriodRewardFactors">getLockTimePeriodRewardFactors()</a> ⇒ <code>Array.&lt;Integer&gt;</code></dt>
<dd><p>Get all the reward factors available</p>
</dd>
<dt><a href="#setLockedRewardsEnabled">setLockedRewardsEnabled(lockedRewardsEnabled)</a></dt>
<dd><p>Set lock rewards to true/false</p>
</dd>
<dt><a href="#setUnlockedRewardsFactor">setUnlockedRewardsFactor(unlockedRewardsFactor)</a></dt>
<dd><p>Set unlocked rewards factor</p>
</dd>
<dt><a href="#setLockTimePeriodOptions">setLockTimePeriodOptions(lockTimePeriod, lockTimePeriodRewardFactor)</a></dt>
<dd><p>Set lock time options the user can choose from when staking</p>
</dd>
<dt><a href="#setPrevPolsStaking">setPrevPolsStaking(prevPolsStakingAddress)</a></dt>
<dd><p>Set previous staking contract address to migrate to this version</p>
</dd>
<dt><a href="#remainingLockPeriod_msgSender">remainingLockPeriod_msgSender()</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns remaining lock time period</p>
</dd>
<dt><a href="#userClaimableRewards">userClaimableRewards(staker)</a> ⇒ <code>Integer</code></dt>
<dd><p>Calculate current reward for an account</p>
</dd>
<dt><a href="#userClaimableRewardsCurrent">userClaimableRewardsCurrent(staker, lockedRewardsCurrent)</a> ⇒ <code>Integer</code></dt>
<dd><p>Calculate current reward for an account</p>
</dd>
<dt><a href="#userClaimableRewardsCalculation">userClaimableRewardsCalculation(user_stakeAmount, user_stakeTime, user_unlockTime, t0, endTime, lockedRewards, lockedRewardsCurrent, user_stakePeriodRewardFactor)</a> ⇒ <code>Integer</code></dt>
<dd><p>Calculate current rewards at time t0. This function is for better testing and &quot;what-if&quot; UX scenarios</p>
</dd>
<dt><a href="#extendLockTime">extendLockTime(lockTimeIndex)</a> ⇒ <code>Integer</code></dt>
<dd><p>Extend lock period to get more upfront rewards. Actually just a special case of _stakelockTimeChoice(0, lockTimeIndex)</p>
</dd>
<dt><a href="#topUp">topUp(amount)</a> ⇒ <code>Integer</code></dt>
<dd><p>Increase staked amount, but keep unlock time unchanged. Actually just a special case of _stakelockTimeChoice(amount, 0)</p>
</dd>
<dt><a href="#migrateRewards">migrateRewards(staker)</a></dt>
<dd><p>Migrate rewards from previous (v1/v2) staking contract</p>
</dd>
<dt><a href="#migrateRewards_msgSender">migrateRewards_msgSender(staker)</a></dt>
<dd><p>Migrate msgSender&#39;s rewards from previous (v1/v2) staking contract</p>
</dd>
<dt><a href="#stakeLockTimeChoice">stakeLockTimeChoice(amount, lockTimeIndex)</a></dt>
<dd><p>Stake tokens for a lock time choice</p>
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
| [contractAddress] | <code>string</code> | The staking V3 contract address. (Default: Predefined addresses depending on the network) |
| acc | <code>Account</code> |  |
| [tokenAddress] | <code>string</code> | The staking token address. (Default: Predefined addresses depending on the network) |
| [network] | <code>ETH</code> \| <code>BSC</code> \| <code>MATIC</code> \| <code>DOT</code> | The network where the staking V3 contract is. (Default: ETH) |
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
Claim rewards from the staking V3 contract

**Kind**: global function  
<a name="userAccumulatedRewards"></a>

## userAccumulatedRewards(address) ⇒ <code>Integer</code>
Returns the accumulated rewards

**Kind**: global function  
**Returns**: <code>Integer</code> - userAccumulatedRewards  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="stakeTime"></a>

## stakeTime(address) ⇒ <code>Integer</code>
Returns the stake time for a wallet

**Kind**: global function  
**Returns**: <code>Integer</code> - stakeTime  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="getUnlockTime"></a>

## getUnlockTime(address) ⇒ <code>Integer</code>
Returns the stake time for a wallet

**Kind**: global function  
**Returns**: <code>Integer</code> - unlockTime  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="stakeAmount"></a>

## stakeAmount(address) ⇒ <code>Integer</code>
Returns the stake amount for a wallet

**Kind**: global function  
**Returns**: <code>Integer</code> - stakeAmount  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="getLockTimePeriod"></a>

## getLockTimePeriod() ⇒ <code>Integer</code>
Returns the default lock time period

**Kind**: global function  
**Returns**: <code>Integer</code> - defaultLockTimePeriod  
<a name="setLockTimePeriodDefault"></a>

## setLockTimePeriodDefault(defaultLockTime)
Setup time in seconds for default lock time period

**Kind**: global function  

| Param | Type |
| --- | --- |
| defaultLockTime | <code>Integer</code> | 

<a name="remainingLockPeriod"></a>

## remainingLockPeriod(address) ⇒ <code>Integer</code>
Return remaining lock time period

**Kind**: global function  
**Returns**: <code>Integer</code> - unlockTime remaining time in seconds  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="getLockTimePeriodOptions"></a>

## getLockTimePeriodOptions() ⇒ <code>Array.&lt;Integer&gt;</code>
Get all the lock time periods available

**Kind**: global function  
**Returns**: <code>Array.&lt;Integer&gt;</code> - array of lock times the user can choose from when staking  
<a name="getLockTimePeriodRewardFactors"></a>

## getLockTimePeriodRewardFactors() ⇒ <code>Array.&lt;Integer&gt;</code>
Get all the reward factors available

**Kind**: global function  
**Returns**: <code>Array.&lt;Integer&gt;</code> - array of reward factors the user can choose from when staking  
<a name="setLockedRewardsEnabled"></a>

## setLockedRewardsEnabled(lockedRewardsEnabled)
Set lock rewards to true/false

**Kind**: global function  

| Param | Type |
| --- | --- |
| lockedRewardsEnabled | <code>Boolean</code> | 

<a name="setUnlockedRewardsFactor"></a>

## setUnlockedRewardsFactor(unlockedRewardsFactor)
Set unlocked rewards factor

**Kind**: global function  

| Param | Type |
| --- | --- |
| unlockedRewardsFactor | <code>Integer</code> | 

<a name="setLockTimePeriodOptions"></a>

## setLockTimePeriodOptions(lockTimePeriod, lockTimePeriodRewardFactor)
Set lock time options the user can choose from when staking

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| lockTimePeriod | <code>Array.&lt;Integer&gt;</code> | array of lock times the user can choose from when staking |
| lockTimePeriodRewardFactor | <code>Array.&lt;Integer&gt;</code> | array of reward factors for each option |

<a name="setPrevPolsStaking"></a>

## setPrevPolsStaking(prevPolsStakingAddress)
Set previous staking contract address to migrate to this version

**Kind**: global function  

| Param | Type |
| --- | --- |
| prevPolsStakingAddress | <code>Address</code> | 

<a name="remainingLockPeriod_msgSender"></a>

## remainingLockPeriod\_msgSender() ⇒ <code>Integer</code>
Returns remaining lock time period

**Kind**: global function  
**Returns**: <code>Integer</code> - unlockTime remaining time in seconds  
<a name="userClaimableRewards"></a>

## userClaimableRewards(staker) ⇒ <code>Integer</code>
Calculate current reward for an account

**Kind**: global function  
**Returns**: <code>Integer</code> - claimableReward for this stacker account  

| Param | Type | Description |
| --- | --- | --- |
| staker | <code>Address</code> | account to do the reward calculation for |

<a name="userClaimableRewardsCurrent"></a>

## userClaimableRewardsCurrent(staker, lockedRewardsCurrent) ⇒ <code>Integer</code>
Calculate current reward for an account

**Kind**: global function  
**Returns**: <code>Integer</code> - claimableReward for this stacker account depending of lockedRewardsCurrent  

| Param | Type | Description |
| --- | --- | --- |
| staker | <code>Address</code> | account to do the reward calculation for |
| lockedRewardsCurrent | <code>Boolean</code> | true => only calculate locked rewards up to block_timestamp (used for stake update) |

<a name="userClaimableRewardsCalculation"></a>

## userClaimableRewardsCalculation(user_stakeAmount, user_stakeTime, user_unlockTime, t0, endTime, lockedRewards, lockedRewardsCurrent, user_stakePeriodRewardFactor) ⇒ <code>Integer</code>
Calculate current rewards at time t0. This function is for better testing and "what-if" UX scenarios

**Kind**: global function  
**Returns**: <code>Integer</code> - ClaimableRewards rewards user has received / can claim at this block time  

| Param | Type | Description |
| --- | --- | --- |
| user_stakeAmount | <code>Integer</code> | amount of staked tokens |
| user_stakeTime | <code>Integer</code> | time the user has staked |
| user_unlockTime | <code>Integer</code> | time when user's staked tokens will be unlocked |
| t0 | <code>Integer</code> | current block time |
| endTime | <code>Integer</code> | time when the rewards scheme will end |
| lockedRewards | <code>Boolean</code> | true => user will get full rewards for lock time upfront (v3 default mode) |
| lockedRewardsCurrent | <code>Boolean</code> | true => only calculate locked rewards up to t0 |
| user_stakePeriodRewardFactor | <code>Integer</code> | is a reward factor for a given lock period option |

<a name="extendLockTime"></a>

## extendLockTime(lockTimeIndex) ⇒ <code>Integer</code>
Extend lock period to get more upfront rewards. Actually just a special case of _stakelockTimeChoice(0, lockTimeIndex)

**Kind**: global function  
**Returns**: <code>Integer</code> - lockTimeIndex index to the lockTimePeriod array  

| Param | Type | Description |
| --- | --- | --- |
| lockTimeIndex | <code>Integer</code> | index to the lockTimePeriod array , if 0 then do not change current unlockTime |

<a name="topUp"></a>

## topUp(amount) ⇒ <code>Integer</code>
Increase staked amount, but keep unlock time unchanged. Actually just a special case of _stakelockTimeChoice(amount, 0)

**Kind**: global function  
**Returns**: <code>Integer</code> - Amount of token to be staked  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>Integer</code> | of token to be staked |

<a name="migrateRewards"></a>

## migrateRewards(staker)
Migrate rewards from previous (v1/v2) staking contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| staker | <code>Address</code> | 

<a name="migrateRewards_msgSender"></a>

## migrateRewards\_msgSender(staker)
Migrate msgSender's rewards from previous (v1/v2) staking contract

**Kind**: global function  

| Param | Type |
| --- | --- |
| staker | <code>Address</code> | 

<a name="stakeLockTimeChoice"></a>

## stakeLockTimeChoice(amount, lockTimeIndex)
Stake tokens for a lock time choice

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>Integer</code> | Amount of tokens to stake |
| lockTimeIndex | <code>Integer</code> | to choose lock time |

