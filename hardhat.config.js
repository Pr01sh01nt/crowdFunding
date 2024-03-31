require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({  path: './.env'});

/** @type import('hardhat/config').HardhatUserConfig */

task("accounts", "print all accounts",async(taskArgs, hre)=>{

  const accounts = await hre.ethers.getSigners();
  // console.log(accounts);

    
  
  let i = 0;
  for(const account of accounts)
  {
    i++;
    const address = await account.getAddress();
    // console.log(account.address);
    console.log(`${i} : ${address} have ${await ethers.formatEther(await ethers.provider.getBalance(address))}ETH`);
    
  }



})


module.exports = {
  solidity: "0.8.24",
  defaultNetwork:"sepolia",
  networks:{

    hardhat:{},
    sepolia:{
      url : process.env.NEXT_PUBLIC_RPC_URL,
      accounts: [process.env.NEXT_PUBLIC_PRIVATE_KEY]
    },
    
  }
};