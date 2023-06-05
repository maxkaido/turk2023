const fs = require("fs")

// Loads environment variables from .env.enc file (if it exists)
require("@chainlink/env-enc").config()

const Location = {
  Inline: 0,
  Remote: 1,
}

const CodeLanguage = {
  JavaScript: 0,
}

const ReturnType = {
  uint: "uint256",
  uint256: "uint256",
  int: "int256",
  int256: "int256",
  string: "string",
  bytes: "Buffer",
  Buffer: "Buffer",
}

// Configure the request by setting the fields below
const requestConfig = {
  // Location of source code (only Inline is currently supported)
  codeLocation: Location.Inline,
  // Code language (only JavaScript is currently supported)
  codeLanguage: CodeLanguage.JavaScript,
  // String containing the source code to be executed
  source: fs.readFileSync("./wiki_outcome.js").toString(),
  //source: fs.readFileSync('./API-request-example.js').toString(),
  // Secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey). The secrets object can only contain string values.
  secrets: { openaiApiKey: process.env.OPEN_AI_API_KEY ?? "" },
  // Per-node secrets objects assigned to each DON member. When using per-node secrets, nodes can only use secrets which they have been assigned.
  perNodeSecrets: [],
  // ETH wallet key used to sign secrets so they cannot be accessed by a 3rd party
  walletPrivateKey: process.env["PRIVATE_KEY"],
  // Args (string only array) can be accessed within the source code with `args[index]` (ie: args[0]).
  args: [
    "https://en.wikipedia.org/api/rest_v1/page/html/2023_Turkish_presidential_election",
    "What is the outcome of the 2023 Turkish presidential election? Please respond exactly with 'Erdogan' if Erdogan won, 'Kemal' if Kemal won, or 'n/a' if the result is not known or uncertain. Do not put a dot at the end",
  ],
  // Expected type of the returned value
  expectedReturnType: ReturnType.uint256,
  // Redundant URLs which point to encrypted off-chain secrets
  secretsURLs: [],
}

module.exports = requestConfig
