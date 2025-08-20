"use client";
import { RPConfig, RPConfigProps } from "@pdf-viewer/react";
import { type PropsWithChildren } from "react";

function PdfProvider({ children, ...props }: PropsWithChildren<RPConfigProps>) {
  return <RPConfig {...props}>{children}</RPConfig>;
}
export default PdfProvider;
