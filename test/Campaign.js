const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");


describe("CreateCampaignContract",function(){
  async function deployFicture(){
      const [owner, addr1, addr2] = await ethers.getSigners();
      // console.log(await res[0].getAddress());
      // console.log(owner.address);
      // console.log(addr1.address);
      // console.log(addr2.address);

      // console.log(await ethers.getSigners());
      const campaign = await ethers.deployContract("Campaign");
      await campaign.waitForDeployment();
      // console.log(campaign.runner.address);
      return [owner, addr1, addr2, campaign];
  };

  

  it("createCampaign", async function(){
    const [owner, addr1, addr2, campaign] = await loadFixture(deployFicture);    

    campaign.connect(addr1).createCampaign(
      "test",
      1,
      "hksdffh",
      "education",
      "jksjkdfjk"
    )
            

         
  })
  
  
})

