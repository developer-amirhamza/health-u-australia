"use client"
import ScrollToTopBtn from "utils/ScrollToTopBtn";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./styles/globals.css"
import ScrollToTop from "utils/ScrollToTop";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className="relative flex flex-col h-full w-full"  suppressHydrationWarning  >
        <Header />
        {children}
        <Footer />
        <ScrollToTop  />
         <ScrollToTopBtn/>
      </body>
    </html>
  )
}