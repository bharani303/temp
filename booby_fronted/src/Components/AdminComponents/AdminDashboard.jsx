import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCircle,
  Menu,
  X
} from "lucide-react";

import {
  IndianRupee,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../pages/services/dashboardService";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/admin";
  const isAdminRoot = location.pathname === "/admin";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    products: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };
    loadStats();
  }, []);

  useEffect(() => {
    const updateStats = () => {
      setStats(getDashboardStats());
    };
    window.addEventListener("ordersUpdated", updateStats);
    return () => window.removeEventListener("ordersUpdated", updateStats);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, usersRes] = await Promise.all([
        fetch("https://booby-backend.onrender.com/orders"),
        fetch("https://booby-backend.onrender.com/users"),
      ]);
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();
      const customers = usersData.filter(u => u.role !== "admin");
      setUsers(customers);
      const customerIds = customers.map(u => u.id);
      const cleanOrders = ordersData.filter(o => customerIds.includes(o.userId));
      const sorted = cleanOrders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentOrders(sorted);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const prepareBarData = async () => {
      const ordersRes = await fetch("https://booby-backend.onrender.com/orders");
      const ordersData = await ordersRes.json();
      const usersRes = await fetch("https://booby-backend.onrender.com/users");
      const usersData = await usersRes.json();
      const customers = usersData.filter(u => u.role !== "admin");
      const customerIds = customers.map(u => u.id);
      const cleanOrders = ordersData.filter(o => customerIds.includes(o.userId));
      const productCount = {};
      cleanOrders.forEach((order) => {
        order.items.forEach((item) => {
          const name = item.name;
          productCount[name] = (productCount[name] || 0) + item.quantity;
        });
      });
      const formatted = Object.keys(productCount).map((key) => ({
        name: key,
        count: productCount[key],
      }));
      setBarData(formatted);
    };
    prepareBarData();
  }, []);

  useEffect(() => {
    const preparePieData = async () => {
      const res = await fetch("https://booby-backend.onrender.com/products");
      const data = await res.json();
      const categoryCount = {};
      data.forEach((product) => {
        const cat = product.category;
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      const formatted = Object.keys(categoryCount).map((key) => ({
        name: key,
        value: categoryCount[key],
      }));
      setPieData(formatted);
    };
    preparePieData();
  }, []);

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || user?.email || "Deleted User";
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
    { to: "/admin/products", label: "Products", icon: <Package size={18} /> },
    { to: "/admin/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { to: "/admin/users", label: "Customers", icon: <Users size={18} /> },
    { to: "/admin/profile", label: "Profile", icon: <UserCircle size={18} /> },
  ];

  const isSubPage = !isAdminRoot;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex  w-63 h-screen sticky top-0 bg-[#1a1a1a] text-white p-4 flex-col justify-between">
        <div>
          <h2 className=" text-xl font-bold mb-8 text-[#bf6f32]">Admin Panel</h2>
          <div className="space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition 
                  ${isActive ? "bg-[#bf6f32] text-white" : "hover:bg-[#2a2a2a] text-gray-300"}`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-6">Admin @ Homie</div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] text-white p-5 z-50 transform transition-transform duration-300 md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-[#bf6f32]">Admin Panel</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-gray-300" />
          </button>
        </div>
        <div className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition 
                ${isActive ? "bg-[#bf6f32] text-white" : "hover:bg-[#2a2a2a] text-gray-300"}`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-6">Admin @ Homie</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* MOBILE TOP BAR */}
        <div className="md:hidden flex items-center gap-3 bg-[#1a1a1a] px-4 py-3 sticky top-0 z-30">
          {isSubPage ? (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-300 flex items-center gap-2 text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-gray-300" />
            </button>
          )}
          <h2 className="text-white font-semibold text-sm ml-1">Admin Panel</h2>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-4 md:p-6 pb-6">

          {isHome && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-black">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Welcome back! Here's what's happening today.
                </p>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-white dark:bg-[#1c1c1c] p-4 rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                    <h2 className="text-lg font-bold mt-1">₹ {stats.revenue.toLocaleString("en-IN")}</h2>
                  </div>
                  <div className="bg-[#bf6f32]/10 p-2 rounded-xl">
                    <IndianRupee className="text-[#bf6f32]" size={18} />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1c1c1c] p-4 rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Orders</p>
                    <h2 className="text-lg font-bold mt-1">{stats.orders}</h2>
                  </div>
                  <div className="bg-blue-500/10 p-2 rounded-xl">
                    <ShoppingCart className="text-blue-500" size={18} />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1c1c1c] p-4 rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Customers</p>
                    <h2 className="text-lg font-bold mt-1">{stats.users}</h2>
                  </div>
                  <div className="bg-green-500/10 p-2 rounded-xl">
                    <Users className="text-green-500" size={18} />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1c1c1c] p-4 rounded-2xl shadow hover:shadow-lg transition flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Products</p>
                    <h2 className="text-lg font-bold mt-1">{stats.products}</h2>
                  </div>
                  <div className="bg-purple-500/10 p-2 rounded-xl">
                    <Package className="text-purple-500" size={18} />
                  </div>
                </div>

              </div>

              {/* CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-[1.9fr_1.1fr] gap-6 mt-8">

                <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl shadow hover:shadow-lg transition">
                  <h2 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-200">Sales Overview</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl shadow hover:shadow-lg transition">
                  <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        outerRadius={65}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

              </div>

              {/* RECENT ORDERS */}
              <div className="mt-6 bg-white dark:bg-[#1c1c1c] p-4 rounded-2xl shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                  <span className="text-sm text-gray-500">Last 5 orders</span>
                </div>

                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent orders</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const firstItem = order.items?.[0];
                      return (
                        <div
                          key={order.id}
                          className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
                        >
                          <div>
                            <p className="font-medium text-sm">{getUserName(order.userId)}</p>
                            <p className="text-xs text-gray-500">
                              {firstItem?.category || "General"} •{" "}
                              {new Date(order.date).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">₹ {order.total}</p>
                            <p className="text-xs text-gray-500">{order.items?.length} items</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          <Outlet />
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] flex justify-around py-2 z-30">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition
                ${isActive ? "text-[#bf6f32]" : "text-gray-400"}`
              }
            >
              {link.icon}
              <span className="text-[9px]">{link.label}</span>
            </NavLink>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
