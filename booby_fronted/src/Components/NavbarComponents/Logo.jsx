import { NavLink } from "react-router-dom";
import logo from "../../Assets/Icons/favicon.png";

const Logo = () => {
  return (
    <NavLink to="/" className="flex items-center">
      <div className="flex items-center ">

       {/*  uncomment it , if require the logo */}
        {/* <img
          src={logo}
          alt="Homie Logo"
          className="hidden md:block w-20 h-20 object-contain "
        /> */}

        <div className="flex flex-col leading-none">
          <span className="text-2xl font-bold text-[#9c6e4f] dark:text-white">
            Homie
          </span>
          <span className="text-[10px] text-[#9c6e4f] dark:text-gray-400">
            Furniture Rentals
          </span>
        </div>

      </div>
    </NavLink>
  );
};

export default Logo;


