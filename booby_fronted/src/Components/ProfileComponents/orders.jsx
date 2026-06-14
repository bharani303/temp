import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReviewModal from "../ReviewModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);

  //  FETCH ORDERS 
  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch("https://booby-backend.onrender.com/orders", {
        headers: {
          "Authorization": user?.token ? `Bearer ${user.token}` : ""
        }
      });
      const data = await res.json();

      const userOrders = data.filter(
        (order) => order.userId === user?.id
      );

      setOrders(userOrders);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const shouldPrompt = localStorage.getItem("reviewPrompt");
    if (shouldPrompt === "true") {
      const timer = setTimeout(() => {
        setShowReviewModal(true);
        localStorage.removeItem("reviewPrompt");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  //  DELETE ORDER (backend)
  const handleDeleteOrder = async (orderId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    await fetch(`https://booby-backend.onrender.com/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        "Authorization": user?.token ? `Bearer ${user.token}` : ""
      }
    });

    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    toast.success("Order deleted successfully");
  };

  //DELIVERY TIME (EXACT +24 HOURS)
  const getDeliveryTime = (date) => {
    const orderTime = new Date(date);

    const deliveryTime = new Date(
      orderTime.getTime() + 24 * 60 * 60 * 1000
    );

    return deliveryTime.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  //  ORDER TIME
  const formatOrderTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  //  EMPTY STATE
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">

        <h2 className="text-2xl font-semibold mb-4">
          No Orders Yet 😔
        </h2>

        <p className="text-gray-500 mb-6 text-sm">
          Looks like you haven't ordered anything yet
        </p>

        <button
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
          className="bg-[#bf6f32] text-white px-6 py-2.5 rounded-full 
          text-sm font-medium hover:bg-[#a95c27] transition duration-300"
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-10">

      <h2 className="text-3xl font-bold mb-6">
        Your Orders
      </h2>

      {orders.map((order) => (

        <div
          key={order.id}
          className="border rounded-xl p-5 mb-6 shadow-sm bg-white dark:bg-[#1c1c1c]"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">

            {/* LEFT SIDE CONTENT */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Ordered on: {formatOrderTime(order.date)}
              </p>

              <p className="text-sm text-green-600 mb-2">
                Expected Delivery: Within 24 hours (by {getDeliveryTime(order.date)})
              </p>

              <p className="font-semibold mb-3">
                Total Paid: ₹{order.total}
              </p>

              <div className="text-sm mb-2 text-gray-600 dark:text-gray-300">
                <p><b>Address:</b> {order.address?.address}</p>
                <p><b>Phone:</b> {order.address?.phone}</p>
              </div>
            </div>

            {/* 👉 RIGHT SIDE BUTTON */}
            <button
              onClick={() => {
                setSelectedOrderId(order.id);
                setShowConfirm(true);
              }}
              className=" w-full sm:w-auto
              mt-3 mb-2 sm:mt-0 
              bg-red-500 text-white px-4 py-2.5
              rounded-md text-sm
              hover:bg-red-600 transition duration-300
            ">
              Delete Order
            </button>

          </div>
          {showConfirm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

              <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm">
                <h2 className="text-lg font-semibold mb-3">
                  Delete Order?
                </h2>

                <p className="text-sm text-gray-500 mb-5">
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 text-sm bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      handleDeleteOrder(selectedOrderId);
                      setShowConfirm(false);
                    }}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>

              </div>

            </div>
          )}
          {/* 🛒 ITEMS */}
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 border-t py-3"
            >

              {/* LEFT */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  navigate(`/ProductDetails/${item.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg border"
                />

                <div>
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <span className="text-sm font-medium">
                ₹ {item.price * item.quantity}
              </span>

            </div>
          ))}

        </div>
      ))}

      {/*  BOTTOM CTA */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
          className="bg-[#bf6f32] text-white px-8 py-3 rounded-full 
          text-sm font-medium hover:bg-[#a95c27] transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
      {showReviewModal && (
        <ReviewModal onClose={() => setShowReviewModal(false)} />
      )}
    </div>
  );
};

export default Orders;
