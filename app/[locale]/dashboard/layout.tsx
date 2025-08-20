import LayoutDashboard from "@/components/layouts/dashboard/LayoutDashboard";
import { createClient } from "@/libs/supabase/supabaseServer";

async function Layout({ children }: { children: React.ReactNode }) {
   const supabase = await createClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   return <LayoutDashboard>{children}</LayoutDashboard>;
}

export default Layout;
