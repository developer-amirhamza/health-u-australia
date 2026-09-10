import type { Metadata } from "next";
// import { seoMetadata } from "@/config/seoMetadata";

// export const metadata: Metadata = seoMetadata.signin;
export const metadata: Metadata = {
  title: 'Email verification',
  description: 'Verify your email for your Health U Australia account.',
  robots: { index: false, follow: false },
}

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}