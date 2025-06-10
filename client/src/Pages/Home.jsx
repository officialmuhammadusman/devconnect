import React, { useEffect } from 'react'; // Import useEffect
import { useLocation } from 'react-router-dom'; // Import useLocation


import DevConnectHero from '../Components/DevConnectHero';

import HowItWorks from '../Components/HowItWorks';
import WhyChoose from '../Components/WhyChoose'; 
import CallToAction from '../Components/CallToAction';
import Testimonials from '../Components/Testimonials';
import FAQSSection from '../Components/FAQSSection'; 


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
 
      <HowItWorks />
      <WhyChoose /> 
      <CallToAction />
      <Testimonials />
      <FAQSSection /> 
    
    </div>
  );
};

export default Home;