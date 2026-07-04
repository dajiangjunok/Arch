import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI.X Assembly | Shanghai Innovation Immersion",
  description:
    "A three-week innovation immersion on Fuxing Island, connecting global founders, investors, institutions and China's AI, robotics and hardware ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
