const hre = require("hardhat");

async function main() {
 
    const CampaignFactory  = await hre.ethers.getContractFactory("CampaignFactory");
    console.log("starting deployment of factory contract......");
    const campaignFactory = await CampaignFactory.deploy();

    
    await campaignFactory.waitForDeployment();


    console.log("Factory deployed to : ",campaignFactory.target);
    // console.log("Factory deployed to : ",campaignFactory);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
