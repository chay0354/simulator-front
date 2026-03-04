import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "סימולטור הערכת מצב פיננסי",
  description: "בדקו באיזה עשירון אתם לפי השאלות",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" className={heebo.variable}>
      <body className="font-sans min-h-screen relative z-10">{children}</body>
    </html>
  );
}
