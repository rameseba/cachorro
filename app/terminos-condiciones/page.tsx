import type { Metadata } from "next";
import { LegalView } from "@/app/lib/LegalView";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Criadero Noble Cachorro",
};

export default function TerminosCondiciones() {
  return <LegalView docKey="terms" />;
}
