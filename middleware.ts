export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/categories/:path*",
    "/statistics/:path*",
    "/credit-cards/:path*",
    "/bank-accounts/:path*",
    "/expenses/:path*",
    "/income/:path*",
    "/add/:path*",
    "/profile/:path*",
  ],
};
