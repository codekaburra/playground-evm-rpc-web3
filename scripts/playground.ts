import { stringifyWithFormat } from "../utils/print-util";
import Web3 from "web3";
import { NodeUrl } from "../networks/cronos";
import BigNumber from "bignumber.js";
import { IChainInfo } from "../interfaces";

/*
  How to call :

  FUNCTION=playground yarn script cronos testnet3
*/
export const playground = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  const [interval] = inputs;
  const address = "0xc9219731ADFA70645Be14cD5d30507266f2092c5";
  const nonce = await web3.eth.getTransactionCount(address);
  console.log(address, "nonce", stringifyWithFormat(nonce));
};
