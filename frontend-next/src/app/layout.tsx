import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../components/layout/AppShell";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "PostGen",
  description: "AI-powered LinkedIn post generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151' },
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
