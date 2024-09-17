import { BASE_PATH, auth } from "@/server/auth";

import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const publicUrls = new Set(["/", "/pricing"]);

export default auth((req) => {
  const reqUrl = new URL(req.url);
  if (!req.auth && !publicUrls.has(reqUrl.pathname)) {
    return NextResponse.redirect(
      new URL(
        `${BASE_PATH}/signin?callbackUrl=${encodeURIComponent(
          reqUrl?.pathname
        )}`,
        req.url
      )
    );
  }
});
