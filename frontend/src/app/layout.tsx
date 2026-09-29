import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "TRACE-X | Financial Crime & Insider Risk Investigation Platform",
  description: "Enterprise forensic intelligence platform correlating employee privilege, customer profile modifications, and financial transaction money-flow networks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background flex flex-col font-sans antialiased text-gray-200">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
