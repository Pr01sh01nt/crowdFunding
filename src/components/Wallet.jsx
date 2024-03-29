"use client"

import { Button, Tooltip } from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react";


const networks = {
    polygon: {
        "chainId" : `0x${Number(80001).toString(16)}`,
        "chainName" : "Mumbai",
        "rpcUrls" : ["https://endpoints.omniatech.io/v1/matic/mumbai/public"],
        "nativeCurrency": {
            "name": "MATIC",
            "symbol": "MATIC",
            "decimals": 18
        },
        "blockExplorerUrls" : ["https://mumbai.polygonscan.com"]
    },
    gnosis:{
        "blockExplorerUrls": [
            "https://blockscout.com/poa/xdai/"
          ],
       
          "nativeCurrency": {
            "name": "xDAI",
            "symbol": "xDAI",
            "decimals": 18
          },
          "rpcUrls": [
            "https://rpc.ankr.com/gnosis"
          ],
          "chainId": "0x64",
          "chainName": "Gnosis"
    },
    hardhat:{
       
       
          "nativeCurrency": {
            "name": "Ethereum",
            "symbol": "ETH",
            "decimals": 18
          },
          "rpcUrls": [
            "http://127.0.0.1:8545/"
          ],
          "chainId": `0x${Number(31337).toString(16)}`,
          "chainName": "Loalhost"
    },
    
}



const Wallet = () => {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState(null);

    const connectWallet = async ()=>{
        
        try{
            await window.ethereum.request({method : "eth_requestAccounts"});
            const provider = new ethers.BrowserProvider(window.ethereum);
            
            
            // console.log(provider._network.name !== "matic-mumbai");
            // console.log(typeof(provider._network.name));
            console.log((await provider.getNetwork()));
            if(await provider.getNetwork().name !== "matic-mumbai")
            {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            ...networks["hardhat"]
                        }
                    ]
                });
            }
            const  signer = await provider.getSigner();
            console.log(signer,"signer");
            setAddress(signer.address);
            const  totalBalance = ethers.formatEther(await provider.getBalance(signer.address));
            console.log(typeof(totalBalance));
            setBalance(totalBalance);

            
        }catch(err)
        {
            console.error(err);
        }

        // setAddress(provider._getAddress());

    }


  return (
    <>
      <Tooltip title={`${address}`} arrow >
      <button onClick={connectWallet} className="pr-2">
        
          Wallet <br/> {  address&&`${address.substring(0,3)}...${address.slice(39)}`}  
        </button>
    </Tooltip>
    
    {balance?.substring(0,6)}
    </>
  )
}

export default Wallet
