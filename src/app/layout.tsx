/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Navbar from "@/components/navbar";
import "./globals.css";
import '@suiet/wallet-kit/style.css';
import WalletProviderWrapper from '@/components/wallet-provider-wrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen">
        <WalletProviderWrapper>
          {/* <Navbar /> */}
          {children}
        </WalletProviderWrapper>
      </body>
    </html>
  );
}
