# Tezos Virtual Hug Project Documentation

# Project Summary

Allow tezos users to virtually "hug" each other and receive a memory of that "hug" on the tezos blockchain. For this, If the exact amount is sent, the contract shall create an NFT from a series of 42 images and send a copy of the NFT to sender and receiver wallet as a keepsake of their $HUX transfer.

# Smart Contract

## Folder Structure

- **Folder Name:** tvh-smart-contracts
- **Main Contract:** contracts/nft_contractpy
- **Test Contract:** contracts/nft_contract.test.py
- **Compiled Michelson Contract:** artifacts/nft_contract.tz

## How to deploy Smart Contract?

1. Go to [https://better-call.dev/deploy](https://better-call.dev/deploy)
2. Open the Michelson Code file from the smart contract folder *artifacts/nft_contract.tz*
3. Click Continue
4. Enter Initial Storage
    - metadata = keep the string field empty and add byte format of contract metadata in bytes format
    - price_of_a_hug = Amount of $HUX to transfer * 10^Decimal.
    eg. if $HUG Cost 1,000,000 HUX and Decimal is 6 then, price_of_hug is
    1,000,000 * 10^6 = 1,000,000,000,000
    - administrator = wallet address of admin
    - max_supply = total $HUG NFT to be minted
    - hux_token_address = Contract address of $HUX token
5. Now Execute the operation and the smart contract will get deployed.

# Fronted


## Folder Structure

- pages
  - /index.js

        This is the file where our all UI  elements code resides

  - /API
    - /ipfs.js

            This code is used to upload NFT metadata to IPFS

- styles

    This folder has the styling code of UI

- utils
  - /config.js

        This is the Main Configuration file we will need to edit

        ```jsx
        // Network Name. For Mainnet use 'mainnet'
        export const NETWORK = 'ghostnet'; 
        
        // RPC URL is used to connect to blockchain 
        // for mainnet use "https://mainnet.ecadinfra.com"
        // Also get more RPC URLs here
        // - "https://tezostaquito.io/docs/rpc_nodes/"
        export const RPC = 'https://ghostnet.ecadinfra.com';
        
        // This is the Explorer URL to track Transaction after Signing it
        //For mainnet it will be 'https://tzkt.io'
        export const EXPLORER = 'https://ghostnet.tzkt.io';
        
        // Smart Contract Address of NFT Contract will be here
        export const NFT_CONTRACT_ADDRESS = 'KT1KWncvw3rj539n3ebqGW3XtWN76MU7X2xE';
        
        // Smart Contract Address of Token Contract will be here
        export const HUX_CONTRACT_ADDRESS = 'KT1SCVXzraYHqoENcg8mkF3fTAr49VzuMFLf';
        
        // Tzkt API Url to check Balance. For mainnet use 'https://api.tzkt.io'
        export const API = "https://api.ghostnet.tzkt.io";
        ```

  - /contract_call.js

        This is the file where the contract call is done to transfer tokens and mint NFT.

    - To update the format follow the following code from line 27

        ```jsx
        const nft_description = `This is Non Fungible token representing a virtual hug between ${myAddress.account.address} and ${toAddress}`
        const nft_name = `${myAddress.account.address} Hugs ${toAddress}`
        const nft_metadata = token_metadata
        let dateobj = new Date().toISOString();
        nft_metadata["date"] = dateobj
        nft_metadata["name"] = nft_name
        nft_metadata["description"] = nft_description
        ```

  - /token_metadata_format.json

        This is the format that will be used while creating NFT Metadata

  - /walletconnect.js

        This is code that helps to connect with the wallet.

- Hidden File
  - .env.local

    This file has 2 important variables. API_KEY and API_SECRET
    These two variables are used for connecting to the pinata API to upload nft_metadata.

    ```jsx
    //format of .env.local file data
    
    // Replace xxxxxxxxx with actual API keys.
    NEXT_PUBLIC_API_KEY=xxxxxxxxxxxx
    NEXT_PUBLIC_API_SECRET=xxxxxxxxxxxxxxxxxxx
    ```

    Note: There is no need to create the file in the folder now if you are not running locally.

    For production deployment Vercel, Netlify, or any other platform ask for Environment Variables you can put these variables at that time.

    ---
