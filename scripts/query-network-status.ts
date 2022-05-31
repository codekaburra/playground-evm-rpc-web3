import { stringifyWithFormat } from "../utils/print-util";
import Web3 from "web3";
import { NodeUrl } from "../networks/cronos";
import { IChainInfo } from "../interfaces";

/*
  How to call :

  FUNCTION=queryNetworkStatus yarn script cronos testnet3
*/

export const queryNetworkStatus = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  const chainId = await web3.eth.getChainId();
  const blockHeight = await web3.eth.getBlockNumber();
  console.log({ chainId, blockHeight });
  return { chainId, blockHeight };
};
