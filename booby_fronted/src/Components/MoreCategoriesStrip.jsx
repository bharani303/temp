import { useState } from "react";
import { useNavigate } from "react-router-dom";

import recliner from "../Assets/categoriesstrip/Recliners1.png";
import sofa from "../Assets/categoriesstrip/sofa1.png";
import tvunit from "../Assets/categoriesstrip/Tvunit1.png";
import wardrobe from "../Assets/categoriesstrip/wardrobe1.png";

import moreCategoryImg from "../Assets/categoriesstrip/morecategoryimg.jpg";

const categories = [
  { id: 8, name: "Recliners", image: recliner },
  { id: 9, name: "Sofa", image: sofa },
  { id: 10, name: "TV Unit", image: tvunit },
  { id: 11, name: "Wardrobe", image: wardrobe },
];

const MoreCategoriesStrip = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleClick = (cat) => {
    setSelectedId(cat.id);
    const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${slug}`);
  };

  return (
    <section className="py-10 md:py-20 px-4 md:px-10 bg-[#f5f3ee] dark:bg-[#111]">

      {/* Heading */}
      <h2 className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-8 md:mb-10 text-center">
        <span className="text-2xl md:text-4xl font-bold text-[#9b6e4f]">
          Explore
        </span>
        <span className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-gray-300">
          Some More Categories
        </span>
        <span className="hidden md:block h-[3px] w-16 bg-[#9b6e4f] rounded-full"></span>
      </h2>

      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-10 md:gap-12">

        {/* LEFT SIDE */}
        
<div
  className="
  flex gap-1 overflow-x-auto pb-2
  md:grid md:grid-cols-2 md:grid-rows-2
  md:gap-x-8 md:gap-y-8
  md:overflow-visible
   md:ml-16
"
>
  {categories.map((cat) => (
    <div
      key={cat.id}
      onClick={() => handleClick(cat)}
className="group cursor-pointer flex flex-col items-center min-w-[83px]"
    >

      {/* CARD */}
    <div
  className="
  relative
  w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
  flex items-center justify-center
  rounded-[15px]

  bg-gradient-to-b 
  from-white to-[#faf6f1]
  dark:from-[#1c1c1c] dark:to-[#1c1c1c]

  border border-[#eadfd5] dark:border-[#2a2a2a]

  shadow-sm dark:shadow-none

  transition-all duration-300
  group-hover:-translate-y-2
  group-hover:shadow-lg
"
>

        {/* IMAGE */}
        <img
          src={cat.image}
          alt={cat.name}
          className="
          h-14 md:h-24
          object-contain 
          transition-transform duration-300
          group-hover:scale-110
        "
        />

      </div>

      {/* LABEL */}
      <p
        className={`
        mt-2
        text-[10px] md:text-sm
        font-medium
        text-gray-800 dark:text-gray-300
        transition
        ${
          selectedId === cat.id
            ? "text-[#bf6f32]"
            : "group-hover:text-[#bf6f32]"
        }
      `}
      >
        {cat.name}
      </p>

      {/* UNDERLINE */}
      <div
        className={`
        h-[2px]
        rounded-full
        bg-[#bf6f32]
        mt-1
        transition-all duration-300
        ${
          selectedId === cat.id
            ? "w-8"
            : "w-0 group-hover:w-8"
        }
      `}
      />

    </div>
  ))}
</div>
        {/* RIGHT SIDE IMAGE */}
      <div className="relative">
  <div className="bg-[#e8dfd6] dark:bg-[#1c1c1c] rounded-2xl md:rounded-3xl overflow-hidden shadow-md md:shadow-lg">
    <img
      src={moreCategoryImg}
      alt="Promo"
      className="w-full h-[200px] md:h-[320px] object-cover "
    />
  </div>
</div>

      </div>

    </section>
  );
};

export default MoreCategoriesStrip;