# Wiki Wager

## aka Wiki Crypto Bet

## aka turk2023

### [wikiwager.xyz](https://wikiwager.xyz)

# how tu run

- cd functions-...

- yarn install

- npx env-enc set

PRIVATE_KEY
SEPOLIA_RPC_URL
OPEN_AI_API_KEY
ETHEREUM_SEPOLIA_RPC_URL
GITHUB_API_TOKEN
ETHERSCAN_API_KEY

- yarn compile

- deploy on sepolia and get contract address

- add contract address to subscription

- cp build/artifacts/contracts/WikiWager.sol/WikiWager.json ../web/artifacts/

- cd ../web

- yarn install

- update src/pages/turkey-2023.js with contract address

- yarn dev

- visit http://localhost:3000 to make a bet

- cd ../functions-hardhat-starter-kit/

- npx hardhat functions-request --subid SUB_ID --contract CONTRACT_ADDRESS --network ethereumSepolia

- fullfill (owner press button Declare via DON)

- make another request in 5 mitnutes
  npx hardhat functions-request --subid SUB_ID --contract CONTRACT_ADDRESS --network ethereumSepolia

- fullfill (owner press button Declare via DON)

- user can clain winnings by prossing 'Clain winnings button'
