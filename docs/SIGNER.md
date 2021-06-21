## Classes

<dl>
<dt><a href="#Signer">Signer</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#generateSignerAccount">generateSignerAccount(entropy)</a> ⇒ <code><a href="#Account">Account</a></code></dt>
<dd><p>Generates a new private key for signing the whitelist addresses</p>
</dd>
<dt><a href="#getAccountFromPrivateKey">getAccountFromPrivateKey(privateKey)</a> ⇒ <code><a href="#Account">Account</a></code></dt>
<dd><p>Recovers an account given a private key</p>
</dd>
<dt><a href="#signAddresses">signAddresses(addresses, account)</a> ⇒ <code><a href="#SignedAddress">Array.&lt;SignedAddress&gt;</a></code></dt>
<dd><p>Signs an array of addresses. Will ignore malformed addresses.</p>
</dd>
<dt><a href="#signMessage">signMessage(account, message)</a> ⇒ <code>string</code></dt>
<dd><p>Signs a message given an account</p>
</dd>
<dt><a href="#signAddress">signAddress(account, address)</a> ⇒ <code>string</code></dt>
<dd><p>Signs a address given an account</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Account">Account</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#SignedAddress">SignedAddress</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="Signer"></a>

## Signer
**Kind**: global class  
<a name="new_Signer_new"></a>

### new Signer(web3)
Signer object


| Param | Type | Description |
| --- | --- | --- |
| web3 | <code>Web3</code> | Web3JS Instance |

<a name="generateSignerAccount"></a>

## generateSignerAccount(entropy) ⇒ [<code>Account</code>](#Account)
Generates a new private key for signing the whitelist addresses

**Kind**: global function  
**Returns**: [<code>Account</code>](#Account) - privateKey  

| Param | Type | Description |
| --- | --- | --- |
| entropy | <code>string</code> | (Optional) a random string to increase entropy. |

<a name="getAccountFromPrivateKey"></a>

## getAccountFromPrivateKey(privateKey) ⇒ [<code>Account</code>](#Account)
Recovers an account given a private key

**Kind**: global function  
**Returns**: [<code>Account</code>](#Account) - Account  

| Param | Type |
| --- | --- |
| privateKey | <code>string</code> | 

<a name="signAddresses"></a>

## signAddresses(addresses, account) ⇒ [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress)
Signs an array of addresses. Will ignore malformed addresses.

**Kind**: global function  
**Returns**: [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress) - signedAddresses  

| Param | Type | Description |
| --- | --- | --- |
| addresses | <code>Array.&lt;string&gt;</code> | List of addresses to sign |
| account | [<code>Account</code>](#Account) | Account to sign |

<a name="signMessage"></a>

## signMessage(account, message) ⇒ <code>string</code>
Signs a message given an account

**Kind**: global function  
**Returns**: <code>string</code> - signedString  

| Param | Type | Description |
| --- | --- | --- |
| account | [<code>Account</code>](#Account) | Signer |
| message | <code>string</code> | String to sign |

<a name="signAddress"></a>

## signAddress(account, address) ⇒ <code>string</code>
Signs a address given an account

**Kind**: global function  
**Returns**: <code>string</code> - signedString  

| Param | Type | Description |
| --- | --- | --- |
| account | [<code>Account</code>](#Account) | Signer |
| address | <code>string</code> | Address to sign |

<a name="Account"></a>

## Account : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Address |
| privateKey | <code>string</code> | Private Key |
| sign | <code>function</code> | Signs a message |

<a name="SignedAddress"></a>

## SignedAddress : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Address. |
| signature | <code>string</code> | Signed Address |

