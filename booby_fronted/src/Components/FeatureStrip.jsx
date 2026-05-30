import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Truck, Wrench, Palette, CreditCard, Calendar, RefreshCw } from "lucide-react";

const features = [
  { icon: <Truck size={20} />, text: "Free Relocation" },
  { icon: <Wrench size={20} />, text: "Free Installation" },
  { icon: <Palette size={20} />, text: "300+ Designs" },
  { icon: <CreditCard size={20} />, text: "No Cost EMI Available" },
    { icon: <RefreshCw size={20} />, text: "Exciting Offers" },
  { icon: <Calendar size={20} />, text: "Pay Monthly" },
  { icon: <RefreshCw size={20} />, text: "Free Cancellation" },


];

const FeatureStrip = () => {
  return (
    <section className="w-full py-1">

      <div className="max-w-[1500px] mx-auto px-6">

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1.5}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 2.5 },
            768: { slidesPerView: 3.5 },
            1024: { slidesPerView: 5 },
          }}
        >
          {features.map((item, index) => (
            <SwiperSlide key={index}>
<div className="flex items-center gap-2 md:gap-3 bg-[#f3ede7] px-2 md:px-3 py-1 md:py-2 rounded-xl md:rounded-2xl border border-[#e5d8c8]">
<div className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center bg-[#8B5E3C] text-white rounded-full">
                  {item.icon}
                </div>

                <p className="text-sm font-medium text-[#6b4a2e] whitespace-nowrap">
                  {item.text}
                </p>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default FeatureStrip;