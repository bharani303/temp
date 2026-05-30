import { useEffect, useState } from "react";
import { Search, Filter, Eye } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, usersRes] = await Promise.all([
        fetch("http://localhost:5000/orders"),
        fetch("http://localhost:5000/users"),
      ]);
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();
      const customers = usersData.filter(u => u.role !== "admin");
      setOrders(ordersData);
      setUsers(customers);
    };
    fetchData();
  }, []);

  useEffect(() => {
    calculateStats(orders);
  }, [orders]);

  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user?.name || user?.email || "Deleted User";
  };

  const getProductNames = (items) => {
    if (!items || items.length === 0) return "—";
    if (items.length === 1) return `${items[0].name} (Qty: ${items[0].quantity})`;
    return `${items[0].name} +${items.length - 1} more`;
  };

  const filteredOrders = orders.filter(order => {
    const name = getUserName(order.userId).toLowerCase();
    const product = getProductNames(order.items).toLowerCase();
    return (
      (name.includes(search.toLowerCase()) || product.includes(search.toLowerCase())) &&
      (statusFilter === "all" || order.status === statusFilter)
    );
  });

  const calculateStats = (ordersData) => {
    const s = { total: ordersData.length, pending: 0, processing: 0, shipped: 0, delivered: 0 };
    ordersData.forEach((order) => {
      if (order.status === "pending") s.pending++;
      if (order.status === "processing") s.processing++;
      if (order.status === "shipped") s.shipped++;
      if (order.status === "delivered") s.delivered++;
    });
    setStats(s);
  };

  const updateStatus = async (order, newStatus) => {
    const updated = { ...order, status: newStatus };
    await fetch(`http://localhost:5000/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setOrders(prev => {
      const updatedOrders = prev.map(o => o.id === order.id ? updated : o);
      calculateStats(updatedOrders);
      return updatedOrders;
    });
  };

  const statusStyle = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-600";
      case "shipped": return "bg-blue-100 text-blue-600";
      case "processing": return "bg-yellow-100 text-yellow-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-1 pb-20 md:pb-4">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-black">Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track customer orders</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 ">
        {[
          { label: "Total Orders", value: stats.total, color: "" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
          { label: "Processing", value: stats.processing, color: "text-orange-500" },
          { label: "Shipped", value: stats.shipped, color: "text-blue-600" },
          { label: "Delivered", value: stats.delivered, color: "text-green-600" },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-white to-gray-100 dark:from-[#1c1c1c] dark:to-[#2a2a2a] 
            p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-[#333] hover:scale-[1.03] transition duration-200"
          >
            <p className="text-xs text-gray-500 dark:text-white">{s.label}</p>
            <h2 className={`text-lg font-semibold ${s.color}`}>{s.value}</h2>
          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3 mb-5 w-full ">
        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg w-full dark:text-white dark:bg-black">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer / product..."
            className="outline-none text-sm w-full bg-transparent"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg min-w-[130px] dark:text-white dark:bg-black">
          <Filter size={16} />
          <select
            className="outline-none text-sm w-full bg-transparent dark:text-white dark:bg-black"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-[#1c1c1c] rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="bg-white dark:bg-[#1c1c1c] hover:bg-gray-100">
                <td className="p-3 font-medium">{order.orderId}</td>
                <td className="p-3">{getUserName(order.userId)}</td>
                <td className="p-3 text-gray-500">{new Date(order.date).toLocaleDateString("en-IN")}</td>
                <td className="p-3">{order.items?.length}</td>
                <td className="p-3 font-medium">₹ {order.total}</td>
                <td className="p-3">{order.payment || "UPI"}</td>
                <td className="p-3">
                  <select
                    value={order.status || "pending"}
                    onChange={(e) => updateStatus(order, e.target.value)}
                    className={`text-xs px-3 py-1 rounded-full border ${statusStyle(order.status)} bg-gray-50 dark:bg-[#2a2a2a]`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 text-blue-500 text-xs"
                  >
                    <Eye size={15} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm">{getUserName(order.userId)}</p>
                <p className="text-xs text-gray-500">{order.orderId}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusStyle(order.status)}`}>
                {order.status || "pending"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
              <div>
                <p className="text-gray-400">Date</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">
                  {new Date(order.date).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Total</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">₹ {order.total}</p>
              </div>
              <div>
                <p className="text-gray-400">Items</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{order.items?.length}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <select
                value={order.status || "pending"}
                onChange={(e) => updateStatus(order, e.target.value)}
                className="text-xs px-2 py-1.5 rounded-lg border bg-gray-50 dark:bg-[#2a2a2a] flex-1"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-1 text-blue-500 text-xs border border-blue-200 px-3 py-1.5 rounded-lg"
              >
                <Eye size={13} /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No orders found</p>
      )}

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-[#1c1c1c] p-5 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>

            <div className="space-y-2 text-sm mb-4">
              <p><b>Order ID:</b> {selectedOrder.orderId}</p>
              <p><b>User:</b> {getUserName(selectedOrder.userId)}</p>
              <p><b>Email:</b> {selectedOrder.userEmail}</p>
              <p><b>Date:</b> {new Date(selectedOrder.date).toLocaleString()}</p>
              <p><b>Payment:</b> {selectedOrder.payment}</p>
              <p><b>Status:</b> {selectedOrder.status}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Shipping Address</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>{selectedOrder.address?.name}</p>
                <p>{selectedOrder.address?.address}</p>
                <p>{selectedOrder.address?.location}</p>
                <p>{selectedOrder.address?.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items</h3>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center border p-3 rounded-lg mb-2">
                  <img src={item.image} className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹ {item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 font-semibold text-lg">Total: ₹ {selectedOrder.total}</div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-5 bg-black text-white px-5 py-2 rounded-lg w-full md:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;