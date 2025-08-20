"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/supabaseClient";
import { RPDefaultLayout, RPPages, RPProvider } from "@pdf-viewer/react";
import { Breadcrumb } from "antd";
import { Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FileData {
   id: number;
   name: string;
   short_url: string;
   destination_url: string;
}

interface PreviewFileProps {
   url: string;
}

const PreviewFile = ({ url }: PreviewFileProps) => {
   const [file, setFile] = useState<FileData | null>(null);
   const [loading, setLoading] = useState(true);
   const router = useRouter();

   useEffect(() => {
      const fetchFile = async () => {
         const supabase = await createClient();

         setLoading(true);
         const { data, error } = await supabase
            .from("files")
            .select("*")
            .eq("short_url", url)
            .single();

         if (error) {
            console.error("Error fetching file:", error.message);
            setFile(null);
         } else {
            setFile(data);
         }

         setLoading(false);
      };

      if (url) fetchFile();
   }, [url]);

   if (loading) return <p>Loading PDF...</p>;
   if (!file) return <p>File not found</p>;

   return (
      <>
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
         </header>
         <RPProvider src={file.destination_url}>
            <RPDefaultLayout>
               <div className="h-screen p-5 w-full">
                  <RPPages />
               </div>
            </RPDefaultLayout>
         </RPProvider>
      </>
   );
};

export default PreviewFile;
