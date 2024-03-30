"use client"

import { ethers } from "ethers";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Campaign from "../../../artifacts/contracts/Campaign.sol/Campaign.json";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
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
      console.log(signer, signer.address);

      const contract = new ethers.Contract(
        pathname,
        Campaign.abi,
        signer
      );


      const tx = await contract.donate({ value: ethers.parseEther(amount) });

      tx.wait();
      console.log(tx);

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    console.log("from useEffect")
    const getEvents = async () => {

      try {

        const provider = new ethers.JsonRpcProvider(
          // "http://localhost:8545"
          // process.env.NEXT_PUBLIC_RPC_URL
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
        const story = await contract.story();
        const owner = await contract.owner();
        const recievedAmount = await contract.recievedAmount();




        const getTransactions = contract.filters.donated();
        const data = await contract.queryFilter(getTransactions);
        console.log(data);

        const transactionData = data.map((e) => {
          return {
            donor: e.args[0],
            amount: ethers.formatEther(e.args[1]),
            timestamp: (new Date(parseInt(e.args[2]))).toLocaleString(),
          }
        });

        console.log(transactionData);

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

  console.log(campaignData);

  return (
    <>
      <div className="flex mt-40 min-w-full">

        <div className="flex flex-col w-[50vw]">
          <div>
            <img
              className="max-w-[40vw]"
              src={`https://ipfs.io/ipfs/${campaignData?.image}`}
              alt="image"
            />
          </div>
          <div>
            {campaignData?.story}
          </div>

        </div>

        <div className="w-[50vw]">

          <div>
            <TextField
              autoFocus
              label="Send ETH"
              variant="filled"
              type="number"
              className="bg-[rgb(209,234,135)]"
              onChange={(e) => { setAmount(e.target.value) }}
            />
            <Button
              variant="contained"
              onClick={handleClick}
            >
              Send {"    "} <SendIcon />
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
            >
              Required Amount<br />
              {campaignData?.requiredAmount}ETH
            </Button>
            <Button
              variant="contained"
            >
              Recieved Amount<br />
              {campaignData?.recievedAmount}ETH

            </Button>
          </div>

        </div>

      </div>

      <div className="flex justify-center min-w-full">
        {/* all transactions shown */}
        <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
          <Table sx={{ maxWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Donor</TableCell>
                <TableCell align="right">Amount(in ETH)</TableCell>
                <TableCell align="right">Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >

                  <TableCell component="th" scope="row">
                    <Tooltip title={`${transaction.donor}`} arrow>
                      <Button className="bg-[rgb(154,146,146)]" varaint = "contained">
                        {`${transaction?.donor.slice(0, 6)}...${transaction?.donor.slice(39)}`}

                      </Button>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">{transaction.amount}</TableCell>
                  <TableCell align="right">{transaction.timestamp}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}

export default campaignDetail
