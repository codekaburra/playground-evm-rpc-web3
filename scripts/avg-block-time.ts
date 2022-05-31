import BigNumber from "bignumber.js";
import Web3 from "web3";
import moment, { DurationInputArg2 } from "moment";
import { IChainInfo } from "../interfaces/index";

/*
  How to call :

  FUNCTION=averageBlockTimeInSec yarn script cronos testnet3
*/
export const averageBlockTimeInSec = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  const [interval] = inputs;
  const blockHeight = new BigNumber(await web3.eth.getBlockNumber());
  const fromBlock = await web3.eth.getBlock(blockHeight.gt(interval) ? blockHeight.minus(interval) : 1);
  const toBlock = await web3.eth.getBlock(blockHeight);
  const averageBlockTimeInSec = (new BigNumber(toBlock.timestamp).minus(fromBlock.timestamp))
    .div(new BigNumber(toBlock.number).minus(fromBlock.number));
  console.log(chainInfo, ` with averageBlockTime = ${averageBlockTimeInSec} sec`);
  for (const period of ["seconds", "minutes", "hours", "days", "weeks", "months", "years"]) {
    console.log(
      ` - 1 ${period} : \t ${new BigNumber(moment.duration(1, period as DurationInputArg2).as("seconds")).dividedBy(averageBlockTimeInSec)}`,
    );
  }
  return averageBlockTimeInSec;
};
