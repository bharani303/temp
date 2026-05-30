import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

// Images
import allImg from "../../Assets/categoriesstrip/All.png";
import beds from "../../Assets/categoriesstrip/Beds1.png";
import dining from "../../Assets/categoriesstrip/Diningtable1.png";
import dresser from "../../Assets/categoriesstrip/dressers1.png";
import hammock from "../../Assets/categoriesstrip/hammock1.png";
import mattresses from "../../Assets/categoriesstrip/mattresses1.png";
import officechair from "../../Assets/categoriesstrip/officechair1.png";
import officetable from "../../Assets/categoriesstrip/officetable1.png";
import Bookshelf from "../../Assets/categoriesstrip/bookshelf1.png";
import recliner from "../../Assets/categoriesstrip/Recliners1.png";
import sofa from "../../Assets/categoriesstrip/sofa1.png";
import tvunit from "../../Assets/categoriesstrip/Tvunit1.png";
import wardrobe from "../../Assets/categoriesstrip/wardrobe1.png";

const categories = [
  { name: "All", image: allImg },
  { name: "Beds", image: beds },
  { name: "Dining Table", image: dining },
  { name: "Dressers", image: dresser },
  { name: "Hammock", image: hammock },
  { name: "Mattresses", image: mattresses },
  { name: "Office Chair", image: officechair },
  { name: "Office Table", image: officetable },
  { name: "Bookshelf", image: Bookshelf },
  { name: "Recliners", image: recliner },
  { name: "Sofa", image: sofa },
  { name: "TV Unit", image: tvunit },
  { name: "Wardrobe", image: wardrobe },
];


const TopCategories = ({ activeCategory }) => {

  const navigate = useNavigate();

  const handleClick = (cat) => {
    const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${slug}`);
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4 px-1 md:px-8">
      
      {/* Scroll container */}
      <div className="flex gap-6 md:gap-10 px-2 md:px-4 min-w-max">

        {categories.map((cat, index) => {
          const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
          const isActive = activeCategory === slug;

          return (
            <div
              key={index}
              onClick={() => handleClick(cat)}
              className="flex flex-col items-center cursor-pointer group min-w-[70px]"
            >
              {/* Circle */}
              <div
                className={`relative 
                w-14 h-14 md:w-16 md:h-16
                rounded-full transition-all duration-300
                ${
                  isActive
                    ? "ring-2 ring-[#8B5E3C]" 
                    : "ring-2 ring-gray-200 dark:ring-[#2a2a2a] group-hover:ring-[#8B5E3C]"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-[#1c1c1c]">
  <img
    src={cat.image}
    alt={cat.name}
    className="w-20 h-13 md:w-25 md:h-25 object-contain transition duration-300 group-hover:scale-110"
  />
</div>

                {/* Active Tick */}
                {isActive && (
                  <div
                    className="
                    absolute 
                    top-0 right-0
                    translate-x-1/3 -translate-y-1/3
                    bg-[#8B5E3C] 
                    w-4 h-4 md:w-5 md:h-5
                    flex items-center justify-center
                    rounded-full
                    border border-white
                    shadow-sm
                  "
                  >
                    <Check className="text-white w-2.5 h-2.5 md:w-3 md:h-3" />
                  </div>
                )}
              </div>

              {/* Text */}
              <p
                className={`mt-2 md:mt-3 text-xs md:text-sm font-medium text-center transition
                ${
                  isActive
                    ? "text-[#8B5E3C]" 
                    : "text-gray-700 dark:text-gray-300 group-hover:text-[#8B5E3C]"
                }`}
              >
                {cat.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCategories;