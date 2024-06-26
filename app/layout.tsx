import NavBar from "@/components/layouts/NavBar";
import { Toaster } from "@/components/ui/toaster";
import NextThemesProvider from "@/lib/Providers";
import RecoilContextProvider from "@/lib/RecoilContextProvider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "NextCommerce",
  description: "NextCommerce is a role-based e-commerce platform offering a wide range of products for online shoppers.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <RecoilContextProvider>
          <NextThemesProvider>
            <SessionProvider>
              <NavBar />
              <main>{children}</main>
              <Toaster />
            </SessionProvider>
          </NextThemesProvider>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
