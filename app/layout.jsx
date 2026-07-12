import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Meka Asia Property - Dream Home in Lombok",
  description:
    "Premium residential developments in Lombok by Meka Asia Property.",
};

export const viewport = {
  themeColor: "#173426",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Script
          src="/cinematic-fallback.js?v=3"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
