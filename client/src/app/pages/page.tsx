
import About from "app/components/About"
import Choose from "app/components/Choose"
import Hero from "app/components/Hero"
import NewsLetter from "app/components/NewsLetter"
import Service from "app/components/Service"
import Testimonials from "app/components/Testimonials"
import ScrollToTopBtn from "utils/ScrollToTopBtn"


const Home = () => {
  return (
    <main className=" w-full  h-full ">
    {/* banner  */}
      <Hero/>
      <About/>
      <Service/>
      <Choose/>
      <Testimonials/>
      <NewsLetter/>
     
  </main>
  )
}

export default Home