import PreviewFile from "@/components/dashboard/files/preview/PreviewFile";

const page = async ({ params }: { params: { shortLink: string } }) => {
  const { shortLink: url } = await params;
  return (
    <>
      <PreviewFile url={url} />
    </>
  );
};

export default page;
