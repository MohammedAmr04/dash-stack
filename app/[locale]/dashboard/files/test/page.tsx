import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

async function page() {
   const supa = createClientComponentClient();
   const { data } = await supa.auth.getUser();
   console.log("-----------------", data);

   return <div></div>;
}

export default page;
