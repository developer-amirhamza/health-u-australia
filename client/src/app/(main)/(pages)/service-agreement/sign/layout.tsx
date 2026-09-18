import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign your Service Agreement',
  description: 'Review and sign your NDIS Service Agreement from Health U Australia.',
  robots: { index: false, follow: false },
}

export default function ServiceAgreementSignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
