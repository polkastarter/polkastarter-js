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
<dt><a href="#getAddressFromAccount">getAddressFromAccount(accountJson, password)</a> ⇒ <code>string</code></dt>
<dd><p>Recovers an account given a json file</p>
</dd>
<dt><a href="#signAddresses">signAddresses(addresses, accountJson, accountMaxAllocations, decimals, contractAddress, password)</a> ⇒ <code><a href="#SignedAddress">Array.&lt;SignedAddress&gt;</a></code></dt>
<dd><p>Signs an array of addresses. Will ignore malformed addresses.</p>
</dd>
<dt><a href="#signAddressesWithSigner">signAddressesWithSigner(addresses, accountMaxAllocations, decimals, contractAddress, signer)</a> ⇒ <code><a href="#SignedAddress">Array.&lt;SignedAddress&gt;</a></code></dt>
<dd><p>Signs an array of addresses. Will ignore malformed addresses.</p>
</dd>
<dt><a href="#signMessage">signMessage(signer, message)</a> ⇒ <code>string</code></dt>
<dd><p>Signs a message given an account</p>
</dd>
<dt><a href="#verifySignature">verifySignature(signature, address, contractAddress, accountMaxAllocation, signerAddress)</a> ⇒ <code>boolean</code></dt>
<dd><p>Verifies if an address has been signed with the signer address</p>
</dd>
<dt><a href="#signAddress">signAddress(signer, address, contractAddress, accountMaxAllocation)</a> ⇒ <code>string</code></dt>
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

<a name="getAddressFromAccount"></a>

## getAddressFromAccount(accountJson, password) ⇒ <code>string</code>
Recovers an account given a json file

**Kind**: global function  
**Returns**: <code>string</code> - Address  

| Param | Type | Description |
| --- | --- | --- |
| accountJson | <code>string</code> | Account in a json format |
| password | <code>string</code> | Password to unlock the account |

<a name="signAddresses"></a>

## signAddresses(addresses, accountJson, accountMaxAllocations, decimals, contractAddress, password) ⇒ [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress)
Signs an array of addresses. Will ignore malformed addresses.

**Kind**: global function  
**Returns**: [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress) - signedAddresses  

| Param | Type | Description |
| --- | --- | --- |
| addresses | <code>Array.&lt;string&gt;</code> | List of addresses to sign |
| accountJson | <code>string</code> | Account in a json format |
| accountMaxAllocations | <code>Array.&lt;number&gt;</code> | List of mac allocations in wei |
| decimals | <code>number</code> | Decimals for the max allocation |
| contractAddress | <code>string</code> | Pool |
| password | <code>string</code> | Password to unlock the account |

<a name="signAddressesWithSigner"></a>

## signAddressesWithSigner(addresses, accountMaxAllocations, decimals, contractAddress, signer) ⇒ [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress)
Signs an array of addresses. Will ignore malformed addresses.

**Kind**: global function  
**Returns**: [<code>Array.&lt;SignedAddress&gt;</code>](#SignedAddress) - signedAddresses  

| Param | Type | Description |
| --- | --- | --- |
| addresses | <code>Array.&lt;string&gt;</code> | List of addresses to sign |
| accountMaxAllocations | <code>Array.&lt;number&gt;</code> | List of mac allocations in wei |
| decimals | <code>number</code> | Decimals for the max allocation |
| contractAddress | <code>string</code> | Pool |
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

<a name="verifySignature"></a>

## verifySignature(signature, address, contractAddress, accountMaxAllocation, signerAddress) ⇒ <code>boolean</code>
Verifies if an address has been signed with the signer address

**Kind**: global function  
**Returns**: <code>boolean</code> - verified  

| Param | Type | Description |
| --- | --- | --- |
| signature | <code>string</code> | Signature |
| address | <code>string</code> | Address signed |
| contractAddress | <code>string</code> | Pool contract address |
| accountMaxAllocation | <code>string</code> | Max allocation |
| signerAddress | <code>string</code> | Address who signed the message |

<a name="signAddress"></a>

## signAddress(signer, address, contractAddress, accountMaxAllocation) ⇒ <code>string</code>
Signs a address given an account

**Kind**: global function  
**Returns**: <code>string</code> - signedString  

| Param | Type | Description |
| --- | --- | --- |
| signer | [<code>Signer</code>](#Signer) | Signer object |
| address | <code>string</code> | Address to sign |
| contractAddress | <code>string</code> | Pool contract address |
| accountMaxAllocation | <code>string</code> | Max allocation |

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
| allocation | <code>string</code> | Max Allocation. |
| signature | <code>string</code> | Signed Address |

