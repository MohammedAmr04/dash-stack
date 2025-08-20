"use client";
import { Button, QRCode, Tooltip, Typography, Modal } from "antd";
import { FileData } from "../../shared/types";
import { Expand } from "lucide-react";
import { useState } from "react";

const SidebarEditFile = ({ file }: { file: FileData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <aside className="col-span-1 bg-foreground border-border border-1 border-t-0 border-b-1 ltr:rounded-br-2xl rtl:rounded-bl-2xl">
        <div className="py-7 border-b border-border px-5">
          <Typography.Title level={5}>QR Code</Typography.Title>
          <div className="flex justify-center bg-dots py-6 relative rounded-xl">
            <QRCode
              size={120}
              className="mx-auto"
              value={file.destination_url}
            />
          </div>
        </div>
        <div className="py-7 px-5 relative">
          <Typography.Title level={5}>Preview</Typography.Title>
          <div className="absolute end-5 top-5 " onClick={showModal}>
            <Tooltip title="Full Screen">
              <Button type="text">
                <Expand className="cursor-pointer" size={16} />
              </Button>
            </Tooltip>
          </div>
          <div className="relative w-full h-75  rounded-lg overflow-hidden ">
            <iframe
              src={`${file.destination_url}#zoom=page-fit`}
              className="w-full object-contain overflow-hidden border-none h-full"
            />
          </div>
        </div>
      </aside>
      <Modal
        title={null}
        footer={null}
        closable={true}
        open={isModalOpen}
        onCancel={handleCancel}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "80vw",
          backdropFilter: "blur(2px)",
        }}
        styles={{
          body: {
            padding: 20,
            height: "85vh",
            overflow: "hidden",
            width: "85vw",
          },
        }}
        centered={false}
        maskClosable={true}
      >
        <div className="h-full w-full flex items-center justify-center">
          <iframe
            src={file.destination_url}
            className="w-full h-full border-none"
            style={{ objectFit: "contain" }}
          />
        </div>
      </Modal>
    </>
  );
};

export default SidebarEditFile;
