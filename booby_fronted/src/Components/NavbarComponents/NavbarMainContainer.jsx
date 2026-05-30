import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart} from "lucide-react";
import { User, LogOut, Package, UserCircle } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import SearchBar from "./SearchBar";
import AuthModal from "../AuthComponents/AuthModal";
import { MapPin } from "lucide-react";

const NavbarMainContainer = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [open, setOpen] = useState(false); // ✅ dropdown state
 const dropdownRef = useRef(null);
const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const role = user?.role;

  const [isDark, setIsDark] = useState(false);

  const { cartItems } = useCart();

  const totalProducts = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null);
  setOpen(false);

  
  setTimeout(() => {
    navigate("/", { replace: true });
    toast.success("Logged out successfully 👋");
  }, 1300); 
  
};

useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

/* AUTO CLOSE MOBILE SIDEBAR ON DESKTOP */
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener(
      "resize",
      handleResize
    );
  };
}, []);

  /* LOAD DARK MODE */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  /* LOAD USER ON REFRESH (extra safety) */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
  const handleUserUpdate = () => {
    const updatedUser = JSON.parse(localStorage.getItem("user"));
    setUser(updatedUser);
  };

  window.addEventListener("userUpdated", handleUserUpdate);

  return () => {
    window.removeEventListener("userUpdated", handleUserUpdate);
  };
}, []);

  /* TOGGLE DARK MODE */
  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newMode = !prev;

      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return newMode;
    });
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">

        <nav className="w-full max-w-[1400px] mx-auto px-3 sm:px-5">

        <div className="h-[65px] flex items-center justify-between gap-3 overflow-visible">

            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0 flex-1">

          <button
  className="xl:hidden text-gray-700 dark:text-gray-300"
  onClick={() => setIsOpen(true)}
>
  <Menu size={22} />
</button>

              <Logo />
<div className="hidden xl:flex ml-4 min-w-0">
   <NavMenu />
</div>

            </div>

            {/* RIGHT */}
    {/* RIGHT */}
<div className="flex items-center gap-2 flex-1 min-w-0 justify-end">

              {/*  DARK MODE TOGGLE (DESKTOP) */}
              <div className="hidden md:flex items-center gap-2">

                <span className="text-xs text-gray-600 dark:text-gray-300">
                  Dark Mode
                </span>

                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                    isDark ? "bg-[#bf6f32]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-300 ${
                      isDark ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>

              </div>

<div
className="
flex-1
min-w-[70px]
max-w-[110px]
sm:min-w-[140px]
sm:max-w-[220px]
md:min-w-[240px]
md:max-w-[360px]
mx-1
"
>
   <SearchBar />
</div>

              {/* CART */}
              {role !== "admin" && (
  <div className="relative">

    <Link to="/cart">
      <ShoppingCart
        size={21}
        className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-[#8B5E3C] transition"
      />
    </Link>

    {totalProducts > 0 && (
      <span className="absolute -top-3 -right-3 bg-[#bf6f32] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow">
        {totalProducts}
      </span>
    )}

  </div>
)}

              {/* USER */}
           <div className="relative" ref={dropdownRef}>

  {user ? (
    <>
      {/* USER BUTTON */}
     <div
  onClick={() => setOpen(!open)}
  className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full 
  bg-gray-100 dark:bg-[#2a2a2a] 
  hover:bg-gray-200 dark:hover:bg-[#333] 
  transition shadow-sm"
>
  {user?.image ? (
  <img
    src={user.image}
    alt="user"
    className="w-7 h-7 rounded-full object-cover border 
    border-gray-300 dark:border-gray-600"
  />
) : (
  <User size={18} />
)}
  <div className="flex items-center gap-1">
  <span className="text-sm font-medium">
    {user.name}
  </span>

  {role === "admin" && (
    <span className="text-[10px] bg-[#bf6f32] text-white px-2 py-[2px] rounded-full">
      Admin
    </span>
  )}
</div>

  {/*  ARROW */}
  <ChevronDown
    size={16}
    className={`transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
  />
</div>

     {/*  DROPDOWN */}
{open && (
  <div  
    className="absolute right-0 mt-1 w-38 bg-white dark:bg-[#1c1c1c] 
    shadow-xl rounded-xl p-2 z-50 border-2 dark:border-[#2a2a2a]"
  >

    {role === "admin" ? (
      <>
        {/* ADMIN ONLY */}
        <Link
          to="/admin"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2 text-sm rounded-md 
          hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
        >
          <Package size={16} />
          Admin Panel
        </Link>
      </>
    ) : (
      <>
        {/*  USER ONLY */}
        <Link
          to="/profile"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2 text-sm rounded-md 
          hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
        >
          <UserCircle size={16} />
          Profile
        </Link>

        <Link
          to="/orders"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2 text-sm rounded-md 
          hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
        >
          <Package size={16} />
          Orders
        </Link>

        <Link
          to="/wishlist"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2 text-sm rounded-md 
          hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
        >
          <Heart size={16} />
          Wishlist
        </Link>
        <Link
  to="/checkout?manageAddress=true"
  onClick={() => setOpen(false)}
  className="flex items-center gap-3 px-3 py-2 text-sm rounded-md 
  hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
>
  <MapPin size={23} />
  Manage Addresses
</Link>

      </>
    )}

    {/* COMMON */}
    <div className="h-px bg-gray-200 dark:bg-[#333] my-1"></div>

    <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm 
      text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-[#2a2a2a] transition"
    >
      <LogOut size={16} />
      Logout 
    </button>

  </div>
)}
    </>
  ) : (
    <User
      size={21}
      onClick={() => setIsAuthOpen(true)}
      className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-[#8B5E3C] transition"
    />
  )}

</div>

            </div>

          </div>

        </nav>

      </header>

      {/* MOBILE SIDEBAR */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">

          <div className="w-[260px] bg-white dark:bg-[#1c1c1c] h-full shadow-xl p-6 transition-colors duration-300">

            <div className="flex justify-between items-center mb-6">

              <Logo />

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-700 dark:text-gray-300"
              >
                <X size={22} />
              </button>

            </div>

            

            {/*  DARK MODE TOGGLE (MOBILE) */}
            <div className="mb-6 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Dark Mode
              </span>

              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                  isDark ? "bg-[#bf6f32]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-300 ${
                    isDark ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>

            </div>

            <NavMenu
              mobile={true}
              onItemClick={() => setIsOpen(false)}
            />

          </div>

          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsOpen(false)}
          ></div>

        </div>
      )}

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        setUser={setUser}
      />

    </>
  );
};

export default NavbarMainContainer;