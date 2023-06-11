# Wiki Wager (turk2023)

This project is also known as Wiki Crypto Bet. You can find more information at [sepolia.wikiwager.xyz](http://sepolia.wikiwager.xyz).

https://sepolia.etherscan.io/address/0xdbF8B9ea3458FbBeD982EDE60Dc5685A3Ea90343#code

[hackathon story](/HACKATHON.md)

[changelog](/CHANGELOG.md)

## Setup Instructions

Follow these steps to set up and run the project:

1. **Install Dependencies**
   Navigate to the `functions` directory and install the necessary dependencies:

   ```
   cd functions-hardhat-starter-kit
   yarn install
   ```

2. **Set Environment Variables**
   Use `npx env-enc set` to set the following environment variables:

   ```
   PRIVATE_KEY
   SEPOLIA_RPC_URL
   OPEN_AI_API_KEY
   ETHEREUM_SEPOLIA_RPC_URL
   GITHUB_API_TOKEN
   ETHERSCAN_API_KEY
   ```

3. **Compile the Project**
   Use the following command to compile the project:

   ```
   yarn compile
   ```

4. **Deploy on Sepolia and Get Contract Address**

   ```
   yarn hardhat run --network ethereumSepolia scripts/deployWikiWagerSepolia.js
   ```

   After deploying, make sure to get the contract address.

5. **Add Contract Address to Subscription**
   Add the contract address to your subscription.

   ```
   npx hardhat functions-sub-add --subid SUB_ID --contract CONTRACT_ADDRESS --network ethereumSepolia
   ```

6. **Copy Artifacts**
   Copy the build artifacts to the `web` directory:

   ```
   cp build/artifacts/contracts/WikiWager.sol/WikiWager.json ../web/artifacts/
   ```

7. **Install Web Dependencies**
   Navigate to the `web` directory and install the necessary dependencies:

   ```
   cd ../web
   yarn install
   ```

8. **Update Contract Address**
   Update `src/pages/turkey-2023.js` with the contract address.

9. **Run the Development Server**
   Use the following command to run the development server:

   ```
   yarn dev
   ```

10. **Visit Localhost**
    Open your web browser and visit [http://localhost:3000](http://localhost:3000) to make a bet.

11. **Fulfill the Request**
    Navigate back to the `functions-hardhat-starter-kit` directory:

    ```
    cd ../functions-hardhat-starter-kit/
    ```

    Use the following command to fulfill the request:

    ```
    npx hardhat functions-request --subid SUB_ID --contract CONTRACT_ADDRESS --network ethereumSepolia
    ```

    Press the "Declare via DON" button to fulfill the request.

12. **Repeat Request and Fulfillment**
    After 5 minutes, repeat the request and fulfillment process.

13. **Claim Winnings**
    Users can claim their winnings by pressing the "Claim winnings" button.

Please note that you'll need to replace `SUB_ID` and `CONTRACT_ADDRESS` with your actual subscription ID and contract address, respectively.
