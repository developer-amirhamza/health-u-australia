
import About from "app/(main)/components/About"
import Choose from "app/(main)/components/Choose"
import Hero from "app/(main)/components/Hero"
import NewsLetter from "app/(main)/components/NewsLetter"
import Service from "app/(main)/components/Service"
import Testimonials from "app/(main)/components/Testimonials"
import UpcomingEvents from "app/(main)/components/UpcomingEvents"
import { HomeContentProvider } from "app/(main)/components/HomeContentContext"


const Home = () => {
  return (
    <HomeContentProvider><main className="w-full">
    {/* banner  */}
      <Hero/>
      <About/>
      <Service/>
      <Choose/>
      <UpcomingEvents/>
      <Testimonials/>
      <NewsLetter/>

  </main></HomeContentProvider>
  )
}

export default Home
