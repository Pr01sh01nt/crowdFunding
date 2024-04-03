import { Suspense } from "react";
import MyCampaign from "@/components/MyCampaign";

// export const dynamic = "force-dynamic";

export default function Home() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 mt-[39px] ">

        <Suspense fallback={<div>Loading...</div>}>
        <MyCampaign />
    </Suspense>
      </main>
  );
}
