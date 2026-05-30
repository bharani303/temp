import { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [stats, setStats] = useState({
    total: 0, active: 0, blocked: 0, revenue: 0, avg: 0
  });

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => {
        const customers = data.filter(user => user.role !== "admin");
        setUsers(customers);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (users.length) calculateStats(users);
  }, [users]);

  const toggleBlock = async (user) => {
    const updated = { ...user, isBlocked: !user.isBlocked };
    await fetch(`http://localhost:5000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch("http://localhost:5000/orders");
      const orders = await res.json();
      const userOrders = orders.filter(o => o.userId === userId);
      await Promise.all(
        userOrders.map(order =>
          fetch(`http://localhost:5000/orders/${order.id}`, { method: "DELETE" })
        )
      );
      await fetch(`http://localhost:5000/users/${userId}`, { method: "DELETE" });
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading users...</p>;

  const calculateStats = (data) => {
    let total = data.length, active = 0, blocked = 0, revenue = 0;
    data.forEach(u => {
      if (u.isBlocked) blocked++;
      else active++;
      revenue += u.totalSpent || 0;
    });
    setStats({ total, active, blocked, revenue, avg: total ? Math.floor(revenue / total) : 0 });
  };

  const filteredUsers = users.filter(user => {
    const name = (user.name || user.email || "").toLowerCase();
    return (
      name.includes(search.toLowerCase()) &&
      (statusFilter === "all" ||
        (statusFilter === "active" && !user.isBlocked) ||
        (statusFilter === "blocked" && user.isBlocked))
    );
  });

  return (
    <div className="p-1 pb-20 md:pb-4">

      {/* HEADER */}
      <div className="flex flex-col mb-6">
       <h2 className="text-2xl font-bold text-gray-800 dark:text-black">Customers</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your customer relationships</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total Customers", value: stats.total, color: "text-black" },
          { label: "Active", value: stats.active, color: "text-green-600" },
          { label: "Blocked", value: stats.blocked, color: "text-red-500" },
          { label: "Total Revenue", value: `₹${stats.revenue}`, color: "text-purple-600" },
          { label: "Avg Order Value", value: `₹${stats.avg}`, color: "text-orange-500" },
        ].map((s, i) => (
          <div className="p-4 rounded-2xl shadow-sm bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700">
  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
  <h2 className={`text-base font-semibold ${s.color} dark:text-white`}>
    {s.value}
  </h2>
</div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3 mb-5 w-full">
       <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-full 
  bg-white dark:bg-[#1f2937] 
  border border-gray-200 dark:border-gray-700 
  focus-within:ring-2 focus-within:ring-blue-500 transition">
          <input
            type="text"
            placeholder="Search by name, email..."
            className="outline-none text-sm w-full bg-transparent"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="border px-3 py-2 rounded-xl shadow-sm dark:bg-black">
          <select
            className="outline-none text-sm bg-transparent dark:bg-black"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-[#1c1c1c] rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Join Date</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Spent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="bg-white dark:bg-[#1c1c1c] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]">
                <td className="p-3 flex items-center gap-3">
                  {user.image
                    ? <img src={user.image} className="w-8 h-8 rounded-full" />
                    : <div className="w-8 h-8 bg-gray-300 rounded-full" />}
                  <span>{user.name || user.email}</span>
                </td>
                <td className="p-3">{user.email || "N/A"}</td>
                <td className="p-3">{user.phone || "N/A"}</td>
                <td className="p-3">{user.createdAt || "N/A"}</td>
                <td className="p-3">{user.orders?.length || 0}</td>
                <td className="p-3">₹ {user.totalSpent || 0}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.isBlocked ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => toggleBlock(user)} className="text-yellow-500 text-xs">
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => { setSelectedUser(user.id); setShowModal(true); }}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow p-4">

            {/* TOP ROW */}
            <div className="flex items-center gap-3 mb-3">
              {user.image
                ? <img src={user.image} className="w-10 h-10 rounded-full flex-shrink-0" />
                : <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 text-sm font-semibold">
                    {(user.name || user.email || "?")[0].toUpperCase()}
                  </div>}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.name || user.email}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
             <span className={`px-2 py-1 rounded-full text-xs font-medium
  ${user.isBlocked 
    ? "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
    : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
}`}>
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{user.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400">Orders</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">{user.orders?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">Spent</p>
                <p className="font-medium text-gray-700 dark:text-gray-200">₹{user.totalSpent || 0}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 border-t pt-3">
              <button
                onClick={() => toggleBlock(user)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border
                  ${user.isBlocked
                    ? "border-green-300 text-green-600"
                    : "border-yellow-300 text-yellow-600"}`}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
              <button
                onClick={() => { setSelectedUser(user.id); setShowModal(true); }}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-red-300 text-red-500"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-[300px] text-center">
            <h2 className="text-lg font-semibold mb-3">Delete User?</h2>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(selectedUser);
                  setShowModal(false);
                  import("react-hot-toast").then(({ default: toast }) =>
                    toast.success("User deleted permanently")
                  );
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;