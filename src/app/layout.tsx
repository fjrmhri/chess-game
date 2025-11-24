import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";

// Tata letak root menjaga font dan toaster tersedia di seluruh aplikasi
// sehingga halaman lain tidak perlu menginisialisasi ulang elemen global.

export const metadata: Metadata = {
  title: "Chess Game",
  description: "Chess Game: pengalaman catur real-time dengan Next.js dan Firebase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <footer className="py-4 text-center text-xs text-muted-foreground">
            <a
              href="https://github.com/fjrmhri"
              className="transition-colors hover:text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              github/fjrmhri
            </a>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
