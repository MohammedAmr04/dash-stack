"use client";
import "@/app/[locale]/globals.css";
import UiProvider from "@/services/context/UiProvider";
import { Button } from "antd";
import { redirect } from "next/navigation";

async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
   let locale = "en";
   if (params) {
      locale = (await params).locale;
   }

   return (
      <UiProvider locale={locale}>
         <div className="w-screen h-screen">
            <div
               className="w-screen h-screen bg-cover bg-center flex justify-center items-center"
               style={{ backgroundImage: "url('/MainBgHD.png')" }}>
               <div className="absolute inset-0 flex items-center justify-center">
                  <img
                     src="/ShapeHD.png"
                     alt="Overlay Object"
                     className="w-full h-full object-cover"
                  />
               </div>
               <div className="z-1 text-text flex justify-center items-center flex-col bg-transparent rounded-3xl md:bg-foreground md:text-2xl text-xs">
                  <img
                     src="/404.png"
                     alt="404 not found"
                     width={400}
                     height={400}
                     className="mx-30 mt-25"
                  />
                  <div className="flex flex-col my-25">
                     <h1 className="mb-9 font-bold text-3xl">
                        Looks like you’ve got lost….
                     </h1>
                     <Button
                        size="large"
                        color="primary"
                        type="primary"
                        style={{ height: 50 }}
                        onClick={() => redirect("/dashboard")}>
                        <div className="mx-30 my-4">Back to Dashboard</div>
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </UiProvider>
   );
}

export default NotFound;
