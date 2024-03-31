import { Suspense } from "react";
import MyCampaign from "@/components/MyCampaign";


export default function Home() {


  return (
    <Suspense>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 mt-[39px] ">

        <MyCampaign />
      </main>
    </Suspense>
  );
}
