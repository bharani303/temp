import { Heart, Clock, ShoppingCart } from "lucide-react";
import { FaTruck } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const ProductCard = ({ item, rating}) => {
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

 const isLiked = wishlistItems.some(i => i.productId === item.id);
const handleWishlist = async () => {
  if (isLiked) {
    removeFromWishlist(item.id);
    toast("Removed from Wishlist 💔");
  } else {
    await addToWishlist(item);

    if (JSON.parse(localStorage.getItem("user"))?.id) {
      toast("Added to Wishlist 🩷");
    }
  }
};

  const handleCart = () => {
    setLoading(true);

    setTimeout(() => {
      addToCart(item);
      setLoading(false);
      setAdded(true);
    }, 600);
  };

  return (
    <div className="
group relative 
bg-white dark:bg-[#1c1c1c] 
rounded-2xl 
border border-gray-200/70 dark:border-white/10
shadow-[0_2px_12px_rgba(0,0,0,0.05)]
hover:shadow-[0_6px_22px_rgba(0,0,0,0.08)]
hover:-translate-y-[2px]
transition-all duration-300 
flex flex-col overflow-hidden h-full min-w-0
">

      {/* ❤️ Wishlist */}
      <button
        onClick={handleWishlist}
       className="absolute top-2 right-2 z-10 bg-white/90 p-1.5 sm:p-1 rounded-full shadow"
      >
        <Heart
  size={16}
  className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}
/>
      </button>

      {/* IMAGE */}
<div className="
relative
aspect-[4/3]
overflow-hidden
shrink-0
">
        <img
  src={item.image}
  alt={item.name}
  onClick={() => navigate(`/ProductDetails/${item.id}`)}
  className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition duration-500"
/>

<div
  onClick={() => navigate(`/ProductDetails/${item.id}`)}
  className="absolute inset-0 cursor-pointer z-[1]"
></div>

        {/* Rating */}
        <div className="absolute top-2 left-2 bg-white dark:bg-[#2a2a2a] px-2 py-1 rounded-full text-xs shadow flex items-center gap-1">
          <span className="text-[#bf6f32]">★</span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">
{rating ? rating : "New"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
 <div className="p-4 flex flex-col flex-1">

{/* TITLE */}
<h3
onClick={() => navigate(`/ProductDetails/${item.id}`)}
className="
text-sm md:text-base
font-semibold
leading-6
line-clamp-2
min-h-[48px]
text-gray-900 dark:text-white
cursor-pointer hover:text-[#bf6f32]
transition
"
title={item.name}
>
{item.name}
</h3>

{/* PRICE + DELIVERY */}
<div className="mt-2 mb-1">

<p className="text-[11px] text-gray-500">
Monthly rent
</p>

<div className="flex items-center justify-between mt-1 gap-2">

<div
onClick={() => navigate(`/ProductDetails/${item.id}`)}
className="cursor-pointer"
>
<p className="text-xl font-bold text-gray-800 dark:text-white">
₹{item.price}
<span className="text-sm font-normal text-gray-500 ml-1">
/month
</span>
</p>
</div>

<div
className="
flex items-center gap-1
px-3 py-1
rounded-full
bg-[#bf6f32]/10
text-[#bf6f32]
text-[10px]
border border-[#bf6f32]/20
"
>
<FaTruck size={10}/>
<span className="whitespace-nowrap">
24 hrs Delivery
</span>
</div>

</div>

</div>

{/* BUTTON */}
<button
onClick={() => (added ? navigate("/cart") : handleCart())}
className="
mt-5
w-full
bg-[#bf6f32]
text-white
py-3
rounded-xl
flex items-center justify-center gap-2
hover:bg-[#a95c27]
transition
"
>
{loading
? "Adding..."
: added
? <> <ShoppingCart size={15}/> View Cart </>
: <> <ShoppingCart size={15}/> Add to Cart </>
}
</button>

</div>
    </div>
  );
};

export default ProductCard;
