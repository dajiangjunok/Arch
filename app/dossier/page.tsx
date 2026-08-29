import type { Metadata } from "next";

import { DossierDocument } from "./dossier-document";

export const metadata: Metadata = {
  title: "The Arch Dossier | Shanghai Program 2026",
  description:
    "The full program dossier for The Arch Shanghai innovation residency.",
};

export default function DossierPage() {
  return (
    <main className="dossier-route">
      <div className="dossier-sheet">
        <DossierDocument />
      </div>
    </main>
  );
}
