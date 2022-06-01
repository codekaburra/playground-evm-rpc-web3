export const scriptFunctions = {
  ...require("./avg-block-time"),
  ...require("./query-by-block"),
  ...require("./covert-time-to-blocknumber"),
  ...require("./historical-balance-erc20"),
  ...require("./historical-balance"),
  ...require("./playground"),
  ...require("./balance"),
  ...require("./query-by-transaction-hash"),
  // ...require("./decode-cronos-transaction"),
  ...require("./query-network-status"),
};
