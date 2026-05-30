import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const CheckoutAddress = () => {

  const navigate = useNavigate();
const location = useLocation();

  const { cartItems, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

 const [form, setForm] = useState({
  name: "",
  phone: "",
  address: "", // House/Flat
  area: "",
  city: "",
  state: "",
  pincode: "",
  altPhone: "",
  addressType: "Home"
});

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity * ((item.months || 3) / 3),
    0
  );

 useEffect(() => {

const user = JSON.parse(
localStorage.getItem("user")
);

if(!user) return;

fetch(
`http://localhost:5000/addresses?userId=${user.id}`
)

.then(res=>res.json())

.then(data=>{
setAddresses(data);
});

},[]);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    toast.error("Please login first");
    navigate("/", { replace: true });
  }
}, [navigate]);

useEffect(() => {
  const params = new URLSearchParams(location.search);

  if (params.get("manageAddress") === "true") {
    setShowForm(true);
  }
}, [location]);

const handleAddAddress = async () => {

const user = JSON.parse(
localStorage.getItem("user")
);

if(editId){

await fetch(
`http://localhost:5000/addresses/${editId}`,
{
method:"PATCH",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
}
);

const updated = addresses.map(a =>
a.id===editId
? {...a,...form}
: a
);

setAddresses(updated);

setEditId(null);

}

else{

const newAddress = {

id:Date.now(),

userId:user.id,

...form

};

await fetch(
"http://localhost:5000/addresses",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(newAddress)
}
);

setAddresses([
...addresses,
newAddress
]);

}

setShowForm(false);

setForm({
name:"",
phone:"",
address:"",
area:"",
city:"",
state:"",
pincode:"",
altPhone:"",
addressType:"Home"
});

};

const handleDelete = async(id)=>{

await fetch(
`http://localhost:5000/addresses/${id}`,
{
method:"DELETE"
}
);

const updated=addresses.filter(
a=>a.id!==id
);

setAddresses(updated);

if(selectedAddress===id){
setSelectedAddress(null);
}

};

  const handleEdit = (addr) => {
    setForm(addr);
    setEditId(addr.id);
    setShowForm(true);
  };

  const handlePayment = () => {

    const options = {
      key: "rzp_test_SOgxbb6htrGWrX",
      amount: (totalPrice + 0) * 100,
      currency: "INR",
      name: "Homie Furniture Rentals",

handler: async function () {

  const user = JSON.parse(localStorage.getItem("user"));

  const newOrder = {
  orderId: "ORD-" + Date.now(), //  UNIQUE ORDER ID
  userId: user?.id,
   userEmail: user?.email, 
  items: cartItems,
  address: addresses.find(a => a.id === selectedAddress),
  total: totalPrice + 149,
  payment: "Razorpay",
  status: "pending",
  date: new Date().toISOString()
};

  //  1. SAVE ORDER
  await fetch("http://localhost:5000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newOrder),
  });

  //  2. UPDATE USER
  const updatedUser = {
    ...user,
    orders: [...(user.orders || []), newOrder],
    totalSpent: (user.totalSpent || 0) + newOrder.total
  };

  await fetch(`http://localhost:5000/users/${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
  });

  //  3. UPDATE LOCALSTORAGE
  localStorage.setItem("user", JSON.stringify(updatedUser));

  // ✅ ADD THIS LINE
localStorage.setItem("reviewPrompt", "true");

  clearCart();
  toast.success("Order Placed Successfully 🎉");
  navigate("/orders");
}
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 lg:py-10 
    lg:h-[calc(100vh-120px)] 
    grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 lg:gap-10 
    bg-white dark:bg-[#121212] 
    text-black dark:text-white 
    overflow-hidden">

      {/* LEFT SIDE */}

      <div className="lg:overflow-y-auto pr-2 pb-24 lg:hide-scrollbar">

        <button
          onClick={() => navigate("/cart")}
          className="mb-6 text-white bg-[#9c6e4f] rounded-md px-3 py-1 text-sm"
        >
          ← Back to Cart
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <h2 className="text-base sm:text-lg font-semibold">
            Select Delivery Address
          </h2>

          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
            }}
            className="text-[#bf6f32] font-semibold text-sm sm:text-base"
          >
            + ADD NEW ADDRESS
          </button>
        </div>

        {/* ADDRESS LIST */}

        <div className="space-y-4">

          {addresses.map(addr => (

            <div
              key={addr.id}
              className={`border rounded-xl p-4 md:p-6 transition ${
                selectedAddress === addr.id
                  ? "bg-[#f8efe8] dark:bg-[#2a1d14] border-[#bf6f32] shadow-md"
                  : "hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            >

              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

                <div className="flex gap-3">

                  <input
                    type="radio"
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                  />

                  <div>

                    <h3 className="font-semibold">{addr.name}</h3>

  <p className="text-sm text-gray-600 dark:text-gray-400">

{addr.address},
{addr.area},
{addr.city},
{addr.state} - {addr.pincode}

</p>

<p className="text-sm mt-2">
📞 {addr.phone}
</p>

{addr.altPhone && (
<p className="text-sm">
Alt: {addr.altPhone}
</p>
)}

<p className="text-xs mt-2 mr-3 bg-[#bf6f32] text-white inline-block px-2 py-1 rounded">

{addr.addressType}

</p>

                    <button
                      className="mt-4 bg-[#bf6f32] text-white px-4 py-2 rounded text-sm"
                      onClick={() => setSelectedAddress(addr.id)}
                    >
                      Deliver to this Address
                    </button>

                  </div>

                </div>

                {/* ICONS */}

               <div className="flex gap-4 items-start">

  <button
    onClick={() => handleEdit(addr)}
    className="text-gray-600 dark:text-gray-300 hover:text-[#bf6f32] transition"
  >
    <Pencil size={18} />
  </button>

  <button
    onClick={() => handleDelete(addr.id)}
    className="text-red-500 hover:text-red-700 transition"
  >
    <Trash2 size={18} />
  </button>

</div>

              </div>

            </div>

          ))}

        </div>

        {/* FORM */}

        {showForm && (

          <div className="border dark:border-gray-700 rounded-xl p-4 md:p-6 mt-6 bg-white dark:bg-[#1e1e1e]">

            <h3 className="font-semibold mb-4">
              {editId ? "Edit Address" : "Add New Address"}
            </h3>

          <input
  placeholder="Full Name"
  value={form.name}
  className="border dark:border-gray-600 bg-transparent p-2 w-full mb-3 rounded"
  onChange={(e)=>
    setForm({...form,name:e.target.value})
  }
/>

{/* Phone */}

<input
  placeholder="Phone Number"
  value={form.phone}
  maxLength={10}
  className="border dark:border-gray-600 bg-transparent p-2 w-full mb-3 rounded"
  onChange={(e)=>{

    const value=e.target.value.replace(/\D/g,'');

    setForm({
      ...form,
      phone:value
    })

  }}
/>

<textarea
  placeholder="House / Flat / Street"
  value={form.address}
  className="border dark:border-gray-600 bg-transparent p-2 w-full mb-3 rounded"
  onChange={(e)=>
    setForm({...form,address:e.target.value})
  }
/>

<input
  placeholder="Area / Village / City"
  value={form.area}
  className="border dark:border-gray-600 bg-transparent p-2 w-full mb-3 rounded"
  onChange={(e)=>{

    const value=e.target.value.replace(/[^a-zA-Z\s]/g,'')

    setForm({
      ...form,
      area:value
    })

  }}
/>

<div className="grid grid-cols-2 gap-3">

<input
  placeholder="State"
  value={form.state}
  className="border dark:border-gray-600 bg-transparent p-2 rounded"
  onChange={(e)=>{

    const value=e.target.value.replace(/[^a-zA-Z\s]/g,'')

    setForm({
      ...form,
      state:value
    })

  }}
/>

<input
  placeholder="Pincode"
  value={form.pincode}
  maxLength={6}
  className="border dark:border-gray-600 bg-transparent p-2 rounded"
  onChange={(e)=>{

    const value=e.target.value.replace(/\D/g,'')

    setForm({
      ...form,
      pincode:value
    })

  }}
/>

</div>
         
{/* Optional Alternate */}

<input
  placeholder="Alternative Phone Number (Optional)"
  value={form.altPhone}
  maxLength={10}
  className="border dark:border-gray-600 bg-transparent p-2 w-full mt-3 mb-3 rounded"
  onChange={(e)=>{

    const value=e.target.value.replace(/\D/g,'')

    setForm({
      ...form,
      altPhone:value
    })

  }}
/>

{/* Address Type */}

<select
value={form.addressType}
className="border dark:border-gray-600 bg-transparent p-2 w-full mb-4 rounded"
onChange={(e)=>
setForm({
...form,
addressType:e.target.value
})
}
>

<option>Home</option>
<option>Work</option>
<option>Office</option>

</select>

<button
onClick={handleAddAddress}
className="bg-[#bf6f32] text-white px-6 py-2 rounded"
>
{editId ? "Update Address" : "Save Address"}
</button>

          </div>

        )}

      </div>

      {/* RIGHT SIDE */}

      <div className="space-y-6 lg:sticky lg:top-24 h-fit">

        <div className="bg-white dark:bg-[#1e1e1e] border dark:border-gray-700 rounded-xl p-6">

          <h3 className="text-lg font-semibold mb-4">
            Price Details
          </h3>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span>Items Total</span>
              <span>₹ {totalPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>₹0</span>
            </div>

          </div>

          <div className="border-t dark:border-gray-700 mt-4 pt-4 flex justify-between font-semibold text-lg">

            <span>Total</span>
            <span>₹ {totalPrice + 0}</span>

          </div>

        </div>

        <button
          onClick={handlePayment}
          disabled={!selectedAddress}
          className={`w-full py-3 rounded-full text-white font-semibold ${
            selectedAddress
              ? "bg-[#bf6f32]"
              : "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
          }`}
        >
          Proceed to Pay
        </button>

      </div>

    </div>

  );

};

export default CheckoutAddress;