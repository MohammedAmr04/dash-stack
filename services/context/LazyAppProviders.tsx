"use client";
import dynamic from "next/dynamic";

const LazyAppProviders = dynamic(() => import("./PdfProvider"), {
  ssr: false,
});
export default LazyAppProviders;
