import Web3 from "web3";
import BigNumber from "bignumber.js";
import { getMomentDetails } from "../utils/moment-util";
import { IChainInfo } from "../interfaces";
import { averageBlockTimeInSec } from "./avg-block-time";
import moment from "moment";

/*
  How to call :

  FUNCTION=convertTimeToBlockNumber yarn script cronos mainnet 1638433800000
  FUNCTION=convertTimeToBlockNumber yarn script cronos mainnet 2013-02-08
  FUNCTION=convertTimeToBlockNumber yarn script cronos mainnet 2021-12-02T09:30:26
  FUNCTION=convertTimeToBlockNumber yarn script cronos testnet3 2021-12-02T17:00:00+08:00
  FUNCTION=convertTimeToBlockNumber yarn script cronos mainnet 2021-12-03T18:00:00+08:00
*/

export const convertTimeToBlockNumber = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  const [time] = inputs;
  let inputTime;
  if (new BigNumber(time).isFinite()) {
    inputTime = moment(+time);
  } else {
    inputTime = moment(time);
  }
  const avgBlockTimeInSec = await averageBlockTimeInSec(["100"], web3);
  const latestOnChainBlockNumber = new BigNumber(await web3.eth.getBlockNumber());
  const now = moment();
  const durationInSeconds = moment.duration(inputTime.diff(now)).as("seconds");
  const blockDiff = new BigNumber(durationInSeconds).dividedBy(avgBlockTimeInSec);
  const blockDiffRoundDown = new BigNumber(durationInSeconds).dividedToIntegerBy(avgBlockTimeInSec);
  const blockDiffRoundUp = blockDiff.integerValue();
  const blockTimeAtInputTime = `${blockDiffRoundDown.plus(latestOnChainBlockNumber)} to ${blockDiffRoundUp.plus(
    latestOnChainBlockNumber,
  )}`;
  console.log("inputTime", getMomentDetails(inputTime));
  console.log("now", getMomentDetails(now));
  console.log("durationInSeconds", durationInSeconds);
  console.log(`blockDiff ${blockDiff} (rounded: ${blockDiffRoundDown} | ${blockDiffRoundUp})`);
  console.log("-----");
  console.log(`block Height at ${getMomentDetails(inputTime).inStringHKT} = ${blockTimeAtInputTime}`);
  console.log(`latestOnChainBlockNumber ${latestOnChainBlockNumber}`);
};
