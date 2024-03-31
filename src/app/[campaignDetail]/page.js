"use client"

import { ethers } from "ethers";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Campaign from "../../../artifacts/contracts/Campaign.sol/Campaign.json";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

const campaignDetail = () => {

  const pathname = usePathname().slice(1);
  const [campaignData, setCampaignData] = useState();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);

  const handleClick = async () => {

    try {

      if (amount <= 0) throw new Error("select desired amount");

      await window.ethereum.request({ "method": "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // console.log(signer, signer.address);

      const contract = new ethers.Contract(
        pathname,
        Campaign.abi,
        signer
      );


      const tx = await contract.donate({ value: ethers.parseEther(amount) });

      tx.wait();
      // console.log(tx);

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // console.log("from useEffect");
    const getEvents = async () => {

      try {

        const provider = new ethers.JsonRpcProvider(
          // "http://localhost:8545"
          process.env.NEXT_PUBLIC_RPC_URL
        );
        // const signer = await provider.getSigner();
        // console.log(signer, signer.address);


        const contract = new ethers.Contract(
          pathname,
          Campaign.abi,
          provider
        );


        const title = await contract.title();
        const requiredAmount = await contract.requiredAmount();
        const image = await contract.image();
        let story = await contract.story();
        const owner = await contract.owner();
        const recievedAmount = await contract.recievedAmount();




        const getTransactions = contract.filters.donated();
        const data = await contract.queryFilter(getTransactions);
        // console.log(data);

        const transactionData = data.map((e) => {
          return {
            donor: e.args[0],
            amount: ethers.formatEther(e.args[1]),
            timestamp: (new Date(parseInt(e.args[2]))).toLocaleString(),
          }
        });

        // console.log(transactionData);

        story = await fetch(`https://ipfs.io/ipfs/${story}`).then((data) => data.json());
        setCampaignData({
          title: title,
          requiredAmount: ethers.formatEther(requiredAmount),
          image: image,
          story: story,
          owner: owner,
          recievedAmount: ethers.formatEther(recievedAmount)

        });



        setTransactions(transactionData);


      } catch (err) {
        console.error(err);
      }



    }
    getEvents();
  }, []);

  // console.log(campaignData);

  return (
    <>
      <div className="flex flex-col items-center mt-40 min-w-full sm:flex-row">

        <div className="flex flex-col w-[50vw] items-center mb-10 sm:mb-0">
          <div>
            <img
              className="min-w-[30vw] max-w-[40vw] aspect-square rounded-lg mb-2 shadow-[rgba(0,_0,_0,_0.2)_0px_60px_40px_-7px]"
              src={`https://ipfs.io/ipfs/${campaignData?.image}`}
              alt="image"
            />
          </div>
          <Typography
            variant="h2"
            component="h2"
            align="center"
            className="whitespace-normal break-words max-w-[49vw] mt-5"
          >
            {campaignData?.title}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            align="justify"
            className="whitespace-normal break-words max-w-[49vw]"
          >
            {campaignData?.story}
            
             
          </Typography>

        </div>

        <div className="w-[50vw] flex flex-col items-center justify-evenly min-h-[400px]">

          <div className="flex justify-center w-[50vw] sm:flex-row flex-col">
            <TextField
              autoFocus
              label="Send ETH"
              variant="filled"
              type="number"
              // className="bg-[rgb(209,234,135)]"
              onChange={(e) => { setAmount(e.target.value) }}
            />
            <Button
              variant="contained"
              onClick={handleClick}
              className="bg-[rgb(131,140,54)] font-semibold"
            >
              Send {"    "} <SendIcon />
            </Button>
          </div>
          <div className="flex justify-evenly w-[50vw] sm:flex-row flex-col">
            <Button
              variant="contained"
              className="bg-[rgb(202,64,64)] font-semibold whitespace-normal break-words"
            >
              Required Amount<br />
              {campaignData?.requiredAmount} ETH
            </Button>
            <Button
              variant="contained"
              className="bg-[rgb(59,182,59)] font-semibold whitespace-normal break-words"
            >
              Recieved Amount<br />
              {campaignData?.recievedAmount} ETH

            </Button>
          </div>

        </div>

      </div>

      <div className="flex justify-center min-w-full mt-12">
        {/* all transactions shown */}
        <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
          <Table sx={{ maxWidth: 650 }}>
            <TableHead>
              <TableRow className="font-bold ">
                <TableCell className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Donor</TableCell>
                <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Amount(in ETH)</TableCell>
                <TableCell align="right" className="font-extrabold bg-[rgba(0,0,0,0.72)] text-[rgb(255,255,255)] ">Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >

                  <TableCell component="th" scope="row" className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">
                    <Tooltip title={`${transaction.donor}`} arrow>
                      <button className="bg-[rgb(154,146,146)] font-medium text-[rgb(255,255,255)] p-3 rounded-lg" varaint="contained">
                        {`${transaction?.donor.slice(0, 6)}...${transaction?.donor.slice(39)}`}

                      </button>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right"  className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{transaction.amount}</TableCell>
                  <TableCell align="right"  className="font-semibold bg-[rgba(0,0,0,0.57)] text-[rgb(255,255,255)]">{transaction.timestamp}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}

export default campaignDetail;
