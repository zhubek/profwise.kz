import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProfWise - Career Guidance Platform",
  description: "Discover your ideal career path with professional assessments and guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
