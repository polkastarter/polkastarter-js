## Classes

<dl>
<dt><a href="#Signer">Signer</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#generateSignerAccount">generateSignerAccount(password, [entropy])</a> ⇒ <code>string</code></dt>
<dd><p>Generates a new private key for signing the whitelist addresses</p>
</dd>
<dt><a href="#getAccountFromPrivateKey">getAccountFromPrivateKey(accountJson, password)</a> ⇒ <code>string</code></dt>
<dd><p>Recovers an account given a private key</p>
</dd>
<dt><a href="#signAddresses">signAddresses(addresses, accountJson, password)</a> ⇒ <code><a href="#SignedAddress">Array.&lt;SignedAddress&gt;</a></code></dt>
<dd><p>Signs an array of addresses. Will ignore malformed addresses.</p>
</dd>
<dt><a href="#signAddresses">signAddresses(addresses, signer)</a> ⇒ <code><a href="#SignedAddress">Array.&lt;SignedAddress&gt;</a></code></dt>
<dd><p>Signs an array of addresses. Will ignore malformed addresses.</p>
</dd>
<dt><a href="#signMessage">signMessage(signer, message)</a> ⇒ <code>string</code></dt>
<dd><p>Signs a message given an account</p>
</dd>
<dt><a href="#signAddress">signAddress(signer, address)</a> ⇒ <code>string</code></dt>
<dd><p>Signs a address given an account</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Signer">Signer</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#SignedAddress">SignedAddress</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="Signer"></a>

## Signer
**Kind**: global class  
<a name="new_Signer_new"></a>

### new Signer()
Signer object

<a name="generateSignerAccount"></a>

## generateSignerAccount(password, [entropy]) ⇒ <code>string</code>
Generates a new private key for signing the whitelist addresses

**Kind**: global function  
**Returns**: <code>string</code> - JSON Account  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | Password for encryption |
| [entropy] | <code>string</code> | Add more entropy |

<a name="getAccountFromPrivateKey"></a>

## getAccountFromPrivateKey(accountJson, password) ⇒ <code>string</code>
Recovers an account given a private key

**Kind**: global function  
**Returns**: <code>string</code> - Address  

| Param | Type | Description |
| --- | --- | --- |
| accountJson | <code>string</code> | Account in a json format |
| password | <code>string</code> | Password to unlock the account |

<a name="signAddresses"></a>

## signAddresses(addresses, accountJson, password) ⇒ [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress)
Signs an array of addresses. Will ignore malformed addresses.

**Kind**: global function  
**Returns**: [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress) - signedAddresses  

| Param | Type | Description |
| --- | --- | --- |
| addresses | <code>Array.&lt;string&gt;</code> | List of addresses to sign |
| accountJson | <code>string</code> | Account in a json format |
| password | <code>string</code> | Password to unlock the account |

<a name="signAddresses"></a>

## signAddresses(addresses, signer) ⇒ [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress)
Signs an array of addresses. Will ignore malformed addresses.

**Kind**: global function  
**Returns**: [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress) - signedAddresses  

| Param | Type | Description |
| --- | --- | --- |
| addresses | <code>Array.&lt;string&gt;</code> | List of addresses to sign |
| signer | [<code>Signer</code>](#Signer) | Signer object |

<a name="signMessage"></a>

## signMessage(signer, message) ⇒ <code>string</code>
Signs a message given an account

**Kind**: global function  
**Returns**: <code>string</code> - signedString  

| Param | Type | Description |
| --- | --- | --- |
| signer | [<code>Signer</code>](#Signer) | Signer |
| message | <code>string</code> | String to sign |

<a name="signAddress"></a>

## signAddress(signer, address) ⇒ <code>string</code>
Signs a address given an account

**Kind**: global function  
**Returns**: <code>string</code> - signedString  

| Param | Type | Description |
| --- | --- | --- |
| signer | [<code>Signer</code>](#Signer) | Signer object |
| address | <code>string</code> | Address to sign |

<a name="Signer"></a>

## Signer : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| signMessage | <code>function</code> | Signs a message |

<a name="new_Signer_new"></a>

### new Signer()
Signer object

<a name="SignedAddress"></a>

## SignedAddress : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Address. |
| signature | <code>string</code> | Signed Address |

