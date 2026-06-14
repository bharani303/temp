import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";
import homieLogo from "../../Assets/Icons/favicon.png";
import toast from "react-hot-toast";
import loginimage from "../../Assets/login/fg.jpg";

const theme = "rgb(191,111,50)";

const Login = ({ onLoginSuccess, openRegisterWithPhone, registeredNow  }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [name, setName] = useState("");
  const [timer, setTimer] = useState(0);
  const inputsRef = useRef([]);

  // SEND OTP (Test Mode: generates a random 4-digit OTP for testing without Firebase/SMS)
  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return toast.error("Enter valid 10 digit mobile number");
    }

    const fakeOtp = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOtp(fakeOtp);
    console.log(`OTP for ${phone}:`, fakeOtp);
    toast.success(`Test Mode: Your OTP is ${fakeOtp}`, { duration: 8000 });

    // Pre-fill the OTP array so that the user doesn't even have to type it,
    // but they can still see it and change it if they want.
    const otpArray = fakeOtp.toString().split("");
    setOtp(otpArray);

    setStep(2);
    setTimer(30);
  };

  useEffect(() => {
  if (timer <= 0) return;

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);



  // VERIFY OTP (Test Mode OTP validation)
  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp != generatedOtp) {
      toast.error("Invalid OTP");
      return;
    }


    try {
      const res = await fetch(`https://booby-backend.onrender.com/users?phone=${phone}`);
      const data = await res.json();

      if (data.length === 0) {
  // ✅ NEW USER → REGISTER PAGE KHOL
  toast.success("New user, please register");
  openRegisterWithPhone(phone);
} else {
  // ✅ EXISTING USER → LOGIN
  localStorage.setItem("user", JSON.stringify(data[0]));

if (data[0].isBlocked) {
  toast.error("Your account is blocked 🚫");
  return;
}

toast.success(`Welcome back, ${data[0].name}`);

// ROLE BASED FLOW
if (data[0].role === "admin") {
  window.location.href = "/admin"; // ya navigate("/admin")
} else {
  onLoginSuccess(data[0]);
}
}
    } catch {
      toast.error("Server error");
    }
  };

  // REGISTER NEW USER
  const registerUser = async () => {
    if (!name) return toast.error("Enter name");

    const newUser = {
  name,
  phone,
  role: "user",
  createdAt: new Date().toISOString().split("T")[0],
  isBlocked: false,
  orders: [],
  totalSpent: 0
};

    await fetch("https://booby-backend.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    localStorage.setItem("user", JSON.stringify(newUser));
    toast.success("Account created 🎉");
    onLoginSuccess(newUser);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full border rounded-2xl overflow-hidden">

      {/* LEFT IMAGE */}
      <div className="hidden md:block md:w-1/2">
        <img src={loginimage} className="w-full h-full object-cover" />
      </div>

      {/* RIGHT */}
    <div className="w-full md:w-1/2 bg-[#f6f6f6] dark:bg-[#111] flex items-center justify-center">

  <div className="w-full max-w-[420px] px-6 py-8">

    {/* LOGO */}
    <div className="flex flex-col leading-tight gap-1 mb-8">
      <span className="text-3xl font-bold text-[#9c6e4f] dark:text-white">
        Homie
      </span>
      <span className="text-xs text-[#9c6e4f] dark:text-gray-400 tracking-wide">
        Furniture Rentals
      </span>
    </div>

    {/* FEATURES */}
    <div className="grid grid-cols-3 gap-4 mb-8 text-xs">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl py-3 flex flex-col items-center shadow-sm">
        <ShieldCheck size={18} color={theme}/>
        <span className="mt-1">Offers</span>
      </div>
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl py-3 flex flex-col items-center shadow-sm">
        <Truck size={18} color={theme}/>
        <span className="mt-1">Delivery</span>
      </div>
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl py-3 flex flex-col items-center shadow-sm">
        <Sparkles size={18} color={theme}/>
        <span className="mt-1">Premium</span>
      </div>
    </div>

    {/* HEADING */}
   {step === 1 && (
<h2 className="text-[26px] font-bold leading-snug mb-8">
  <span style={{ color: theme }}>
    {registeredNow
      ? "Login to continue"
      : "Enter your number to"}
  </span>

  {!registeredNow && (
    <>
      <br />
      Signup or Login
    </>
  )}
</h2>
)}

    {/* STEP 1 */}
    {step === 1 && (
    <div className="relative">

 <input
  type="tel"
  placeholder="Enter your phone number"
  value={phone}
  onChange={(e) => {
    
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendOtp();
    }
  }}
  className="w-full pl-5 pr-16 py-4 rounded-full border border-gray-600 text-lg focus:outline-none focus:ring-2"
  style={{ "--tw-ring-color": theme }}
/>

  <button
    onClick={sendOtp}
    className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
    style={{ backgroundColor: theme }}
  >
    →
  </button>

</div>
    )}

    {/* STEP 2 */}
    {step === 2 && (
      <div className="space-y-7">

        {/* HEADING */}
        <div>
          <h2 className="text-xl font-bold">
            <span style={{ color: theme }}>Enter OTP sent</span>
          </h2>
          <p className="text-m mt-1 text-gray-600">
            to <span className="font-semibold text-black dark:text-white">+91 {phone}</span>{" "}
            <span
              className="underline cursor-pointer ml-1"
              style={{ color: theme }}
              onClick={() => setStep(1)}
            >
              Change Number
            </span>
          </p>
        </div>

        {/* OTP BOXES */}
        <div className="flex gap-3 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const val = e.target.value;
                if (!/^\d?$/.test(val)) return;

                const newOtp = [...otp];
                newOtp[index] = val;
                setOtp(newOtp);

                if (val && index < otp.length - 1) {
                  inputsRef.current[index + 1]?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && otp[index] === "" && index > 0) {
                  inputsRef.current[index - 1]?.focus();
                }
              }}
              className="w-14 h-14 text-center text-lg border rounded-full focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": theme }}
            />
          ))}
        </div>

{/* BUTTONS */}
<div className="flex gap-3">
<button
  type="button"
  onClick={sendOtp}
  disabled={timer > 0}
  className={`flex-1 py-3 rounded-full border text-sm flex items-center justify-center gap-2 transition-all
    ${
      timer > 0
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-black hover:bg-gray-50 border-gray-300"
    }`}
>
  ↻
   {timer > 0 ? ` Resend in ${timer}s` : "Resend OTP"}
</button>

          <button
            type="submit"
            onClick={verifyOtp}
            className="flex-1 text-white py-3 rounded-full text-sm"
            style={{ backgroundColor: "#bf6f32" }}
          >
            Continue →
          </button>

        </div>
      </div>
    )}

  </div>
</div>
    </div>
  );
};

export default Login;
