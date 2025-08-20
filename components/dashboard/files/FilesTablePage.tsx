"use client";
import React, { useMemo, useEffect, useState } from "react";
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import type { ColumnFilterItem } from "antd/es/table/interface";
import {
   MagnifyingGlassIcon,
   PencilIcon,
   QrCodeIcon,
   TrashIcon,
} from "@phosphor-icons/react";
import { CopyIcon } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/libs/supabase/supabaseClient";
import dayjs from "dayjs";
import QrCodeModal from "./shared/QrCodeModal";
import Link from "next/link";

interface DataType {
   id: string;
   name: string;
   description?: string;
   date: string;
   short_url: string;
   destination_url: string;
   tag?: string;
   tag_color?: string;
}

const FilesTablePage = () => {
   const t = useTranslations("dashboard.filesTable");
   const router = useRouter();
   const [data, setData] = useState<DataType[]>([]);
   const [loading, setLoading] = useState(true);
   const [qrOpen, setQrOpen] = useState(false);
   const [qrRecord, setQrRecord] = useState<DataType | null>(null);
   const [copied, setCopied] = useState(false);
   const supabase = createClient();
   const fetchFiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
         .from("files")
         .select(
            "id, name,destination_url,short_url, description, created_at, tag, tag_color"
         );

      if (error) {
         console.error("Error fetching files:", error);
      } else {
         setData(
            data.map((file) => ({
               id: file.id,
               name: file.name,
               description: file.description,
               short_url: file.short_url,
               destination_url: file.destination_url,
               date: file.created_at,
               tag: file.tag,
               tag_color: file.tag_color,
            }))
         );
      }
      setLoading(false);
   };
   useEffect(() => {
      fetchFiles();
   }, []);

   const handleCopy = async (url: string) => {
      try {
         await navigator.clipboard.writeText(url);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error("Failed to copy: ", err);
      }
   };
   // unique tags for filters
   const uniqueTags: ColumnFilterItem[] = Array.from(
      new Set(
         data
            .map((item) => item.tag)
            .filter((tag) => tag !== undefined && tag !== null)
      )
   ).map((tag) => ({
      text: tag,
      value: tag,
   }));

   const columns: TableColumnsType<DataType> = useMemo(() => {
      return [
         {
            title: t("nameColumnTitle"),
            dataIndex: "name",
            fixed: "left",
            width: 250,
            render: (_, record) => (
               <Link
                  href={`files/preview/${record.short_url}`}
                  className="cursor-pointer !text-text">
                  {record.name}
               </Link>
            ),
            filterDropdown: ({
               setSelectedKeys,
               selectedKeys,
               confirm,
               clearFilters,
            }) => (
               <div style={{ padding: 8 }}>
                  <Input
                     placeholder={t("nameFilterPlaceholder")}
                     value={selectedKeys[0]}
                     onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                        confirm({ closeDropdown: false });
                     }}
                     onPressEnter={() => confirm()}
                     style={{ width: 188, marginBottom: 8, display: "block" }}
                  />
                  <Space>
                     <Button
                        onClick={() => {
                           clearFilters?.();
                           confirm();
                        }}
                        size="small">
                        {t("nameFilterResetButton")}
                     </Button>
                     <Button
                        type="primary"
                        onClick={() => confirm()}
                        size="small">
                        {t("nameFilterSearchButton")}
                     </Button>
                  </Space>
               </div>
            ),
            filterIcon: (filtered) => (
               <MagnifyingGlassIcon
                  size={16}
                  style={{ color: filtered ? 'var("--c-primary")' : undefined }}
               />
            ),
            onFilter: (value, record) =>
               record.name
                  .toLowerCase()
                  .includes((value as string).toLowerCase()),
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ["descend", "ascend"],
         },
         {
            title: t("descriptionColumnTitle"),
            dataIndex: "description",
         },
         {
            title: t("dateColumnTitle"),
            width: 120,
            dataIndex: "date",
            render: (date) => dayjs(date).format("DD MMM 'YY"),

            sorter: (a, b) =>
               new Date(a.date).getTime() - new Date(b.date).getTime(),
            sortDirections: ["descend", "ascend"],
         },
         {
            title: t("tagColumnTitle"),
            dataIndex: "tag",
            filters: uniqueTags,
            render: (_, record) => {
               return (
                  <Tag
                     color={record.tag_color}
                     style={{ fontSize: "0.95rem", height: "1.5rem" }}>
                     {record.tag}
                  </Tag>
               );
            },
            onFilter: (value, record) =>
               value === "ALL" ? true : record.tag === value,
         },
         {
            title: t("actionColumnTitle"),
            key: "actions",
            width: 210,
            render: (_, record) => (
               <div className="flex space-x-2">
                  <Tooltip title={t("actionsTooltipQr")}>
                     <Button
                        type="text"
                        onClick={() => {
                           setQrRecord(record);
                           setQrOpen(true);
                        }}
                        icon={<QrCodeIcon size={19} />}
                     />
                  </Tooltip>
                  <Tooltip title={copied ? "Copied!" : t("actionsTooltipCopy")}>
                     <Button
                        type="text"
                        icon={<CopyIcon size={19} />}
                        onClick={() => {
                           handleCopy(record.destination_url);
                        }}
                     />
                  </Tooltip>
                  <Tooltip title={t("actionsTooltipEdit")}>
                     <Button
                        type="text"
                        icon={<PencilIcon size={19} />}
                        onClick={() =>
                           router.push(`/dashboard/files/${record.id}/editfile`)
                        }
                     />
                  </Tooltip>
                  <Tooltip title={t("actionsTooltipDelete")}>
                     <Button
                        type="text"
                        icon={<TrashIcon size={19} />}
                        danger
                        onClick={async () => {
                           const { error } = await supabase
                              .from("files")
                              .delete()
                              .eq("id", record.id);
                           fetchFiles();
                           if (error) {
                              console.error(error);
                           }
                        }}
                     />
                  </Tooltip>
               </div>
            ),
         },
      ];
   }, [t, router, uniqueTags]);

   return (
      <div className="overflow-x-auto">
         <div className="flex w-full justify-between">
            <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>
            <Button
               type="primary"
               onClick={() => router.push("/dashboard/files/addfile")}>
               {t("addFileButtonTitle")}
            </Button>
         </div>
         <Table<DataType>
            columns={columns}
            showSorterTooltip={{ target: "sorter-icon" }}
            dataSource={data}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1200 }}
            style={{ width: "100%" }}
         />
         {qrRecord && (
            <QrCodeModal
               open={qrOpen}
               onClose={() => setQrOpen(false)}
               url={qrRecord.destination_url}
               title={`QR Code for ${qrRecord.name}`}
            />
         )}
      </div>
   );
};

export default FilesTablePage;
