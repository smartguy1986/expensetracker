import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import SessionProviderWrapper from "./components/SessionProviderWrapper";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Secure Expense Tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable} data-theme="dark">
      <body>
        <SessionProviderWrapper>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
