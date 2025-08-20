import EditFilePage from "@/components/dashboard/files/editfile/EditFilePage";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <div>
      <EditFilePage id={id} />
    </div>
  );
};

export default Page;
