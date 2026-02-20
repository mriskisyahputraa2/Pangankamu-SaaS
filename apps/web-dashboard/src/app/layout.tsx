import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Konfigurasi font Jakarta Sans
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Masukkan nama variabel font ke dalam body */}
      <body className={`${jakarta.className} antialiased`}>{children}</body>
    </html>
  );
}
