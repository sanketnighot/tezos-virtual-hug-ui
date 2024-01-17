import { dappClient } from "./walletconnect";
import { char2Bytes } from "@taquito/utils";
import { NFT_CONTRACT_ADDRESS, HUX_CONTRACT_ADDRESS, API } from './config';
import axios from "axios";
import token_metadata from "./token_metadata_format.json"
import nft_images from "./nft_images.json"

export const getTotalNftsMinted = async () => {
    return parseInt((await axios.get(`${API}/v1/contracts/${NFT_CONTRACT_ADDRESS}/storage`)).data.all_tokens)
}


export const sendHug = async (toAddress) => {
    getTotalNftsMinted()
    await dappClient().CheckIfWalletConnected()
    const myAddress = await dappClient().getAccount()
    const tezos = await dappClient().tezos();
    const nft_description = `This is Non Fungible token representing a virtual hug between ${myAddress.account.address} and ${toAddress}`
    const nft_name = `${myAddress.account.address} Hugs ${toAddress}`
    const nft_metadata = token_metadata
    let dateobj = new Date().toISOString();
    nft_metadata["date"] = dateobj
    nft_metadata["name"] = nft_name
    nft_metadata["description"] = nft_description
    const totalNfts = await getTotalNftsMinted()
    if (totalNfts < 42) {
        nft_metadata["image"] = nft_images[totalNfts].ipfs
        nft_metadata["thumbnailUri"] = nft_images[totalNfts].ipfs
        nft_metadata["artifactUri"] = nft_images[totalNfts].ipfs
    } else {
        return
    }
    console.log("Uploading to IPFS")
    const res = await axios.post("/api/ipfs", { data: nft_metadata })
    console.log(res.data.hash, res.data.hash)
    if (res.data.status === "error") {
        return false
    }
    const nft_contract = await tezos.wallet.at(NFT_CONTRACT_ADDRESS)
    const hux_contract = await tezos.wallet.at(HUX_CONTRACT_ADDRESS)
    const metadata = char2Bytes(`ipfs://${res.data.hash}`)
    console.log("Signing and Sending Transaction")
    console.log(myAddress.account.address)
    const batch = await tezos.wallet.batch()
        .withContractCall(hux_contract.methods.update_operators([
            {
                add_operator: {
                    owner: myAddress.account.address,
                    operator: NFT_CONTRACT_ADDRESS,
                    token_id: 0
                }
            }
        ]))
        .withContractCall(nft_contract.methods.send_hug(toAddress, { "": metadata }))
        .withContractCall(hux_contract.methods.update_operators([
            {
                remove_operator: {
                    owner: myAddress.account.address,
                    operator: NFT_CONTRACT_ADDRESS,
                    token_id: 0
                }
            }
        ])).send()

    await batch.confirmation()
    return batch.opHash
}
