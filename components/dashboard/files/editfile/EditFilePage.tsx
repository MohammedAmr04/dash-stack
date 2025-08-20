"use client";
import { useEffect, useState } from "react";
import { CopyIcon, TrashSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import FormEditFile from "./formEditFile/FormEditFile";
import { Breadcrumb, Button, Spin } from "antd";
import SidebarEditFile from "./sidebarEditFile/SidebarEditFile";
import Link from "next/link";
import { createClient } from "@/libs/supabase/supabaseClient";
import { FileData } from "../shared/types";

const EditFilePage = ({ id }: { id: string }) => {
   const supabase = createClient();
   const [file, setFile] = useState<FileData | null>(null);
   const [loading, setLoading] = useState(true);
   const [link, setLink] = useState("");
   const [copied, setCopied] = useState(false);
   useEffect(() => {
      const fetchFile = async () => {
         setLoading(true);
         const { data, error } = await supabase
            .from("files")
            .select("*")
            .eq("id", id)
            .single();
         if (error) {
            console.error("Error fetching file:", error);
         } else {
            setLink(data.destination_url);
            setFile(data);
         }
         setLoading(false);
      };

      fetchFile();
   }, [id, supabase]);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-64">
            <Spin size="large" />
         </div>
      );
   }

   if (!file) {
      return (
         <div className="p-6 text-center">
            <p className="text-danger">File not found</p>
         </div>
      );
   }

   const handleCopy = async () => {
      try {
         await navigator.clipboard.writeText(link);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error("Failed to copy: ", err);
      }
   };

   return (
      <div className="grid grid-cols-3">
         <header className="flex col-span-full py-5 px-7 justify-between w-full bg-foreground border-border border-1 rounded-t-2xl">
            <div className="flex items-center gap-1">
               <Breadcrumb
                  items={[
                     {
                        title: <Link href={"/dashboard"}>Dashboard</Link>,
                     },
                     {
                        title: <Link href={"/dashboard/files"}>Files</Link>,
                     },
                     {
                        title: file.name,
                     },
                  ]}
               />
            </div>
            <div className="flex items-center gap-1.5">
               <Button type="default" variant="outlined" onClick={handleCopy}>
                  <CopyIcon size={16} className="me-1" />
                  {copied ? "Copied!" : "Copy Link"}
               </Button>
               <TrashSimpleIcon
                  className="ms-2 !text-danger"
                  size={24}
                  weight="bold"
               />
            </div>
         </header>
         <div className="bg-foreground col-span-2 col-start-1 border-s-1 border-border border-b-1 ltr:rounded-bl-2xl rtl:rounded-br-2xl">
            <FormEditFile file={file} />
         </div>
         <SidebarEditFile file={file} />
      </div>
   );
};

export default EditFilePage;
