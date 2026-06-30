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
            style: {
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#e2e4ea',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 500,
            },
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
