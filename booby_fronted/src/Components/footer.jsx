import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowUp,
  ChevronDown,
} from "lucide-react";

import homieLogo from "../Assets/Icons/footer icon.png";

const Footer = () => {
  const [showButton, setShowButton] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sectionClass = (section) =>
    `overflow-hidden transition-all duration-300 ${
      openSection === section ? "max-h-96 mt-4" : "max-h-0"
    } md:max-h-full md:mt-4`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-[#8b5e3b] dark:bg-[#1a1a1a] text-white pt-12">

        <div className="max-w-7xl mx-auto px-6 md:px-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* HOMIE */}

          <div>

            <button
              onClick={() => toggleSection("brand")}
              className="w-full flex justify-between items-center md:block"
            >

              <div className="flex items-center gap-2">

              {/* Uncomment it, if require logo */}
                {/* <img
                  src={homieLogo}
                  alt="Homie"
                  className="w-8 h-8 rounded-full"
                /> */}

                <h3 className="text-base md:text-xl font-bold">
                  HOMIE
                </h3>
              </div>

              <ChevronDown
                className={`md:hidden transition-transform ${
                  openSection === "brand" ? "rotate-180" : ""
                }`}
              />

            </button>

            <ul className={sectionClass("brand") + " flex flex-col gap-3 text-sm text-gray-200 md:block"}>

              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/culture">Culture</Link></li>
              <li><Link to="/investors">Investors</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/benefits">Our Benefits</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
              <li><Link to="/business">B2B - For Business</Link></li>

            </ul>

          </div>


          {/* INFORMATION */}

          <div>

            <button
              onClick={() => toggleSection("info")}
              className="w-full flex justify-between items-center md:block"
            >

              <h3 className="text-base md:text-xl font-semibold">
                Information
              </h3>

              <ChevronDown
                className={`md:hidden transition-transform ${
                  openSection === "info" ? "rotate-180" : ""
                }`}
              />

            </button>

            <ul className={sectionClass("info") + " flex flex-col gap-3 text-sm text-gray-200 md:block"}>

              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/support">Support Home</Link></li>
              <li><Link to="/documents">Documents Required</Link></li>
              <li><Link to="/returns">Annual Returns</Link></li>
              <li><Link to="/verify-profile">Profile Verification</Link></li>

            </ul>

          </div>


          {/* POLICIES */}

          <div>

            <button
              onClick={() => toggleSection("policies")}
              className="w-full flex justify-between items-center md:block"
            >

              <h3 className="text-base md:text-xl font-semibold">
                Policies
              </h3>

              <ChevronDown
                className={`md:hidden transition-transform ${
                  openSection === "policies" ? "rotate-180" : ""
                }`}
              />

            </button>

            <ul className={sectionClass("policies") + " flex flex-col gap-3 text-sm text-gray-200 md:block"}>

              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/cancellation-return">Cancellation & Return</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/csr-policy">CSR Policy</Link></li>
              <li><Link to="/rental-terms">Rental Terms & Conditions</Link></li>
              <li><Link to="/referral-terms">Referral Terms & Conditions</Link></li>

            </ul>

          </div>


          {/* NEED HELP */}

          <div>

            <button
              onClick={() => toggleSection("help")}
              className="w-full flex justify-between items-center md:block"
            >

              <h3 className="text-base md:text-xl font-semibold">
                Need Help
              </h3>

              <ChevronDown
                className={`md:hidden transition-transform ${
                  openSection === "help" ? "rotate-180" : ""
                }`}
              />

            </button>

            <div className={sectionClass("help") + " md:block text-gray-200 text-sm space-y-4"}>

              <div className="flex items-center gap-2">
                <Mail size={16} />
                support@homie.com
              </div>


              {/* GET APP */}

              <div className="pt-3">

                <h4 className="text-sm font-semibold mb-2">
                  Get the app
                </h4>

                <div className="flex gap-2">

                  <button className="bg-black px-3 py-2 rounded-md text-xs">
                    App Store
                  </button>

                  <button className="bg-black px-3 py-2 rounded-md text-xs">
                    Google Play
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* BOTTOM BAR */}

        <div className="mt-10 border-t border-white/20 py-6">

          <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">

            <p className="text-sm text-white/80">
              © 2026 Homie Furniture Rentals. All rights reserved.
            </p>

            <div className="flex gap-5 text-white/80">

              <Facebook size={20} />
              <Twitter size={20} />
              <Instagram size={20} />
              <Linkedin size={20} />
              <Youtube size={20} />

            </div>

          </div>

        </div>

      </footer>


      {/* BACK TO TOP */}

      {showButton && (

        <div className="fixed bottom-6 right-6 z-50">

          <button
            onClick={scrollToTop}
            className="bg-[#5C3A21] hover:bg-[#8B5E3C] text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
          >

            <ArrowUp size={20} />

          </button>

        </div>

      )}

    </>
  );
};

export default Footer;