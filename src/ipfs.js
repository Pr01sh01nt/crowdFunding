export async function uploadFileToIPFS(file)
{
    try{
       
    const formData = new  FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
        name: `${Date.now()}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
            },
            body: formData,
        }
    );
    const resData = await res.json();
    console.log("image uploaded to IPFS");
    console.log(resData, "IpfsHash");

    return resData;

    }catch(err)
    {
        console.log(err);
        
    }
    
    return null;
}


export async function uploadJSONToIPFS(JSONData)
{
    
    try{
        const blob = new Blob([JSON.stringify(JSONData)], {
            type: "application/json",
        });
       
        const formData = new  FormData();
        formData.append("file", blob, "data.json");
    
        const metadata = JSON.stringify({
            name: `${Date.now()}.json`,
        });
        formData.append("pinataMetadata", metadata);
    
        const options = JSON.stringify({
            cidVersion: 0,
        });
        formData.append("pinataOptions", options);
    
        const res = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
                },
                body: formData,
            }
        );
        const resData = await res.json();
        console.log("json file uploaded to IPFS");
        console.log(resData, "IpfsHash");
    
        return resData;
    
        }catch(err)
        {
            console.log(err);
            
        }
        
        return null;
}