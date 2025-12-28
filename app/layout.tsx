import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css"; // 1. 引入 RainbowKit 样式
import { Providers } from "@/components/Providers"; // 2. 引入 Providers
import { Toaster } from "react-hot-toast"; // 3. 引入 Toast

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Minting DApp",
  description: "Built with Next.js and Wagmi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
