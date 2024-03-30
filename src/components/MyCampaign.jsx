"use client"

import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"
import { ethers } from "ethers";
import { useEffect, useState } from "react"
import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { NavigateBefore } from "@mui/icons-material";
import { useRouter } from "next/navigation";


const MyCampaign = () => {

  const [campaigns, setCampaigns] = useState([]);
  const navigate = useRouter();

  useEffect(() => {
    console.log("from useEffect")

    const getEvents = async () => {

      try{

        const provider = new ethers.JsonRpcProvider(
          // "http://localhost:8545"
          // process.env.NEXT_PUBLIC_RPC_URL
        );
        const signer = await provider.getSigner();
        console.log(signer, signer.address);
  
        console.log(await provider.getBlockNumber());
        // console.log(await provider.getBalance(signer.address));
        console.log(provider);
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_HARDHAT_ADDRESS,
          CampaignFactory.abi,
          provider
        );
  
        
  
        const getCampaign = contract.filters.campaignCreated(null, null, null, null, null, null, null);
        const data = await contract.queryFilter(getCampaign);
        console.log(data);
        const campaignData = data.map((e) => {
          return {
            title: e.args[0],
            requiredAmount: ethers.formatEther(e.args[1]),
            owner: e.args[2],
            campaignAddress: e.args[3],
            imageURI: e.args[4],
            category: e.args[5],
            // timestamp:   String(new Date(parseInt(e.args[6]))),
            timestamp: (new Date(parseInt(e.args[6]))).toLocaleString(),
          }
        })
  
        // console.log( ethers.decodeBytes32String(campaignData[0].category.hash));
  
        console.log(campaignData);
        setCampaigns(campaignData);
        console.log("points");

      }catch(err)  
      {
        console.error(err);
      }  
    }
    getEvents();

  }, [])


  const handleClick = (campaignAddress)=>{
    navigate.push(`/${campaignAddress}`);
  }

  return (
    <div className="flex justify-around min-w-full flex-wrap">
      

      {campaigns?.map((campaign) =>

        <Card sx={{ maxWidth: 345 }} onClick={()=>{handleClick(campaign.campaignAddress)}}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={`https://ipfs.io/ipfs/${campaign.imageURI}`}
              alt="image"
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                {campaign.title}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {campaign.requiredAmount}ETH

              </Typography>
              <Typography variant="body2" color="text.primary">
                {campaign?.timestamp}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {campaign.category}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {campaign.owner.slice(0,6)}...{campaign.owner.slice(39)}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

      )}
    </div>
  )
}

export default MyCampaign
