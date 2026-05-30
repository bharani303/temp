import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown, LayoutGrid, Package, ShieldCheck,
  Sofa, BedDouble, Armchair, Tv, BookOpen, Warehouse, Utensils, Lamp, Home
} from "lucide-react";

import bedsImg from "../../Assets/categoriesstrip/Beds1.png";
import sofaImg from "../../Assets/categoriesstrip/sofa1.png";
import reclinerImg from "../../Assets/categoriesstrip/Recliners1.png";
import wardrobeImg from "../../Assets/categoriesstrip/wardrobe1.png";
import tvImg from "../../Assets/categoriesstrip/Tvunit1.png";
import diningImg from "../../Assets/categoriesstrip/Diningtable1.png";
import bookshelfImg from "../../Assets/categoriesstrip/bookshelf1.png";
import studyImg from "../../Assets/categoriesstrip/officetable1.png";
import chairImg from "../../Assets/categoriesstrip/officechair1.png";
import mattressImg from "../../Assets/categoriesstrip/mattresses1.png";
import dresserImg from "../../Assets/categoriesstrip/dressers1.png";
import hammockImg from "../../Assets/categoriesstrip/hammock1.png";

const NavMenu = ({ mobile = false, onItemClick }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { name: "beds", icon: <BedDouble size={16} />, img: bedsImg },
    { name: "sofa", icon: <Sofa size={16} />, img: sofaImg },
    { name: "recliners", icon: <Armchair size={16} />, img: reclinerImg },
    { name: "wardrobe", icon: <Warehouse size={16} />, img: wardrobeImg },
    { name: "tv-unit", icon: <Tv size={16} />, img: tvImg },
    { name: "dining Table", icon: <Utensils size={16} />, img: diningImg },
    { name: "bookshelf", icon: <BookOpen size={16} />, img: bookshelfImg },
    { name: "office-table", icon: <BookOpen size={16} />, img: studyImg },
    { name: "office-chair", icon: <Home size={16} />, img: chairImg },
    { name: "mattresses", icon: <Home size={16} />, img: mattressImg },
    { name: "dressers", icon: <Lamp size={16} />, img: dresserImg },
    { name: "hammock", icon: <Home size={16} />, img: hammockImg },
  ];

  /*  OUTSIDE CLICK CLOSE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }

    setOpen(false); //  close dropdown

    if (mobile && onItemClick) onItemClick();
  };

  const goToCategory = (cat) => {
    navigate(`/category/${cat}`);
    setOpen(false);

    if (mobile && onItemClick) onItemClick();
  };

  return (
    <div
      className={
        mobile
          ? "flex flex-col space-y-6 text-lg font-medium"
        : "flex items-center gap-3 lg:gap-5 relative whitespace-nowrap"
      }
    >

      {/* CATEGORIES */}
      <div className="relative" ref={dropdownRef}>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-[#A47148] transition"
        >
          <LayoutGrid size={16} />
          Categories
          <ChevronDown
            size={16}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 mt-3 w-56 max-h-80 overflow-y-auto
          bg-white dark:bg-[#1c1c1c] 
          border dark:border-gray-700 
          rounded-lg shadow-lg z-50">

            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => goToCategory(cat.name)}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm 
                hover:bg-gray-100 dark:hover:bg-gray-700 capitalize"
              >

                {/* MOBILE → ICON */}
                {mobile ? (
                  cat.icon
                ) : (
                  /* DESKTOP → IMAGE */
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-8 h-8 object-contain rounded"
                  />
                )}

                {cat.name.replace("-", " ")}

              </button>
            ))}

          </div>
        )}

      </div>

      {/* COMBOS */}
      <button
        onClick={() => scrollToSection("combos")}
        className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-[#A47148] transition"
      >
        <Package size={16} />
        Combos
      </button>

      {/* WHY HOMIE */}
      <button
        onClick={() => scrollToSection("offers")}
        className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-[#A47148] transition"
      >
        <ShieldCheck size={16} />
        Why Homie?
      </button>

    </div>
  );
};

export default NavMenu;
