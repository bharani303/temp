import { useState } from "react";
import { ArrowRight } from "lucide-react";
import homieLogo from "../../Assets/Icons/favicon.png";
import toast from "react-hot-toast";

import registerimage from "../../Assets/register/r1.jpg"
const theme = "rgb(191,111,50)";

const Register = ({ switchToLogin, phone }) => {

  const [form,setForm] = useState({
    name:"",
    email:"",
    phone: phone || ""
  });

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  const handleRegister = async () => {

  if (!form.name || !form.email) {
    toast.error("All fields required");
    return;
  }

  if (!isValidEmail(form.email)) {
  toast.error("Enter valid email");
  return;
}
const newUser = {
  ...form,
  role: "user",

  createdAt: new Date().toISOString().split("T")[0],
  isBlocked: false,
  orders: [],
  totalSpent: 0
};

  await fetch("http://localhost:5000/users", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(newUser)
  });

  toast.success("Registration successful 🎉, Please login");
  switchToLogin();
};
  return (
<div className="flex flex-col md:flex-row w-full h-full 
  border border-gray-200 
  dark:border-white/10 
  rounded-2xl 
  overflow-hidden 
  shadow-sm 
  dark:shadow-[0_10px_40px_rgba(255,255,255,0.08)]">

      {/* IMAGE */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={registerimage}
          alt="Living room"
          className="w-full h-full object-cover"
        />
      </div>

      {/* FORM */}
      <div className="w-full md:w-1/2 bg-gray-50 dark:bg-[#111] flex items-center justify-center">

        <div className="w-full max-w-md p-6 md:p-10">

          <div className="flex items-center gap-2 mb-5">
            <img src={homieLogo} alt="Homie" className="w-7 h-7"/>
            <span className="text-lg font-semibold" style={{color:theme}}>
              Homie
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-6">
            <span style={{color:theme}}>Create account</span>
            <br/>
            Start your journey
          </h2>

          <div className="space-y-4">

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border border-gray-300 px-5 py-3 rounded-full focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": theme }}
            />

            <input
              type="email"
              required
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-5 py-3 rounded-full focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": theme }}
            />

            
<input
  value={form.phone}
  readOnly
  className="w-full border px-5 py-3 rounded-full bg-gray-100"
/>
            <button
              onClick={handleRegister}
              className="w-full text-white py-3 rounded-full flex items-center justify-center gap-2 hover:opacity-90"
              style={{backgroundColor:theme}}
            >
              Continue <ArrowRight size={16}/>
            </button>

          </div>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?
            <span
              onClick={switchToLogin}
              className="cursor-pointer ml-1 font-medium"
              style={{color:theme}}
            >
              Sign in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;