"use client";
import { useState } from "react";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { Space, Typography, Input, Button, notification, Select } from "antd";
import { FileData } from "../../shared/types";
import { createClient } from "@/libs/supabase/supabaseClient";

const FormEditFile = ({ file }: { file: FileData }) => {
   const supabase = createClient();

   // states
   const [destinationUrl, setDestinationUrl] = useState(file.destination_url);
   const [name, setName] = useState(file.name);
   const [tag, setTag] = useState(file.tag || "");
   const [description, setDescription] = useState(file.description || "");

   // editable states
   const [isEditingDestination, setIsEditingDestination] = useState(false);
   const [isEditingName, setIsEditingName] = useState(false);
   const [isEditingTag, setIsEditingTag] = useState(false);
   const [isEditingDescription, setIsEditingDescription] = useState(false);

   const [api, contextHolder] = notification.useNotification();

   const showError = (message: string, description?: string) => {
      api.error({
         message,
         description,
         placement: "topRight",
         duration: 4.5,
      });
   };
   const showInfo = (message: string, description?: string) => {
      api.info({
         message,
         description,
         placement: "topRight",
         duration: 4.5,
      });
   };
   const showSuccess = (message: string) => {
      api.success({
         message,
         placement: "topRight",
         duration: 3,
      });
   };

   const handleSave = async (
      field: "destination_url" | "name" | "tag" | "description"
   ) => {
      const updateData: Partial<FileData> = {};
      if (
         field === "destination_url" &&
         destinationUrl !== file.destination_url
      )
         updateData.destination_url = destinationUrl;
      if (field === "name" && name !== file.name) updateData.name = name;
      if (field === "tag" && tag !== file.tag) updateData.tag = tag;
      if (field === "description" && description !== file.description)
         updateData.description = description;

      if (Object.keys(updateData).length === 0) {
         showInfo("No Changes To Save!");
         if (field === "destination_url") setIsEditingDestination(false);
         if (field === "name") setIsEditingName(false);
         if (field === "tag") setIsEditingTag(false);
         if (field === "description") setIsEditingDescription(false);
      }

      const { error } = await supabase
         .from("files")
         .update(updateData)
         .eq("id", file.id);

      if (error) {
         console.error(error);
         showError("Failed to update file");
      } else {
         if (Object.keys(updateData).length == 0) {
            return;
         }
         showSuccess("File updated successfully 🎉");

         if (field === "destination_url") setIsEditingDestination(false);
         if (field === "name") setIsEditingName(false);
         if (field === "tag") setIsEditingTag(false);
         if (field === "description") setIsEditingDescription(false);
      }
   };

   return (
      <>
         {contextHolder}
         <div className="col-span-2 px-20 pt-7">
            {/* Name */}
            <div className="mb-8">
               <div className="flex items-center justify-between">
                  <Typography.Title level={5}>Name</Typography.Title>
                  <PencilSimpleIcon
                     className="!text-primary cursor-pointer"
                     size={24}
                     weight="bold"
                     onClick={() => setIsEditingName(true)}
                  />
               </div>
               <Space.Compact className="w-full">
                  <Input
                     size="large"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     disabled={!isEditingName}
                  />
                  {isEditingName && (
                     <Button
                        size="large"
                        type="primary"
                        onClick={() => handleSave("name")}>
                        Save
                     </Button>
                  )}
               </Space.Compact>
            </div>{" "}
            {/* Description */}
            <div className="mb-8">
               <div className="flex items-center justify-between">
                  <Typography.Title level={5}>Description</Typography.Title>
                  <PencilSimpleIcon
                     className="!text-primary cursor-pointer"
                     size={24}
                     weight="bold"
                     onClick={() => setIsEditingDescription(true)}
                  />
               </div>
               <Space.Compact className="w-full">
                  <Input.TextArea
                     size="large"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     disabled={!isEditingDescription}
                     rows={4}
                  />
                  {isEditingDescription && (
                     <Button
                        size="large"
                        type="primary"
                        onClick={() => handleSave("description")}>
                        Save
                     </Button>
                  )}
               </Space.Compact>
            </div>
            {/* Destination URL */}
            <div className="mb-8">
               <div className="flex items-center justify-between">
                  <Typography.Title level={5}>Destination URL</Typography.Title>
                  <PencilSimpleIcon
                     className="!text-primary cursor-pointer"
                     size={24}
                     weight="bold"
                     onClick={() => setIsEditingDestination(true)}
                  />
               </div>
               <Space.Compact className="w-full">
                  <Input
                     size="large"
                     value={destinationUrl}
                     onChange={(e) => setDestinationUrl(e.target.value)}
                     disabled={!isEditingDestination}
                  />
                  {isEditingDestination && (
                     <Button
                        size="large"
                        type="primary"
                        onClick={() => handleSave("destination_url")}>
                        Save
                     </Button>
                  )}
               </Space.Compact>
            </div>
            {/* ShortLink Section */}
            <div className="mb-8">
               <div className="flex items-center justify-between">
                  <Typography.Title level={5}>ShortLink</Typography.Title>
                  <PencilSimpleIcon
                     className="!text-primary"
                     size={24}
                     weight="bold"
                  />
               </div>
               <Space.Compact className="w-full">
                  <Select size="large" defaultValue="Short.sh" options={[]} />
                  <Input
                     size="large"
                     className="w-full"
                     defaultValue="Link Shortening"
                  />
               </Space.Compact>
            </div>
            {/* Tag */}
            <div className="mb-8">
               <div className="flex items-center justify-between">
                  <Typography.Title level={5}>Tag</Typography.Title>
                  <PencilSimpleIcon
                     className="!text-primary cursor-pointer"
                     size={24}
                     weight="bold"
                     onClick={() => setIsEditingTag(true)}
                  />
               </div>
               <Space.Compact className="w-full">
                  <Input
                     size="large"
                     value={tag}
                     onChange={(e) => setTag(e.target.value)}
                     disabled={!isEditingTag}
                  />
                  {isEditingTag && (
                     <Button
                        size="large"
                        type="primary"
                        onClick={() => handleSave("tag")}>
                        Save
                     </Button>
                  )}
               </Space.Compact>
            </div>
         </div>
      </>
   );
};

export default FormEditFile;
