import React from "react";
import { Breadcrumb, Form } from "antd";
import Link from "next/link";
import AddFileForm from "./AddFileForm";

const AddFilePage = async () => {
   return (
      <>
         <div className="flex justify-between items-center flex-col w-full h-[40%]">
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
            <div className="flex justify-center items-center flex-col w-full h-[40%] p-4">
               <AddFileForm></AddFileForm>
            </div>
         </div>
      </>
   );
};

export default AddFilePage;
