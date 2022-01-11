## Classes

<dl>
<dt><a href="#Network">Network</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#onChainChanged">onChainChanged(callback)</a></dt>
<dd><p>Triggers the callback after the users changes their chain</p>
</dd>
<dt><a href="#changeToCurrentNetwork">changeToCurrentNetwork()</a></dt>
<dd><p>Request the wallet to change to the current chain</p>
</dd>
<dt><a href="#switchToEthereum">switchToEthereum()</a></dt>
<dd><p>Request switch to the ETH chain</p>
</dd>
<dt><a href="#switchToAvalanche">switchToAvalanche()</a></dt>
<dd><p>Request switch to the Avalanche chain</p>
</dd>
<dt><a href="#switchToMoonbeam">switchToMoonbeam()</a></dt>
<dd><p>Request switch to the Moonbeam chain</p>
</dd>
<dt><a href="#switchToCelo">switchToCelo()</a></dt>
<dd><p>Request switch to the Celo chain</p>
</dd>
<dt><a href="#switchToPolygon">switchToPolygon()</a></dt>
<dd><p>Request switch to the Polygon chain</p>
</dd>
<dt><a href="#switchToBsc">switchToBsc()</a></dt>
<dd><p>Request switch to the Binance smart chain</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#onChainChangedCallback">onChainChangedCallback</a> : <code>function</code></dt>
<dd><p>Callback when networks changes</p>
</dd>
</dl>

<a name="Network"></a>

## Network
**Kind**: global class  
<a name="new_Network_new"></a>

### new Network([network], [test])
Network utils object


| Param | Type | Description |
| --- | --- | --- |
| [network] | <code>ETH</code> \| <code>BSC</code> \| <code>MATIC</code> \| <code>DOT</code> | The network where the staking contract is. (Default: ETH) |
| [test] | <code>Boolean</code> | ? Specifies if we're on test env (Default: false) |

<a name="onChainChanged"></a>

## onChainChanged(callback)
Triggers the callback after the users changes their chain

**Kind**: global function  

| Param | Type |
| --- | --- |
| callback | [<code>onChainChangedCallback</code>](#onChainChangedCallback) | 

<a name="changeToCurrentNetwork"></a>

## changeToCurrentNetwork()
Request the wallet to change to the current chain

**Kind**: global function  
<a name="switchToEthereum"></a>

## switchToEthereum()
Request switch to the ETH chain

**Kind**: global function  
<a name="switchToAvalanche"></a>

## switchToAvalanche()
Request switch to the Avalanche chain

**Kind**: global function  
<a name="switchToMoonbeam"></a>

## switchToMoonbeam()
Request switch to the Moonbeam chain

**Kind**: global function  
<a name="switchToCelo"></a>

## switchToCelo()
Request switch to the Celo chain

**Kind**: global function  
<a name="switchToPolygon"></a>

## switchToPolygon()
Request switch to the Polygon chain

**Kind**: global function  
<a name="switchToBsc"></a>

## switchToBsc()
Request switch to the Binance smart chain

**Kind**: global function  
<a name="onChainChangedCallback"></a>

## onChainChangedCallback : <code>function</code>
Callback when networks changes

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| network | <code>string</code> | Network name |

