import { ReferencePage, referenceMetadata } from "@/app/_reference/reference-page";

export const metadata = referenceMetadata.about;

export default function AboutRoute() {
  return <ReferencePage page="about" />;
}
