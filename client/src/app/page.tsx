import { Metadata } from "next"
import Home from "./pages/page"
import ScrollToTopBtn from "utils/ScrollToTopBtn"

export const metadata: Metadata = {
  title: "Health U Australia - Best NDIS Service & Support Provider in Ryde",
  description: " Find the best NDIS provider to meet your needs and support your journey to independent living and personal growth.",
}

export default function Page() {
  return <main className="h-full flex w-full">
    <Home />
     <ScrollToTopBtn/>
  </main>
}

