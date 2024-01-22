import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import NavBar from "@/components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
