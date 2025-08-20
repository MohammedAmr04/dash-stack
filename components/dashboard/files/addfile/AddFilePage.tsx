import React from "react";
import { Breadcrumb, Form } from "antd";
import Link from "next/link";
import AddFileForm from "./AddFileForm";

const AddFilePage = async () => {
   return (
      <>
         <div className="flex items-center flex-col w-full h-full gap-15">
            <div className="flex items-center gap-1 self-start w-full py-4 bg-foreground px-4 rounded-sm shadow-xs">
               <Breadcrumb
                  items={[
                     {
                        title: <Link href={"/dashboard"}>Dashboard</Link>,
                     },
                     {
                        title: <Link href={"/dashboard/files"}>Files</Link>,
                     },

                     {
                        title: "Upload File",
                     },
                  ]}
               />
            </div>
            <div className="flex justify-center items-center flex-col w-[45%] h-[80%] p-4 border-border border-1 bg-foreground rounded-xl">
               <div className="w-full flex items-center justify-center py-10 px-10">
                  <AddFileForm></AddFileForm>
               </div>
            </div>
         </div>
      </>
   );
};

export default AddFilePage;
