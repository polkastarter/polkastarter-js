## Functions

<dl>
<dt><a href="#getContract">getContract()</a> ⇒ <code>Contract</code></dt>
<dd><p>Get an instance of this contract</p>
</dd>
<dt><a href="#getAddress">getAddress()</a> ⇒ <code>Address</code></dt>
<dd><p>Get address of this contract</p>
</dd>
<dt><a href="#setNewOwner">setNewOwner(address)</a></dt>
<dd><p>Set new owner</p>
</dd>
<dt><a href="#transferTokenAmount">transferTokenAmount(toAddress)</a></dt>
<dd><p>Transfer tokens</p>
</dd>
<dt><a href="#getTokenAmount">getTokenAmount(address)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get token amount for a given address</p>
</dd>
<dt><a href="#totalSupply">totalSupply()</a> ⇒ <code>Integer</code></dt>
<dd><p>Get the token total supply</p>
</dd>
<dt><a href="#getABI">getABI()</a> ⇒ <code>Object</code></dt>
<dd><p>Get ABI token contract</p>
</dd>
<dt><a href="#getDecimals">getDecimals()</a> ⇒ <code>Integer</code></dt>
<dd><p>Returns number of decimals of this token</p>
</dd>
<dt><a href="#isApproved">isApproved(address, amount, spenderAddress, callback)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check the allowance for these given parameters</p>
</dd>
<dt><a href="#approve">approve(address, amount, callback)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Requests approvement for for these given parameters</p>
</dd>
</dl>

<a name="getContract"></a>

## getContract() ⇒ <code>Contract</code>
Get an instance of this contract

**Kind**: global function  
<a name="getAddress"></a>

## getAddress() ⇒ <code>Address</code>
Get address of this contract

**Kind**: global function  
<a name="setNewOwner"></a>

## setNewOwner(address)
Set new owner

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="transferTokenAmount"></a>

## transferTokenAmount(toAddress)
Transfer tokens

**Kind**: global function  

| Param | Type |
| --- | --- |
| toAddress | <code>Address</code> | 

<a name="getTokenAmount"></a>

## getTokenAmount(address) ⇒ <code>Integer</code>
Get token amount for a given address

**Kind**: global function  
**Returns**: <code>Integer</code> - Token amount  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 

<a name="totalSupply"></a>

## totalSupply() ⇒ <code>Integer</code>
Get the token total supply

**Kind**: global function  
<a name="getABI"></a>

## getABI() ⇒ <code>Object</code>
Get ABI token contract

**Kind**: global function  
**Returns**: <code>Object</code> - ABI object  
<a name="getDecimals"></a>

## getDecimals() ⇒ <code>Integer</code>
Returns number of decimals of this token

**Kind**: global function  
<a name="isApproved"></a>

## isApproved(address, amount, spenderAddress, callback) ⇒ <code>Boolean</code>
Check the allowance for these given parameters

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 
| amount | <code>Integer</code> | 
| spenderAddress | <code>Address</code> | 
| callback | <code>function</code> | 

<a name="approve"></a>

## approve(address, amount, callback) ⇒ <code>Boolean</code>
Requests approvement for for these given parameters

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>Address</code> | 
| amount | <code>Integer</code> | 
| callback | <code>function</code> | 

