import AboutContent from 'app/components/AboutContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:"NDIS Service Providers: Empowering Your Independence",
  description:"Explore our range of NDIS service providers dedicated to empowering participants for a life of choice and autonomy.",
};
const About = () => {

  return (
    <AboutContent/>
  )
}

export default About