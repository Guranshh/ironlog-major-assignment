// import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { ThemeProvider } from "../components/Themes/ThemeContext";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"], // only the bold weights we use for headings
  variable: "--font-poppins", // globals.css reads this name
});

export const metadata: Metadata = {
  title: "IronLog | Fitness Blog",
  description: "Training, nutrition and recovery tips from the IronLog community",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverCookies = await cookies();
  const theme = (serverCookies.get("theme")?.value || "light") as "light" | "dark";

  return (
    <html lang="en" data-theme={theme}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}>
        <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}