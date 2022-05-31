import { stringifyWithFormat } from "../utils/print-util";
import BigNumber from "bignumber.js";
import { IChainInfo } from "../interfaces";
import Web3 from "web3";

/*
/*
  How to call :

  INPUTS=<blockNumber> FUNCTION=queryByBlockNumber yarn script cronos testnet3
  INPUTS=123 FUNCTION=queryByBlockNumber yarn script cronos testnet3
  INPUTS=456 FUNCTION=queryByBlockNumber yarn script cronos mainnet
*/

export const queryByBlockNumber = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  console.log("------------------- block ------------------------");
  const [blockNumber] = inputs;
  const block = await web3.eth.getBlock(new BigNumber(blockNumber));
  console.log("block", stringifyWithFormat(block));
};
