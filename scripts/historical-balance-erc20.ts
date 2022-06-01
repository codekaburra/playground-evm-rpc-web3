/* eslint-disable max-len */
import { stringifyWithFormat } from "../utils/print-util";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { IChainInfo } from "../interfaces";
import fs from "fs";
/*
  How to call :

  INPUTS=<erc20-address>,<address>,<fromBlock(optional)>,<interval(optional)>,<toBlock(optional)>  FUNCTION=historicalBalanceERC20 yarn script cronos testnet3
  INPUTS=0x9278C8693e7328bef49804BacbFb63253565dffD,0x6da172ec29b4c644bfa8e0ef9457d6e748ccd17c,0,10000,190000 FUNCTION=historicalBalanceERC20 yarn script cronos mainnet
  INPUTS=0x9278C8693e7328bef49804BacbFb63253565dffD,0x6da172ec29b4c644bfa8e0ef9457d6e748ccd17c,0,10000 FUNCTION=historicalBalanceERC20 yarn script cronos mainnet
*/

const printNormalUnitOnly: boolean = true;

export const historicalBalanceERC20 = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  const currentBlockheight = await web3.eth.getBlockNumber();
  const [erc20Address, address, fromBlockStr, intervalStr, toBlockStr] = inputs;
  const fromBlock = new BigNumber(fromBlockStr || 0);
  const interval = new BigNumber(intervalStr || 1000);
  const toBlock = new BigNumber(toBlockStr || currentBlockheight);
  const fileName = "ERC20.json";
  const abi = JSON.parse(fs.readFileSync(`abi/${fileName}`, "utf-8"));
  const contract = new web3.eth.Contract(abi, erc20Address);
  const tokenDecimal = await contract.methods.decimals().call();
  const balance = await contract.methods.balanceOf(address).call();

  console.log("------------------- balance ------------------------");
  const numberOfHistorySnapshot = toBlock.minus(fromBlock).dividedToIntegerBy(interval).toNumber();
  for (let index = 0; index <= numberOfHistorySnapshot; index++) {
    const blockHeight = fromBlock.plus(interval.multipliedBy(index));
    const balanceInBaseUnit = await contract.methods.balanceOf(address).call({}, blockHeight.toString(10));
    const balanceInNormalUnit = new BigNumber(balanceInBaseUnit).div(`1E${tokenDecimal}`);
    console.log(
      `${index}) \t @ ${blockHeight}: \t`,
      printNormalUnitOnly ? balanceInNormalUnit.toString(10) : stringifyWithFormat({ balanceInBaseUnit, balanceInNormalUnit }),
    );
  }
};
