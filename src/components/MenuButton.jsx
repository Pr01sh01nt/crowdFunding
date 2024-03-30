"use client"

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const MenuButton = () => {
    const [isOpened, setIsOpened] = useState(false);
    const navigate = useRouter();

    let state = "hidden";
    if (isOpened) state = "flex";
    else state = "hidden";

    const handleClick = () => {
        setIsOpened(true);
        console.log('helo');
    }

    const handleClose = (e) => {
        e.stopPropagation();
        // console.log(e.target);
        // console.log(e.target.value );
        if(e.target.value=="campaigns")
          {
              console.log("camp");
            //shows all campaigns
          }
        else if(e.target.value == "dashboard")
        {
            navigate.push("/");
            // show campaigns started by the current account
        }
        else if(e.target.value == "createCampaign")
        {
            console.log("createc");
            navigate.push("/createCampaign");
        }
        setIsOpened(false);
    }

    return (
        <>
            <button
                className="bg-[rgb(84,112,205)]   rounded-bl-[100%]   rounded-br-[100%] pt-[25px]   pb-[50px] sm2:px-[10%] px-[6%]"
                onClick={handleClick}
            >
                {
                    isOpened ? <>
                        <CloseIcon sx={{ typography: 'h3', zIndex: 'tooltip' }} className='z-[10] fixed' onClick={handleClose} />
                        <CloseIcon sx={{ typography: 'h3', zIndex: 'tooltip' }} onClick={() => { setIsOpened(false) }} />
                    </>
                        :
                        <MenuIcon sx={{ typography: 'h3' }} />
                }
            </button>
            <div className={`fixed bg-[rgba(0,0,0,0.36)] top-0 min-w-full min-h-screen  ${state} flex-col`}>
                <div className="flex flex-row sm2:justify-around  sm2:px-[0px] px-[10px] justify-between">
                    <Button
                        varaint="contained"
                        className="bg-[rgb(255,224,224)] mt-2 mb-10"
                        value="campaigns"
                        onClick = {handleClose}
                    >
                        CAMPAIGNS
                    </Button>   

                    <Button
                        varaint="contained"
                        className="bg-[rgb(255,224,224)] mt-2 mb-10 sm2:mr-0"
                        value="createCampaign"
                        onClick = {handleClose}
                    >
                        CREATE<br /> CAMPAIGN
                    </Button>

                </div>
                <div className="flex justify-center">
                    <Button
                        varaint="contained"
                        className="bg-[rgb(255,224,224)]"
                        value="dashboard"
                        onClick = {handleClose}
                    >
                        DASHBOARD
                    </Button>
                </div>

            </div>
        </>
    )
}

export default MenuButton
