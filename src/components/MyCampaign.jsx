"use client"

import { Button, Card, CardActionArea, CardContent, CardMedia, Tooltip, Typography } from "@mui/material"
import { ethers } from "ethers";
import { useEffect, useState } from "react"
// import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import CampaignFactory from '../utils/CampaignFactory.json'
import { NavigateBefore } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import CategoryIcon from '@mui/icons-material/Category';
import Link from "next/link";

const MyCampaign = () => {

  const [campaigns, setCampaigns] = useState([]);
  const navigate = useRouter();
  const searchParam = useSearchParams();
  let [searchParams, setSearchParams] = useState(searchParam?.get('search'));

  if (searchParams !== searchParam?.get('search'))
    setSearchParams(searchParam?.get('search'));

  // console.log(searchParams);

  useEffect(() => {
    console.log("from useEffect")

    const getEvents = async () => {

      try {

        const provider = new ethers.JsonRpcProvider(
          // "http://localhost:8545"
          process.env.NEXT_PUBLIC_RPC_URL
        );



        // console.log(await provider.getBlockNumber());
        // console.log(await provider.getBalance(signer.address));
        // console.log(provider);

        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_ADDRESS,
          CampaignFactory.abi,
          provider
        );

        let filter = null;
        if (searchParams === "dashboard") {

          if (!window.ethereum) {
            alert("Metamask is not installed, please install!!");
            throw new Error("Metamask is not installed!!");
          }

          await window.ethereum.request({ method: "eth_requestAccounts" });

          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await browserProvider.getSigner();
          // console.log(signer, signer.address);
          filter = signer.address;
        }

        const getCampaign = contract.filters.campaignCreated(null, null, filter, null, null, null, null);
        const data = await contract.queryFilter(getCampaign);
        // console.log(data);
        const campaignData = data.map((e) => {
          return {
            title: e.args[0],
            requiredAmount: ethers.formatEther(e.args[1]),
            owner: e.args[2],
            campaignAddress: e.args[3],
            imageURI: e.args[4],
            category: e.args[5],
            timestamp: (new Date(parseInt(e.args[6]))).toLocaleString(),
          }
        })


        console.log(campaignData);
        setCampaigns(campaignData);
        console.log("points");

      } catch (err) {
        console.error(err);
      }
    }
    getEvents();

  }, [searchParams])


 
  return (
  
    <div className="flex justify-around min-w-full flex-wrap">

      {searchParams === "dashboard" ?
        <Typography
          variant="h2"
          component="h2"
          align="center"
          className="min-w-full mb-2"
        >
          My Campaigns
        </Typography> :
        <Typography
          variant="h2"
          component="h2"
          align="center"
          className="min-w-full mb-2"
        >
          Campaigns
        </Typography>
      }
      {campaigns?.map((campaign) =>

        <Link
          href={{
            pathname: '/campaignDetail',
            query: {
              search: campaign.campaignAddress
            }
          }}
          key={campaign.imageURI}
        >
          <Card
            sx={{ maxWidth: 345, mb: 10 }}
            className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] bg-[rgba(176,174,174,0.85)]"
            // onClick={() => { handleClick(campaign.campaignAddress) }}
            
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={`https://ipfs.io/ipfs/${campaign.imageURI}`}
                alt="image"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  align="center"
                >
                  {campaign.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  className="flex justify-between mb-1"
                >
                  <span className="font-bold">
                    Amount Required
                  </span>
                  <span>
                    {campaign.requiredAmount}ETH
                  </span>

                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  className="flex justify-between mb-1"
                >
                  <InsertInvitationIcon />
                  {campaign?.timestamp}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  className="flex justify-between mb-1"
                >
                  <CategoryIcon />
                  {campaign.category}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  className="flex justify-between"
                >
                  Started by:
                  <Tooltip title={`${campaign.owner}`} arrow>
                    <Button className="bg-[rgb(154,146,146)]" varaint="contained">
                      {`${campaign.owner.slice(0, 6)}...${campaign.owner.slice(39)}`}
                    </Button>
                  </Tooltip>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

      )}
    </div>



  )
}

export default MyCampaign
