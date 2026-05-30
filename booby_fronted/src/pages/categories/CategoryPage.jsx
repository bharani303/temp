import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TopCategories from "./TopCategories";
import FiltersSidebar from "./FiltersSidebar";
import ProductGrid from "./ProductGrid";

const CategoryPage = () => {
  const { name } = useParams();

  const [priceFilter, setPriceFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    window.scrollTo(0,0);
  }, [name]);

  const formattedName = name
    ?.replace(/-/g," ")
    .replace(/\b\w/g,(l)=>l.toUpperCase());

  const formatTitle = (category) => {
    if(!category) return "Products For You";

    const name = category.replace(/-/g," ");

    if(name.toLowerCase()==="sofa") return "Sofas For You";
    if(name.toLowerCase()==="chair") return "Chairs For You";
    if(name.toLowerCase()==="bed") return "Beds For You";

    return `${name} For You`;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">

      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 mb-4">

        <Link to="/" className="hover:text-[#8B5E3C]">
          Home
        </Link>

        <span className="mx-2">›</span>

        <span className="font-medium text-gray-800 dark:text-gray-300">
          {formattedName}
        </span>

      </div>

      {/* Categories */}
      <div className="overflow-hidden">
        <TopCategories activeCategory={name}/>
      </div>

      {/* MOBILE FILTER BAR */}
      <div className="lg:hidden mt-4">
        <FiltersSidebar
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="hidden lg:block lg:col-span-3">

          <div className="sticky top-[90px]">

            <FiltersSidebar
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

          </div>

        </div>

        {/* PRODUCTS */}
        <div className="lg:col-span-9 min-w-0">

          <div className="lg:hidden mb-4">
            <h2 className="text-sm font-semibold uppercase text-gray-700 dark:text-gray-200">
              {formatTitle(name)}
            </h2>
          </div>

          <ProductGrid
            category={name}
            priceFilter={priceFilter}
            ratingFilter={ratingFilter}
            sortBy={sortBy}
          />

        </div>

      </div>

    </div>
  );
};

export default CategoryPage;