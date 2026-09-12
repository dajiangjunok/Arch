import type { ReactNode } from "react";
import { SiteFooter } from "@/app/_components/site-footer";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
