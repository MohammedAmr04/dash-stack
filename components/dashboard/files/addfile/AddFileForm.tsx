"use client";
import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button, DatePicker, Form, Input, notification, Upload } from "antd";
import { FormInstance } from "antd/lib";

const { Dragger } = Upload;
const { TextArea } = Input;

interface FormValues {
   title: string;
   description: string;
   fileList: any[];
}

const AddFileForm: React.FC = () => {
   // TODO: get user from supabase and attach it in the supabase insertion
   const supabase = createClientComponentClient();
   const [api, contextHolder] = notification.useNotification();
   const [loading, setLoading] = useState(false);
   const [form] = Form.useForm<FormValues>();

   const showError = (message: string, description?: string) => {
      api.error({
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

   const handleSubmit = async (values: FormValues) => {
      try {
         setLoading(true);

         if (!values.fileList || values.fileList.length === 0) {
            showError("Validation Error", "Please upload at least one file");
            return;
         }

         const file = values.fileList?.[0]?.originFileObj as File | undefined;
         if (!file) {
            showError("Validation Error", "Please select a valid file");
            return;
         }

         const isLt10M = file.size / 1024 / 1024 < 10;
         if (!isLt10M) throw new Error("File must be smaller than 10MB");

         const isPdf = file.type === "application/pdf";
         if (!isPdf) throw new Error("Only PDF files are allowed");

         const fileExt = file.name.split(".").pop();
         const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}.${fileExt}`;
         const filePath = `uploads/${fileName}`;

         const { error } = await supabase.storage
            .from("files")
            .upload(filePath, file, { contentType: file.type });

         if (error) throw error;

         const {
            data: { publicUrl },
         } = supabase.storage.from("files").getPublicUrl(filePath);

         console.log("File uploaded successfully on submit:", publicUrl);

         const formData = {
            title: values.title,
            description: values.description,
            files: [
               {
                  name: file.name,
                  url: publicUrl,
                  size: file.size,
                  type: file.type,
               },
            ],
         };

         console.log("Form submitted with data:", formData);

         try {
            const { data, error: dbError } = await supabase
               .from("files")
               .insert([
                  {
                     name: values.title,
                     description: values.description,
                     destination_url: publicUrl,
                  },
               ])
               .select();
            if (dbError) throw dbError;
         } catch (dbError) {
            showError("Database Error", (dbError as Error).message);
         }

         showSuccess("File Uploaded successfully!");
         form.resetFields();
      } catch (error) {
         console.error("Submit error:", error);
         showError("Submit Failed", (error as Error).message);
      } finally {
         setLoading(false);
      }
   };

   const props: UploadProps = {
      name: "file",
      multiple: false,
      accept: ".pdf",
      disabled: loading,
      beforeUpload: () => false, // ✅ Prevent auto upload
      showUploadList: {
         showPreviewIcon: true,
         showDownloadIcon: true,
         showRemoveIcon: true,
      },
      onPreview: (file) => {
         const url = (file as any).url || (file as any).response;
         if (url) {
            window.open(url, "_blank");
         }
      },
   };

   return (
      <>
         {contextHolder}
         <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
            style={{ maxWidth: 800, width: "100%" }}
            onFinish={handleSubmit}
            initialValues={{ fileList: [] }}>
            <Form.Item
               label="Title"
               name="title"
               rules={[
                  { required: true, message: "Please enter a title" },
                  { min: 3, message: "Title must be at least 3 characters" },
               ]}>
               <Input placeholder="Enter file title" />
            </Form.Item>

            <Form.Item
               label="Description"
               name="description"
               rules={[
                  { required: true, message: "Please enter a description" },
                  {
                     min: 10,
                     message: "Description must be at least 10 characters",
                  },
               ]}>
               <TextArea
                  rows={4}
                  placeholder="Enter file description"
                  maxLength={500}
                  showCount
               />
            </Form.Item>

            <Form.Item
               label="Upload"
               name="fileList"
               valuePropName="fileList"
               getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
               rules={[{ required: true, message: "Please upload a file" }]}>
               <Dragger
                  {...props}
                  className="p-8 w-full bg-foreground rounded-xl shadow-sm">
                  <p className="ant-upload-drag-icon text-primary">
                     <InboxOutlined style={{ fontSize: "48px" }} />
                  </p>
                  <p className="ant-upload-text text-lg font-medium">
                     {loading
                        ? "Upload in progress..."
                        : "Click or drag PDF to upload"}
                  </p>
                  <p className="ant-upload-hint text-text">
                     Maximum file size: 10MB. Only PDF files accepted.
                  </p>
               </Dragger>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
               <div className="flex gap-4">
                  <Button
                     type="primary"
                     htmlType="submit"
                     loading={loading}
                     size="large">
                     {loading ? "Uploading..." : "Upload File"}
                  </Button>
                  <Button
                     htmlType="button"
                     onClick={() => form.resetFields()}
                     disabled={loading}
                     size="large">
                     Reset
                  </Button>
               </div>
            </Form.Item>
         </Form>
      </>
   );
};

export default AddFileForm;
