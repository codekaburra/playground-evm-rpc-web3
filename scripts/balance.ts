import { stringifyWithFormat } from "../utils/print-util";
import Web3 from "web3";
import {
  NodeUrl,
  CronosMainnetErc20SmartContractAddress,
  CronosMainnetVVSPairSmartContractAddress,
} from "../networks/cronos";
import { toLaggerUnit, weiToEth } from "../utils/unit-util";
import { ERC20_ABI } from "../abi/erc20";
import { toChecksumAddress } from "web3-utils";
import BigNumber from "bignumber.js";
import { IChainInfo } from "../interfaces";

/*
  How to call :

  INPUTS=<address> FUNCTION=queryBalance yarn script cronos mainnet
  INPUTS=0x08D598D8AB7FC11bAc3F816cFe3DACCF5c29E275 FUNCTION=queryBalance yarn script cronos mainnet
*/
const printAllDetails: boolean = false;

export const queryBalance = async (inputs: string[], web3:Web3, chainInfo?: IChainInfo) => {
  const [address] = inputs;
  console.log("------------------- balance ------------------------");
  console.log("balance", stringifyWithFormat(await getBalanceByAddress(web3, address)));
  console.log("------------------- erc20Balances ------------------------");
  const erc20Balances = await getErc20BalanceByAddress(web3, address, CronosMainnetErc20SmartContractAddress, false);
  console.log("------------------- VVSPairBalances ------------------------");
  const VVSPairBalances = await getErc20BalanceByAddress(web3, address, CronosMainnetVVSPairSmartContractAddress, false);

  if (printAllDetails) {
    console.log("erc20Balances", stringifyWithFormat(erc20Balances));
    console.log("VVSPairBalances", stringifyWithFormat(VVSPairBalances));
  }
};

export const getBalanceByAddress = async (web3: Web3, address: string) => {
  const baseUnit = await web3.eth.getBalance(address);
  const normalUnit = weiToEth(baseUnit);

  return {
    baseUnit,
    normalUnit,
  };
};
export const getErc20BalanceByAddress = async (
  web3: Web3,
  address: string,
  Erc20SmartContractAddress: any,
  hiddenZeroBalance: boolean = true,
) => {
  const erc20Balances = [];
  for (const erc20Name of Object.keys(Erc20SmartContractAddress)) {
    const erc20Address = Erc20SmartContractAddress[erc20Name];
    const tokenContract = new web3.eth.Contract(ERC20_ABI, toChecksumAddress(erc20Address));
    const erc20Config = {
      symbol: await tokenContract.methods.symbol().call(),
      decimal: parseInt(await tokenContract.methods.decimals().call(), 10),
      totalSupply: parseInt(await tokenContract.methods.totalSupply().call(), 10),
      smartContractAddress: toChecksumAddress(erc20Address),
      name: await tokenContract.methods.name().call(),
    };
    const baseUnit = new BigNumber(await tokenContract.methods.balanceOf(address).call());
    const normalUnit = toLaggerUnit(baseUnit, erc20Config.decimal);
    console.log(
      `${erc20Name} ( ${erc20Address} ) : ${baseUnit.toString(10)} = ${normalUnit.toString(10)} ${erc20Name}`,
    );
    const erc20Balance = {
      erc20Config,
      baseUnit,
      normalUnit,
    };
    if (hiddenZeroBalance && baseUnit.isZero()) {
      continue;
    }
    erc20Balances.push(erc20Balance);
  }
  return erc20Balances;
};
