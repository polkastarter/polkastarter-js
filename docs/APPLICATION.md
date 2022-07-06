## Classes

<dl>
<dt><a href="#Application">Application</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#startWithoutMetamask">startWithoutMetamask()</a></dt>
<dd><p>Starts an instance of web3 for read-only methods</p>
</dd>
<dt><a href="#start">start()</a></dt>
<dd><p>Starts an instance of web3</p>
</dd>
<dt><a href="#login">login()</a></dt>
<dd><p>Logins with metamask</p>
</dd>
<dt><a href="#getSigner">getSigner()</a></dt>
<dd><p>Returns the Signer instance.</p>
</dd>
<dt><a href="#getNetworkUtils">getNetworkUtils()</a></dt>
<dd><p>Returns the Network Utils instance.</p>
</dd>
<dt><a href="#getWalletUtils">getWalletUtils()</a></dt>
<dd><p>Returns the Wallet Utils instance.</p>
</dd>
<dt><a href="#getStaking">getStaking([contractAddress], [tokenAddress])</a></dt>
<dd><p>Returns the Staking Model instance.</p>
</dd>
<dt><a href="#getFixedSwapContract">getFixedSwapContract(tokenAddress, [contractAddress])</a></dt>
<dd><p>Returns Fixed Swap instance</p>
</dd>
<dt><a href="#getFixedNFTSwapContract">getFixedNFTSwapContract([contractAddress])</a></dt>
<dd><p>Returns Fixed NFT Swap instance</p>
</dd>
<dt><a href="#getERC20TokenContract">getERC20TokenContract(tokenAddress)</a></dt>
<dd><p>Returns ERC20 instance</p>
</dd>
<dt><a href="#getETHNetwork">getETHNetwork()</a></dt>
<dd><p>Returns the current network</p>
</dd>
<dt><a href="#getAddress">getAddress()</a></dt>
<dd><p>Returns the connected user address</p>
</dd>
<dt><a href="#getETHBalance">getETHBalance()</a></dt>
<dd><p>Returns the native currency of the connected user wallet.</p>
</dd>
</dl>

<a name="Application"></a>

## Application
**Kind**: global class  
<a name="new_Application_new"></a>

### new Application([network], [mainnet], [test], [web3])
Polkastarter Application Object


| Param | Type | Description |
| --- | --- | --- |
| [network] | <code>ETH</code> \| <code>BNB</code> \| <code>MATIC</code> \| <code>DOT</code> | Current network (Default = ETH) |
| [mainnet] | <code>Boolean</code> | Specifies if we're on mainnet or tesnet (Default = true); |
| [test] | <code>Boolean</code> | ? Specifies if we're on test env |
| [web3] | <code>Web3</code> | Custom Web3 instance. If not provided the Application will instance it for you. (Default: undefined) |

<a name="startWithoutMetamask"></a>

## startWithoutMetamask()
Starts an instance of web3 for read-only methods

**Kind**: global function  
<a name="start"></a>

## start()
Starts an instance of web3

**Kind**: global function  
<a name="login"></a>

## login()
Logins with metamask

**Kind**: global function  
<a name="getSigner"></a>

## getSigner()
Returns the Signer instance.

**Kind**: global function  
<a name="getNetworkUtils"></a>

## getNetworkUtils()
Returns the Network Utils instance.

**Kind**: global function  
<a name="getWalletUtils"></a>

## getWalletUtils()
Returns the Wallet Utils instance.

**Kind**: global function  
<a name="getStaking"></a>

## getStaking([contractAddress], [tokenAddress])
Returns the Staking Model instance.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [contractAddress] | <code>string</code> | The staking contract address. (Default: Predefined addresses depending on the network) |
| [tokenAddress] | <code>string</code> | The staking token address. (Default: Predefined addresses depending on the network) |

<a name="getFixedSwapContract"></a>

## getFixedSwapContract(tokenAddress, [contractAddress])
Returns Fixed Swap instance

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tokenAddress | <code>string</code> | The token address we want to trade |
| [contractAddress] | <code>string</code> | The swap contract address, in case t hat has already been instanced. (Default = null) |

<a name="getFixedNFTSwapContract"></a>

## getFixedNFTSwapContract([contractAddress])
Returns Fixed NFT Swap instance

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [contractAddress] | <code>string</code> | The swap contract address, in case t hat has already been instanced. (Default = null) |

<a name="getERC20TokenContract"></a>

## getERC20TokenContract(tokenAddress)
Returns ERC20 instance

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tokenAddress | <code>string</code> | The token address |

<a name="getETHNetwork"></a>

## getETHNetwork()
Returns the current network

**Kind**: global function  
<a name="getAddress"></a>

## getAddress()
Returns the connected user address

**Kind**: global function  
<a name="getETHBalance"></a>

## getETHBalance()
Returns the native currency of the connected user wallet.

**Kind**: global function  
