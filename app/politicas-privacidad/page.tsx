import type { Metadata } from "next";
import { LegalView } from "@/app/lib/LegalView";

export const metadata: Metadata = {
  title: "Políticas de Privacidad | Criadero Noble Cachorro",
};

export default function PoliticasPrivacidad() {
  return <LegalView docKey="privacy" />;
}
