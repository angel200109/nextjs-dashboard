import "@/app/ui/global.css";
import { inter } from "./ui/fonts";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    template: "%s| Nextjs练习",
    default: "nextjs练习项目",
  },
  description: "nextjs练习项目",
  keywords: ["next.js", "react"],
  openGraph: {
    images: "/logo.png",
  },
  metadataBase: new URL("https://www.abc.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
