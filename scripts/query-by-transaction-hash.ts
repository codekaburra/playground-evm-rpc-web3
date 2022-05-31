import { stringifyWithFormat } from "../utils/print-util";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { weiToEth } from "../utils/unit-util";
import { IChainInfo } from "../interfaces";

/*
  How to call :

  INPUTS=<transactionHash> FUNCTION=queryByTransactionHash yarn script cronos testnet3
  INPUTS=0xd9869b6313aef555a7169cd80f57403a5c60a9edf25155acb6391b863b2f88f8 FUNCTION=queryByTransactionHash yarn script cronos testnet3
  INPUTS=0xd9869b6313aef555a7169cd80f57403a5c60a9edf25155acb6391b863b2f88f8 FUNCTION=queryByTransactionHash yarn script cronos mainnet
*/

export const queryByTransactionHash = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  const [transactionHash] = inputs;
  console.log("------------------- transaction ------------------------");
  const transaction = await web3.eth.getTransaction(transactionHash);
  console.log("transaction", stringifyWithFormat(transaction));
  console.log("------------------- transactionReceipt ------------------------");
  const transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
  console.log("transactionReceipt", stringifyWithFormat(transactionReceipt));
  console.log("------------------- block ------------------------");
  const block = await web3.eth.getBlock(transactionReceipt.blockNumber);
  console.log("block", stringifyWithFormat(block));
  console.log("------------------- Fee ------------------------");
  const feeInBaseUnit = new BigNumber(transactionReceipt.gasUsed).multipliedBy(transaction.gasPrice);
  const bugFeeInBaseUnit = new BigNumber(transaction.gas).multipliedBy(transaction.gasPrice);
  console.log(`Fee : 
  gasUsed ${transactionReceipt.gasUsed}
  gasPrice ${transaction.gasPrice}
  fee  BaseUnit ${feeInBaseUnit} = NormalUnit ${weiToEth(feeInBaseUnit)}
  fee  BaseUnit ${bugFeeInBaseUnit} = NormalUnit ${weiToEth(bugFeeInBaseUnit)} <--- failed Txn 's bug 
  `);
  if (transactionReceipt.status === false) {
    console.log("--------------------------------------------------");
    console.log("---------- This is a Failed Transaction !!! ------");
    console.log("--------------------------------------------------");
  }
  return { transaction, transactionReceipt, block, feeInBaseUnit };
};
