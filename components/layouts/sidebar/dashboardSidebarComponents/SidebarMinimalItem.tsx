import { createClient } from "@/libs/supabase/supabaseClient";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

function SidebarMinimalItem({
   icon,
   url,
   isActive,
   onClick,
}: {
   url: string;
   icon: ReactNode;
   isActive?: boolean;
   onClick?: () => void;
}) {
   const router = useRouter();
   const supabase = createClient();

   //   const locale = useLocale();
   const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
         console.error("Error signing out:", error.message);
      } else {
         router.replace("/login");
      }
   };
   function handleClick() {
      onClick?.();
      if (url === "dashboard/logout") {
         handleLogout();
      } else {
         router.push(`/${url}`);
      }
   }
   return (
      <div
         className={`w-full cursor-pointer min-h-13 flex items-center justify-center relative ${
            isActive ? "text-primary" : ""
         }`}
         onClick={handleClick}>
         {isActive && (
            <div className="absolute ltr:left-0 rtl:right-0 w-2 border-r rounded-full h-[80%] bg-primary rotate-180 rtl:rotate-0 rtl:translate-x-[50%] ltr:-translate-x-[50%]"></div>
         )}
         {icon}
      </div>
   );
}

export default SidebarMinimalItem;
