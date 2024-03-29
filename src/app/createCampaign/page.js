"use client"

import { Box, Button, ImageList, ImageListItem, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import styled from "@emotion/styled";

import { ethers } from "ethers";
import CampaignFactory from '../../../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/ipfs";


const VisuallyHiddenInput = styled('input')({
    opacity: 0,
    height: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    // whiteSpace: 'nowrap',
    width: 1,
});

export default function Campaign() {

    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [images, setImages] = useState(null);

    const handleChange = (event) => {
        const length = event.target.files.length;
        let img = [];
        img = Object.values(event.target.files);  // returns array   
        setImages(img);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // return null;
        try {
            const data = new FormData(e.currentTarget);
            
            if (data.get('title') && data.get('story') && data.get('amount') && data.get('category') && data.get('images')) {
                
                console.log("uploading images");
                const imageRes = await uploadFileToIPFS(data.get('images'));

                console.log("uploading json");
                const jsonRes = await uploadJSONToIPFS(data.get('story'));
                
                // saving to blockchain
                
                console.log(imageRes, "ipfs of image");
                console.log(jsonRes, "ipfs to json");
                

                console.log("saving to blockchain");
                setUploadLoading(true);
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                console.log(signer, signer.address);

                const contract = new ethers.Contract(
                    process.env.NEXT_PUBLIC_HARDHAT_ADDRESS,
                    CampaignFactory.abi,
                    signer
                );

                const tx =  await contract.createCampaign(
                    data.get('title'),
                    parseInt(data.get('amount')),
                    imageRes.IpfsHash,
                    data.get('category'),
                    jsonRes.IpfsHash,
                )

                await tx.wait();
                console.log(tx);

                setUploadLoading(false);
                
            }
            else throw new Error("fill all the fields");
            
            
        } catch (err) {
            setUploadLoading(false);
            console.error(err);
        }

    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="mb-2">
                    <TextField
                        label="Title"
                        required
                        name="title"
                    />
                </div>

                <div className="mb-2">
                    <TextField
                        multiline
                        label="Story"
                        required
                        name="story"
                    />
                </div>


                <div className="mb-2">
                    <TextField
                        type="number"
                        label="Required Amount"
                        required
                        name="amount"
                    />
                </div>


                <div  >
                    <InputLabel id="campaignCategory-label">Category</InputLabel>
                    <Select
                        labelId="campaignCategory-label"
                        id="campaignCategory"
                        label="Category"
                        name="category"
                        autoWidth
                        required
                        sx={{ minWidth: 100 }}
                    // value=""
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Education</MenuItem>
                        <MenuItem value={20}>Health</MenuItem>
                        <MenuItem value={30}>Awarness</MenuItem>
                    </Select>
                </div >



                <Box component="div" >

                    <Box
                        component="div"
                        sx={{ maxWidth: 250, maxHeight: 200, overflowY: 'auto' }}
                    >

                        <ImageList variant="masonry" gap={8}>
                            {images?.map((image) =>
                                <ImageListItem key={image.size}>
                                    {console.log(image)}
                                    <img src={URL.createObjectURL(image)} alt="choosed images" />
                                </ImageListItem>
                            )}
                        </ImageList>

                    </Box>



                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<AddAPhotoIcon />}
                    >
                        Add Image
                        <VisuallyHiddenInput
                            type="file"
                            // multiple
                            name="images"
                            accept=".jpg, .jpeg, .png"
                            onChange={handleChange}
                        />
                    </Button>



                </Box>
                <div className="mb-2 mt-2">

                    <Button type="submit" variant="contained" disabled={uploadLoading}>Start Campaign</Button>
                </div>

            </Box >
        </main>
    );
}
