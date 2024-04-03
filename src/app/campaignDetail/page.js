
import Detail from "@/components/Detail";
import { Suspense } from "react";


// export const dynamic = "force-dynamic";

const CampaignDetail = () => {



  return (
    <Suspense fallback={<div>Loading...</div>}>


      <Detail />
    </Suspense>
  )
}

export default CampaignDetail;