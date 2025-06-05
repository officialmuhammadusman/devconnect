import React, { useEffect } from 'react'; // Import useEffect
import { useLocation } from 'react-router-dom'; // Import useLocation

import Navbar from '../Components/Navbar';
import DevConnectHero from '../Components/DevConnectHero';
import DeveloperCards from '../Components/DeveloperCard';
import HowItWorks from '../Components/HowItWorks';
import WhyChoose from '../Components/WhyChoose'; 
import CallToAction from '../Components/CallToAction';
import Testimonials from '../Components/Testimonials';
import FAQSSection from '../Components/FAQSSection'; 
import Footer from '../Components/Footer';

const Home = () => {
  const location = useLocation(); 

  useEffect(() => {
   
    if (location.hash) {
      const id = location.hash.substring(1); 
      const element = document.getElementById(id); 

      if (element) {
     
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location]); 

  return (
    <div>
      
      <DevConnectHero />
      <DeveloperCards />
      <HowItWorks />
      <WhyChoose /> 
      <CallToAction />
      <Testimonials />
      <FAQSSection /> 
      <Footer />
    </div>
  );
};

export default Home;