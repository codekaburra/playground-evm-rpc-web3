For any EVM chain

Query Format

```
INPUTS=<param1>,<param2>,...<paramN> FUNCTION=<functionName> yarn script <blockchainName> <blockchainNetwork>
```

----------- Function List ----------------

- averageBlockTimeInSec
- queryBalance
- convertTimeToBlockNumber
- historicalBalance
- queryByBlockNumber
- queryByTransactionHash
- queryNetworkStatus

----------- Example ----------------

```
FUNCTION=averageBlockTimeInSec yarn script <blockchainName> <blockchainNetwork>
FUNCTION=averageBlockTimeInSec yarn script cronos mainnet
```
```
INPUTS=<address> FUNCTION=queryBalance yarn script <blockchainName> <blockchainNetwork>
```
```
INPUTS=<address> FUNCTION=historicalBalance yarn script <blockchainName> <blockchainNetwork>
```
```
INPUTS=<address>,<fromBlock>,<interval>,<toBlock> FUNCTION=historicalBalance yarn script <blockchainName> <blockchainNetwork>
```
```
INPUTS=<blockNumber> FUNCTION=queryByBlockNumber yarn script <blockchainName> <blockchainNetwork>
```
```
INPUTS=<transactionHash> FUNCTION=queryByTransactionHash yarn script <blockchainName> <blockchainNetwork>
INPUTS=0xd9869b6313aef555a7169cd80f57403a5c60a9edf25155acb6391b863b2f88f8 FUNCTION=queryByTransactionHash yarn script cronos mainnet
```
```
FUNCTION=queryNetworkStatus yarn script <blockchainName> <blockchainNetwork>
FUNCTION=queryNetworkStatus yarn script cronos mainnet
```
