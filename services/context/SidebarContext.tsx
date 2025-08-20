import { usePathname } from "next/navigation";
import React, {
   createContext,
   useState,
   useContext,
   ReactNode,
   useEffect,
} from "react";

interface SidebarContextType {
   activeId: string;
   setActiveId: React.Dispatch<React.SetStateAction<string>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
   children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
   children,
}) => {
   const pathname = usePathname();
   let pathAfterLocale = pathname.replace(/^\/[^/]+/, "");
   if (pathAfterLocale.split("/").length > 3) {
      pathAfterLocale = pathAfterLocale.split("/").slice(1, 3).join("/");
   } else {
      pathAfterLocale = pathAfterLocale.slice(1);
   }

   const [activeId, setActiveId] = useState(() => pathAfterLocale);

   useEffect(() => {
      setActiveId(pathAfterLocale);
   }, [pathAfterLocale]);

   return (
      <SidebarContext.Provider value={{ activeId, setActiveId }}>
         {children}
      </SidebarContext.Provider>
   );
};

export const useSidebar = () => {
   const context = useContext(SidebarContext);
   if (context === undefined) {
      throw new Error("useSidebar must be used within a SidebarProvider");
   }
   return context;
};
