import { useState } from "react";
import { X } from "lucide-react";
import Login from "./login";
import Register from "./register";

const AuthModal = ({ isOpen, onClose, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
const [prefillPhone, setPrefillPhone] = useState("");
const [registeredNow, setRegisteredNow]= useState(false);


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-[92%] max-w-[780px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
        >
          <X size={20} />
        </button>

        {isLogin ? (
       <Login
  registeredNow={registeredNow}
  onLoginSuccess={(user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    onClose();
    
  }}
  openRegisterWithPhone={(phone) => {
    setPrefillPhone(phone);
    setIsLogin(false);
  }}
/>
        ) : (
<Register
  switchToLogin={() => {
    setRegisteredNow(true);
    setIsLogin(true);
  }}
  phone={prefillPhone}
/>
        )}
      </div>
    </div>
  );
};

export default AuthModal;