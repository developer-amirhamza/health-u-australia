import { Metadata } from "next"
import Home from "./pages/Home"
import ScrollToTopBtn from "utils/ScrollToTopBtn"

export const metadata: Metadata = {
  title: { absolute: "Health U Australia | NDIS Support Provider Sydney" },
  description: "Find a trusted NDIS provider to meet your needs and support your journey to independent living and personal growth.",
}

export default function Page() {
  return <main className="h-full flex w-full">
    <Home />
     <ScrollToTopBtn/>
  </main>
}

