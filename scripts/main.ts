import Web3 from "web3";
import BigNumber from "bignumber.js";
import { scriptFunctions } from "./index";
import moment from "moment";

let web3: Web3;

const main = async () => {
  const npmConfigArgv: { [key: string]: string[] } = JSON.parse(`${process.env.npm_config_argv}`);
  const [npmScriptCommand, chainName, network] = npmConfigArgv.original;
  const chainConfig = require(`../networks/${chainName}`);
  const nodeUrl = chainConfig.NodeUrl[chainConfig.Network[network.toUpperCase()]];
  console.log(`Going to connect ${nodeUrl} ... `);
  web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
  const inputs = process.env.INPUTS ? process.env.INPUTS.split(",") : [];
  const targetScriptFunction: string = `${process.env.FUNCTION}`;
  console.log(`Going to ${targetScriptFunction} ... with inputs`, inputs);
  await scriptFunctions[targetScriptFunction](inputs, web3, { chainName, network });
};

main();
