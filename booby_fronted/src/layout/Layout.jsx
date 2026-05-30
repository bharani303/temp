import Navbar from "../Components/NavbarComponents/NavbarMainContainer";
import { Outlet } from "react-router-dom";
import Footer from "../Components/footer";
const Layout = () => {
  return (
    <>
  
      <div  className="bg-white dark:bg-[#111] text-gray-800 dark:text-gray-200 min-h-screen"> 
      
        <Navbar />
        <Outlet />

      <Footer/>
      </div>
    </>
  );
};

export default Layout;