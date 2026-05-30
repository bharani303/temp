
import HeroSection from "../Components/herosection";
import CategoriesStrip from "../Components/CategoriesStrip";
import CategorybyRoom from "../Components/CategorybyRoom"
import StepsToRent from "../Components/StepsToRent"
import TestimonialsSection from "../Components/testimonial";
import FAQSection from "../Components/FAQsection";
import FeatureStrip from "../Components/FeatureStrip";
import MoreCategoriesStrip from "../Components/MoreCategoriesStrip";
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100  dark:bg-[#111] text-gray-800 dark:text-gray-200 min-h-screen">

  
        <div id="categories">
  <CategoriesStrip />
</div>
     
      <HeroSection/>
<FeatureStrip/>
<MoreCategoriesStrip/>
<div id="combos">
  <CategorybyRoom />
</div>

<div id="offers">
  <StepsToRent />
</div>
      <TestimonialsSection/>
      <FAQSection/>
    
    </div>
  );
};

export default Home;
