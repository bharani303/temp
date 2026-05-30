import { useState } from "react";
import { useNavigate } from "react-router-dom";

import beds from "../Assets/categoriesstrip/Beds1.png";
import Dinning from "../Assets/categoriesstrip/Diningtable1.png";
import dresser from "../Assets/categoriesstrip/dressers1.png";
import hammock from "../Assets/categoriesstrip/hammock1.png";
import mattresses from "../Assets/categoriesstrip/mattresses1.png";
import officechair from "../Assets/categoriesstrip/officechair1.png";
import officetable from "../Assets/categoriesstrip/officetable1.png";
import bookshelf from "../Assets/categoriesstrip/bookshelf1.png";
import recliner from "../Assets/categoriesstrip/Recliners.png";
import sofa from "../Assets/categoriesstrip/sofa.png";
import tvunit from "../Assets/categoriesstrip/Tvunit.png";
import wardrobe from "../Assets/categoriesstrip/wardrobe.png";

const categories = [
  { id: 1, name: "Beds", image: beds },
  { id: 2, name: "Dining Table", image: Dinning },
  { id: 3, name: "Dressers", image: dresser },
  { id: 4, name: "Hammock", image: hammock },
  { id: 5, name: "Mattresses", image: mattresses },
  { id: 6, name: "Office Chair", image: officechair },
  { id: 7, name: "Office Table", image: officetable },
  { id: 8, name: "Bookshelf", image: bookshelf },
  { id: 9, name: "Recliners", image: recliner },
  { id: 10, name: "Sofa", image: sofa },
  { id: 11, name: "TV Unit", image: tvunit },
  { id: 12, name: "Wardrobe", image: wardrobe },
];

const CategoriesStrip = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleClick = (cat) => {
    setSelectedId(cat.id);
    const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${slug}`);
  };

  return (
<section className="py-6 px-4 md:px-16 bg-[#f5f3ef] dark:bg-[#111] transition">

      {/* Heading */}
      <h2 className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-10">
        <span className="text-2xl md:text-4xl font-bold text-[#9c6e4f]">
          Homie's
        </span>
        <span className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-gray-300">
          Top Categories
        </span>
        <span className="hidden md:block h-[3px] w-16 bg-[#9c6e4f] rounded-full"></span>
      </h2>

      {/* Categories Container */}
  <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-y-6 gap-x-3 md:gap-6 lg:gap-8">

{categories.slice(0,8).map((cat)=> (

<div
key={cat.id}
onClick={()=>handleClick(cat)}
className="group cursor-pointer flex flex-col items-center text-center"
>

{/* Card */}
<div
className="
relative
w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
flex items-center justify-center
rounded-2xl md:rounded-3xl
bg-gradient-to-b from-white to-[#faf6f1] 
dark:from-[#1c1c1c] dark:to-[#1c1c1c]
border border-[#eadfd5] dark:border-[#2a2a2a]
shadow-sm
transition-all duration-300
group-hover:-translate-y-2
group-hover:shadow-lg
"
>

{/* glow */}
<div
className="
absolute
inset-0
rounded-2xl md:rounded-3xl
bg-[#bf6f32]
opacity-0
blur-lg
transition
group-hover:opacity-[0.10]
"
/>

{/* icon */}
<img
src={cat.image}
alt={cat.name}
className="
relative
h-8 sm:h-10 md:h-14
object-contain
transition-transform duration-300
group-hover:scale-110
"
/>

</div>

{/* Label */}
<p
className="
mt-2
text-[10px] sm:text-xs md:text-sm
font-semibold
tracking-wide
text-gray-700 dark:text-gray-300
transition
group-hover:text-[#bf6f32]
"
>
{cat.name}
</p>

{/* underline */}
<div
className="
h-[2px]
w-0
bg-[#bf6f32]
rounded-full
transition-all duration-300
group-hover:w-8
mt-1
"
/>

</div>

))}

</div>
    </section>
  );
};

export default CategoriesStrip;