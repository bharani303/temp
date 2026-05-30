import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlistItems, setWishlistItems] = useState([]);

  const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user"))
);

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  setUser(storedUser);
}, []);

  //  Fetch wishlist (user based)
 useEffect(() => {
  if (!user?.id) return;

  fetch(`http://localhost:5000/wishlist?userId=${user.id}`)
    .then(res => res.json())
    .then(data => setWishlistItems(data));
}, [user]);

  //  Add to wishlist
const addToWishlist = async (item) => {

  if (!user?.id) {
    toast.error("Please Login First");
    return;
  }

  const exists = wishlistItems.find(
    i => i.productId === item.id
  );

  if (exists) return;

  const newItem = {
    userId: user.id,
    productId: item.id,
    product: item
  };

  const res = await fetch(
    "http://localhost:5000/wishlist",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newItem)
    }
  );

  const data = await res.json();

  setWishlistItems(prev => [
    ...prev,
    data
  ]);
};

  //  Remove from wishlist
 const removeFromWishlist = async (id) => {
  const item = wishlistItems.find(
    i => i.productId === id && i.userId === user.id
  );
    if (!item) return;

    await fetch(`http://localhost:5000/wishlist/${item.id}`, {
      method: "DELETE"
    });

    setWishlistItems(prev =>
      prev.filter(i => i.productId !== id)
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);