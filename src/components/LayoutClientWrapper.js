"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();
  const noHeaderPaths = ["/"];
  const showHeader = !noHeaderPaths.includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
