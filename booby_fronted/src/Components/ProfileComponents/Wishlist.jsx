import { useWishlist } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../pages/categories/ProductCard";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  if (wishlistItems.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-gray-600">
          Your Wishlist is Empty 😔
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          Go add something you actually like
        </p>
        <button
            onClick={() => navigate("/category/beds")}
            className="bg-[#bf6f32] text-white px-8 py-3 mt-7 rounded-full hover:bg-[#a95c27]"
          >
           Continue Shopping 
          </button>

      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">

      <h1 className="text-2xl font-bold mb-6">❤️ My Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
 {wishlistItems.map((item) => {
  

  return (
    <div key={item.id} >
      <ProductCard item={item.product} />
    </div>
  );
})}
</div>
      <div className="flex justify-center mt-10">
  <button
    onClick={() => navigate("/category/beds")}
    className="bg-[#bf6f32] text-white px-8 py-3 rounded-full 
    hover:bg-[#a95c27] transition duration-300"
  >
    Continue Shopping
  </button>
</div>
    </div>
  );
};

export default Wishlist;