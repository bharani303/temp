import { Sofa, Truck, ShieldCheck } from "lucide-react";

import aboutHero from "../Assets/aboutus/ariel-domenden-aObxGPf7J1o-unsplash.jpg";
import aboutStory from "../Assets/aboutus/huy-nguyen-vqNYSTwcTW8-unsplash.jpg";

const About = () => {
  return (
    <div className="w-[90%] max-w-7xl m-auto mt-16 mb-20">

      {/* HERO SECTION */}

      <div className="grid md:grid-cols-2 gap-10 items-center mb-20">

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#5C3D2E] mb-4">
            About Homie
          </h1>

          <p className="text-gray-600 leading-relaxed mb-4">
            Homie makes it easy to create a beautiful home without the
            burden of buying expensive furniture.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Rent stylish furniture with flexible plans and transform
            your living space effortlessly.
          </p>
        </div>

        <img
          src={aboutHero}
          alt="modern living room"
          className="rounded-2xl shadow-lg object-cover h-[320px] w-full"
        />

      </div>


      {/* STORY SECTION */}

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

        <img
          src={aboutStory}
          alt="furniture lifestyle"
          className="rounded-2xl shadow-lg object-cover h-[320px] w-full"
        />

        <div>

          <h2 className="text-3xl font-semibold text-[#5C3D2E] mb-4">
            Our Story
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            Moving into a new home should be exciting, not stressful.
            Buying furniture can be expensive and inconvenient.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Homie was created to help people furnish their homes
            easily. Whether you're moving to a new city, setting up
            your first apartment, or upgrading your lifestyle,
            Homie makes it simple.
          </p>

        </div>

      </div>


      {/* WHY CHOOSE US */}

      <div className="text-center mb-12">

        <h2 className="text-3xl font-semibold text-[#5C3D2E]">
          Why Choose Homie
        </h2>

      </div>


      <div className="grid md:grid-cols-3 gap-8">

        {/* CARD 1 */}

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">

          <div className="bg-[#F1E6DE] w-14 h-14 flex items-center justify-center rounded-xl m-auto mb-4">
            <Sofa className="text-[#8B5E3C]" />
          </div>

          <h3 className="text-lg font-semibold text-[#5C3D2E] mb-2">
            Premium Furniture
          </h3>

          <p className="text-gray-600">
            Carefully curated furniture designed for modern homes.
          </p>

        </div>


        {/* CARD 2 */}

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">

          <div className="bg-[#F1E6DE] w-14 h-14 flex items-center justify-center rounded-xl m-auto mb-4">
            <Truck className="text-[#8B5E3C]" />
          </div>

          <h3 className="text-lg font-semibold text-[#5C3D2E] mb-2">
            Fast Delivery
          </h3>

          <p className="text-gray-600">
            Get furniture delivered and installed quickly.
          </p>

        </div>


        {/* CARD 3 */}

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">

          <div className="bg-[#F1E6DE] w-14 h-14 flex items-center justify-center rounded-xl m-auto mb-4">
            <ShieldCheck className="text-[#8B5E3C]" />
          </div>

          <h3 className="text-lg font-semibold text-[#5C3D2E] mb-2">
            Flexible Plans
          </h3>

          <p className="text-gray-600">
            Choose plans that suit your lifestyle and upgrade anytime.
          </p>

        </div>

      </div>

    </div>
  );
};

export default About;