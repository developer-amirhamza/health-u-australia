import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign your Contract',
  description: 'Review and sign your contract from Health U Australia.',
  robots: { index: false, follow: false },
}

export default function ContractSignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
