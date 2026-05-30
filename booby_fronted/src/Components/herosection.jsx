import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import slide1 from "../Assets/banners/pexels-artbovich-8135248.jpg";
import slide2 from "../Assets/banners/pexels-artbovich-6969827.jpg";
import slide3 from "../Assets/banners/pexels-stephanlouis-7150303.jpg";
import slide4 from "../Assets/banners/pexels-nurseryart-346739.jpg";
import slide5 from "../Assets/banners/istockphoto-1042424568-612x612.jpg";

const slides = [
  {
    id: 1,
    tag: "LIMITED OFFER",
    title: "Upgrade to Walnut Premium",
    subtitle: "Get 20% off on your first 3 months",
    image: slide1,
  },
  {
    id: 2,
    tag: "WORK FROM HOME",
    title: "Transform Your Workspace",
    subtitle: "Ergonomic walnut desks starting at $15/mo",
    image: slide2,
  },
  {
    id: 3,
    tag: "FAMILY MOMENTS",
    title: "Eat with Fam",
    subtitle: "Ergonomic walnut desks starting at $15/mo",
    image: slide3,
  },
  {
    id: 4,
    tag: "WORK FROM HOME",
    title: "Transform Your Workspace",
    subtitle: "Ergonomic walnut desks starting at $15/mo",
    image: slide4,
  },
  {
    id: 5,
    tag: "BEDROOM SPECIALS",
    title: "Upgrade to Master",
    subtitle: "Ergonomic walnut desks starting at $15/mo",
    image: slide5,
  }
];

const HeroSection = () => {
  return (
    <section className="w-full py-4 md:py-10 bg-[#f5f3ef] dark:bg-[#111]">

      <div className="max-w-[1435px] mx-auto px-4 md:px-10">

        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          navigation={true}
          className="heroSwiper rounded-xl md:rounded-3xl overflow-hidden shadow-md md:shadow-xl"
        >

          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="
                  relative 
                  h-[30vh] md:h-[70vh] 
                  bg-cover bg-center 
                  flex items-center 
                  rounded-xl md:rounded-3xl
                "
                style={{ backgroundImage: `url(${slide.image})` }}
              >

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent dark:from-black/70 dark:via-black/50"></div>

                {/* Content */}
                <div className="relative z-10 text-white px-5 md:px-16 max-w-sm md:max-w-2xl">

                  <span className="inline-block mb-2 md:mb-4 px-3 py-1 text-[10px] md:text-sm bg-[#8B5E3C] rounded-full">
                    {slide.tag}
                  </span>

                  <h1 className="text-lg sm:text-xl md:text-6xl font-bold leading-snug md:leading-tight mb-1 md:mb-4">
                    {slide.title}
                  </h1>

                  <p className="text-[11px] sm:text-sm md:text-xl mb-3 md:mb-8 text-gray-200">
                    {slide.subtitle}
                  </p>

                  <div className="flex gap-2 md:gap-4">
                    <button className="bg-[#8B5E3C] px-4 md:px-6 py-1.5 md:py-3 text-[11px] md:text-base rounded-md md:rounded-lg font-medium hover:opacity-90 transition">
                      Explore →
                    </button>

                    <button className="bg-white text-black px-4 md:px-6 py-1.5 md:py-3 text-[11px] md:text-base rounded-md md:rounded-lg font-medium hover:bg-gray-200 transition">
                      View
                    </button>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}

        </Swiper>

      </div>

      {/* Hide Navigation On Mobile */}
      <style>{`
        .heroSwiper .swiper-button-next,
        .heroSwiper .swiper-button-prev {
          display: none;
        }

        @media (min-width: 768px) {
          .heroSwiper .swiper-button-next,
          .heroSwiper .swiper-button-prev {
            display: flex;
          }
        }
      `}</style>

    </section>
  );
};

export default HeroSection;