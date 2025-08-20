import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

import { type NextRequest } from "next/server";
import { updateSession } from "./libs/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
   const response = intlMiddleware(request);

   return await updateSession(request, response);
}

export const config = {
   matcher: ["/((?!api|_next|.*\\..*).*)"],
};
