// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.8;

contract CampaignFactory{

    address[] public deployedCampaign;

    event campaignCreated(
        string title,
        uint requiredAmount,
        address indexed owner,
        address campaignAddress,
        string imageURI,
        string category,
        uint indexed timestamp
    );

    function createCampaign(
        string memory campaignTitle,
        uint requiredCampaignAmount,
        string memory imgURI,
        string memory category,
        string memory storyURI)public
        {
            Campaign newCampaign = new Campaign(campaignTitle, requiredCampaignAmount, imgURI, storyURI, msg.sender);

            deployedCampaign.push(address(newCampaign));

            emit campaignCreated(campaignTitle, requiredCampaignAmount, msg.sender, address(newCampaign), imgURI, category, block.timestamp);
        }
}


contract Campaign{
    string public title;
    uint public requiredAmount;
    string public image;
    string public story;
    address payable  public owner;
    uint public recievedAmount;

    event donated(address indexed donar, uint indexed amount, uint indexed timestamp);



    constructor(
        string memory campaignTitle,
        uint requiredCampaignAmount,
        string memory imgURI,
        string memory storyURI,
        address  _owner
    ) {
        title = campaignTitle;
        requiredAmount = requiredCampaignAmount;
        image = imgURI;
        story = storyURI;
        owner = payable(_owner);
    }
    
    function donate() public payable{

        require(requiredAmount>recievedAmount,"required amount fuilfilled");


        owner.transfer(msg.value);
        recievedAmount += msg.value;

        emit donated(msg.sender, msg.value, block.timestamp);
    }
}

