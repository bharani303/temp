import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const textReviews = [
  {
    name: "Rahul",
    location: "Delhi",
    quote: "Amazing product, loved it!",
  },
  {
    name: "Sneha",
    location: "Mumbai",
    quote: "Quality is top notch 🔥",
  },
];

const testimonials = [
  {
    id: 1,
    type: "Video Story",
    name: "Sarah Jenkins",
    location: "Mumbai",
    image: "/src/Assets/testimonials/piano.png",
  },
  {
    id: 2,
    type: "Customer Story",
    name: "Aditya Verma",
    location: "Bangalore",
    image: "/src/Assets/testimonials/Gemini_Generated_Image_6800zc6800zc6800.png",
  },
  {
    id: 3,
    type: "Video Story",
    name: "Priya Sharma",
    location: "Bhopal",
    image: "/src/Assets/testimonials/Gemini_Generated_Image_a8r0cfa8r0cfa8r0.png",
  },
  {
    id: 4,
    type: "Video Story",
    name: "Dheeraj Dhindsa",
    location: "Hyderabad",
    image: "/src/Assets/testimonials/Gemini_Generated_Image_rmkxwrrmkxwrrmkx.png",
  },
  {
    id: 5,
    type: "Video Story",
    name: "Vikrant Mehta",
    location: "England",
    image: "/src/Assets/testimonials/ror.png",
  },
];

const TestimonialsSection = () => {

  const [allReviews, setAllReviews] = useState(textReviews);

   useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:5000/userReviews");
        const data = await res.json();

        if (data.length > 0) {
          setAllReviews([...data, ...textReviews]);
        }
      } catch (err) {}
    };

    fetchReviews();
  }, []);
  
  return (
    <section className="py-14 px-4 md:py-15 md:px-16 bg-[#F8F5F2] dark:bg-[#111]">

  {/* Header */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-4 md:gap-6">
    <div>
      <h2 className="text-2xl md:text-4xl font-bold text-[#4B2E2B] dark:text-white mb-2 md:mb-3">
        Real Homes, Real Stories
      </h2>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-md md:max-w-none">
        See how our customers are living their best lives with Homie furniture.
      </p>
    </div>

    <div className="flex items-center gap-2 text-[#8B5E3C] font-bold text-sm md:text-base">
      <Star size={22} className="md:w-[30px] md:h-[30px]" fill="#8B5E3C" />
      4.9/5 Rating from 10k+ Customers
    </div>
  </div>

  {/* Video Testimonial Cards */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
    {testimonials.map((item) => (
      <div
        key={item.id}
        className={`relative rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer 
        ${item.id === 5 ? "hidden md:block" : ""}`}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-[180px] md:h-[260px] object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300"></div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
            <div className="w-0 h-0 border-l-[8px] md:border-l-[12px] border-l-[#8B5E3C] border-y-[5px] md:border-y-[7px] border-y-transparent ml-1"></div>
          </div>
        </div>

        {/* Name + Location */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h4 className="font-semibold text-xs md:text-sm">
            {item.name}
          </h4>
          <p className="text-[10px] md:text-xs uppercase tracking-wide opacity-80">
            {item.location}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Text Review Cards */}
  <div className="mt-12 md:mt-20 overflow-hidden">

    <div className="review-marquee flex gap-4 md:gap-6">

      {[...allReviews, ...allReviews].map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#1c1c1c] w-[260px] md:w-[340px] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition duration-300 flex-shrink-0"
        >
          <div className="flex text-[#8B5E3C] mb-3 md:mb-4 text-sm md:text-lg">
            {"★★★★★"}
          </div>

          <p className="text-gray-700  dark:text-gray-300 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
            "{item.quote}"
          </p>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-[#4B2E2B]">
              {item.name.charAt(0)}
            </div>

            <div>
              <h4 className="text-xs md:text-sm font-semibold text-[#8B5E3C]">
                {item.name}
              </h4>
              <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-300 uppercase tracking-wide">
                {item.location}
              </p>
            </div>
          </div>
        </div>
      ))}

    </div>

  </div>

</section>
  );
};

export default TestimonialsSection;
