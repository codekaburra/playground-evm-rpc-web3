import { stringifyWithFormat } from "../utils/print-util";
import Web3 from "web3";
import { NodeUrl } from "../networks/cronos";
import { weiToEth } from "../utils/unit-util";
import BigNumber from "bignumber.js";
import { IChainInfo } from "../interfaces";

/*
  How to call :

  INPUTS=<address>,<fromBlock(optional)>,<interval(optional)>,<toBlock(optional)> FUNCTION=historicalBalance yarn script cronos testnet3
  INPUTS=0x6aa0777500181b4183a3c5a678a367b13733e615 FUNCTION=historicalBalance yarn script cronos testnet3
  INPUTS=0x6aa0777500181b4183a3c5a678a367b13733e615,0,10000,190000 FUNCTION=historicalBalance yarn script cronos testnet3
*/

const printNormalUnitOnly: boolean = true;

export const historicalBalance = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  const currentBlockheight = await web3.eth.getBlockNumber();
  const [address, fromBlockStr, intervalStr, toBlockStr] = inputs;
  const fromBlock = new BigNumber(fromBlockStr || 0);
  const interval = new BigNumber(intervalStr || 1000);
  const toBlock = new BigNumber(toBlockStr || currentBlockheight);

  console.log(stringifyWithFormat({ address, fromBlock, toBlock, interval }));
  console.log("------------------- balance ------------------------");
  const numberOfHistorySnapshot = toBlock.minus(fromBlock).dividedToIntegerBy(interval).toNumber();
  for (let index = 0; index <= numberOfHistorySnapshot; index++) {
    const blockHeight = fromBlock.plus(interval.multipliedBy(index));

    const balance = await getBalanceByAddressAtBlockHeight(web3, address, blockHeight);
    console.log(
      `${index}) \t @ ${blockHeight}: \t`,
      printNormalUnitOnly ? balance.normalUnit.toString(10) : stringifyWithFormat(balance),
    );
  }
};

export const getBalanceByAddressAtBlockHeight = async (web3:Web3, address: string, blockHeight: BigNumber) => {
  const baseUnit: string = await web3.eth.getBalance(address, blockHeight.toString());
  const normalUnit = weiToEth(baseUnit);

  return {
    baseUnit,
    normalUnit,
  };
};
