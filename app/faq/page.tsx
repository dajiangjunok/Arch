import { ReferencePage, referenceMetadata } from "@/app/_reference/reference-page";

export const metadata = referenceMetadata.faq;

export default function FaqRoute() {
  return <ReferencePage page="faq" />;
}
