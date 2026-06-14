import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const MobileFeatures = () => {
  const features = [
    { icon: "🚚", text: "Free Relocation" },
    { icon: "🛠", text: "Free Repair" },
    { icon: "💰", text: "Postpaid" },
    { icon: "🏠", text: "Easy Upgrade" },
  ];

  return (
    <div className="md:hidden col-span-2 my-4">
      <h3 className="text-center text-sm font-bold text-[#bf6f32] mb-3">
        WHY CHOOSE HOMIE
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="border border-red-300 rounded-xl p-3 flex items-center gap-2 bg-red-50 text-xs font-medium text-red-500"
          >
            <span className="text-lg">{f.icon}</span>
            {f.text}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductGrid = ({
category,
priceFilter=[],
ratingFilter,
sortBy
}) => {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  Promise.all([
    fetch("https://booby-backend.onrender.com/products").then(res => res.json()),
    fetch("https://booby-backend.onrender.com/reviews").then(res => res.json())
  ])
  .then(([productsData, reviewsData]) => {

    const ratingsMap = {};

    productsData.forEach(product => {
      const productReviews = reviewsData.filter(
        r => r.productId === product.id
      );

      const avg =
        productReviews.length > 0
          ? (
              productReviews.reduce((a, r) => a + r.rating, 0) /
              productReviews.length
            ).toFixed(1)
          : null;

      ratingsMap[product.id] = avg;
    });

    setProducts(productsData);
    setRatings(ratingsMap);
    setLoading(false);
  })
  .catch(() => setLoading(false));
}, []);

  const normalizedCategory = category
    ? category.replace(/-/g, " ").toLowerCase()
    : null;

  const filteredProducts = products.filter(item => {
    const normalize = (str) =>
  str?.toLowerCase().replace(/-/g, " ").replace(/s$/, "").trim();


const categoryMatch =
  normalizedCategory === "all"
    ? true
    : normalizedCategory
    ? normalize(item.category) === normalize(category)
    : true;

    const priceMatch =
      priceFilter.length === 0 ||
      priceFilter.some(([min, max]) => item.price >= min && item.price <= max);

    const ratingMatch =
      !ratingFilter || ratings[item.id] >= ratingFilter;

    return categoryMatch && priceMatch && ratingMatch;
  });
// SORT PRODUCTS AFTER FILTERING
const sortedProducts = [...filteredProducts];

if (sortBy === "lowToHigh") {
  sortedProducts.sort(
    (a, b) => a.price - b.price
  );
}

if (sortBy === "highToLow") {
  sortedProducts.sort(
    (a, b) => b.price - a.price
  );
}
  if (loading) {
    return <div className="text-center mt-10">Loading products... ⏳</div>;
  }

  return (
    <>
<div className="
grid
grid-cols-2
sm:grid-cols-2
md:grid-cols-2
lg:grid-cols-3
xl:grid-cols-3
gap-3
md:gap-5
w-full
items-stretch
">

        {sortedProducts.map((item, index) => (
          <div key={item.id} className="contents">

            {index === 6 && (
              <div className="col-span-2 lg:col-span-3">
                <MobileFeatures />
              </div>
            )}

            <ProductCard
              item={item}
              rating={ratings[item.id]}
            />
          </div>
        ))}

      </div>

      <div className="mt-10 mb-16 text-center">
        <h2 className="text-gray-500 text-sm md:text-base">
          You reached the end 🚀
        </h2>
      </div>
    </>
  );
};

export default ProductGrid;





//! this code is applied if we dont want rating //

// const ProductGrid = ({ category, priceFilter }) => {

//   // ✅ Hook always inside component
//   const [likedItems, setLikedItems] = useState([]);

//   const toggleLike = (id) => {
//     setLikedItems((prev) =>
//       prev.includes(id)
//         ? prev.filter((itemId) => itemId !== id)
//         : [...prev, id]
//     );
//   };

//   const normalizedCategory = category
//     ? category.replace(/-/g, " ").toLowerCase()
//     : null;

//   const filteredProducts = allProducts.filter((item) => {
//     const itemCategoryNormalized = item.category
//       .replace(/-/g, " ")
//       .toLowerCase();

//     const categoryMatch = normalizedCategory
//       ? itemCategoryNormalized === normalizedCategory
//       : true;

//     const priceMatch = priceFilter
//       ? item.price >= priceFilter[0] &&
//         item.price <= priceFilter[1]
//       : true;

//     return categoryMatch && priceMatch;
//   });
//   return (
//   <>
//     {/* Product Grid */}
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
//       {filteredProducts.map((item) => (
//         <div
//           key={item.id}
//           className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden 
//           shadow-sm hover:shadow-2xl hover:-translate-y-2 
//           transition-all duration-300"
//         >
//           {/* ❤️ Like Button */}
//           <button
//             onClick={() => toggleLike(item.id)}
//             className="absolute top-2 right-2 md:top-4 md:right-4 
//             z-20 bg-white p-1 md:p-2 rounded-full shadow-md 
//             hover:scale-110 transition"
//           >
//             <Heart
//               size={14}
//               className={
//                 likedItems.includes(item.id)
//                   ? "fill-red-500 text-red-500"
//                   : "text-gray-400"
//               }
//             />
//           </button>

//           {/* Image */}
//           <div className="relative overflow-hidden">
//             {item.image ? (
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="h-32 md:h-64 w-full object-cover 
//                 hover:scale-105 transition duration-500"
//               />
//             ) : (
//               <div className="h-32 md:h-64 w-full bg-gray-200 flex items-center justify-center">
//                 No Image
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="p-2 md:p-5 flex flex-col gap-1 md:gap-3">
//             <h3 className="font-semibold text-xs md:text-lg line-clamp-2">
//               {item.name}
//             </h3>

//             <p className="text-[11px] md:text-sm text-gray-500">
//               ₹ {item.price} / month
//             </p>

//             <button
//               className="mt-1 flex items-center justify-center gap-1.5 
//               bg-[#bf6f32] text-white py-1.5 md:py-2.5 
//               rounded-md md:rounded-xl 
//               text-[11px] md:text-sm font-medium 
//               hover:bg-[#a95c27] transition duration-300"
//             >
//               🛒 Add to Cart
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>

//     {/* End Section */}
//     <div className="mt-10 mb-10 flex flex-col items-center justify-center text-center">
      
//       <div className="w-20 h-[2px] bg-gray-300 mb-4"></div>

//       <h2 className="text-lg md:text-2xl font-semibold text-gray-700 tracking-wide">
//         You are at the end
//       </h2>

//       <p className="text-sm text-gray-500 mt-2">
//         No more products to show
//       </p>

//       <button
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         className="mt-6 px-6 py-2.5 bg-[#bf6f32] text-white 
//         rounded-full text-sm font-medium 
//         hover:bg-gray-800 transition duration-300"
//       >
//         ↑ Back to Top
//       </button>
//     </div>
//   </>
// );
// };

// export default ProductGrid;











































