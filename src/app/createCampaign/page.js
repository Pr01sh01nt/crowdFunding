"use client"

import { Box, Button, ImageList, ImageListItem, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import styled from "@emotion/styled";

import { ethers } from "ethers";
import CampaignFactory from '../../../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/ipfs";

import {Merienda} from 'next/font/google';

const merienda = Merienda({ subsets: ['latin'] })


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

                if (data.get('amount') < 0) throw new Error("amount can't be negative");

                setUploadLoading(true);

                // console.log("uploading images");
                const imageRes = await uploadFileToIPFS(data.get('images'));

                // console.log("uploading json");
                const jsonRes = await uploadJSONToIPFS(data.get('story'));

                // saving to blockchain

                // console.log(imageRes, "ipfs of image");
                // console.log(jsonRes, "ipfs to json");


                // console.log("saving to blockchain");

                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                // console.log(signer, signer.address);

                const contract = new ethers.Contract(
                    process.env.NEXT_PUBLIC_ADDRESS,
                    CampaignFactory.abi,
                    signer
                );


                // console.log(data.get('category'), "category");
                const tx = await contract.createCampaign(
                    data.get('title'),
                    ethers.parseEther(data.get('amount')),
                    imageRes.IpfsHash,
                    // "s",
                    data.get('category'),
                    jsonRes.IpfsHash,
                    // "json"
                )

                await tx.wait();
                // console.log(tx);

                setUploadLoading(false);

            }
            else throw new Error("fill all the fields");


        } catch (err) {
            setUploadLoading(false);
            console.error(err);
        }

    }

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400 mt-40">

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                // noValidate
                >
                    <Box
                        component="fieldset"
                        className="border-2 p-12 rounded-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] text-white"
                    >
                        <Typography
                            variant="h5"
                            component="h5"
                            align="center"
                            sx={{mb:4}}
                            className={merienda.className}
                        >

                        Create Campaign
                        </Typography>
                        <div className="mb-2">
                            <TextField
                                label="Title"
                                required
                                name="title"
                                className="min-w-[200px]"
                            />
                        </div>

                        <div className="mb-2">
                            <TextField
                                multiline
                                label="Story"
                                required
                                name="story"
                                className="min-w-[200px]"
                            />
                        </div>


                        <div className="mb-2">
                            <TextField
                                type="number"
                                label="Required Amount"
                                required
                                name="amount"
                                className="min-w-[200px]"
                            />
                        </div>


                        <div  >
                            <InputLabel id="campaignCategory-label">Category</InputLabel>
                            <Select
                                labelId="campaignCategory-label"
                                id="campaignCategory"
                                // label="Category"
                                name="category"
                                autoWidth
                                required
                                sx={{ minWidth: 200 }}
                            // value=""
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="education">Education</MenuItem>
                                <MenuItem value="health">Health</MenuItem>
                                <MenuItem value="awareness">Awarness</MenuItem>
                            </Select>
                        </div >



                        <Box
                            component="div"
                            className="min-w-[200px] flex flex-col items-center pt-4 pb-4"
                        >

                            <Box
                                component="div"
                                sx={{ maxWidth: 250, maxHeight: 200, overflowY: 'auto', align: 'center' }}
                            >

                                {images && <img src={URL.createObjectURL(images[0])} alt="choosed images" className="max-h-[180px] min-h-[100px]" />}


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
                        <div className="mb-2 mt-2 flex justify-center">

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={uploadLoading}
                                className="bg-[rgb(91,52,142)]"

                            >
                                Start Campaign
                            </Button>
                        </div>
                    </Box>
                </Box >
            </main>
        </>
    );
}
