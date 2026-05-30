export const getDashboardStats = async () => {
  try {
    const [usersRes, ordersRes, productsRes] = await Promise.all([
      fetch("http://localhost:5000/users"),
      fetch("http://localhost:5000/orders"),
      fetch("http://localhost:5000/products"),
    ]);

    const users = await usersRes.json();
    const orders = await ordersRes.json();
    const products = await productsRes.json();

    //REMOVE ADMIN
    const customers = users.filter(u => u.role !== "admin");

    //  OPTIONAL
    const activeUsers = customers.filter(u => !u.isBlocked).length;
    const blockedUsers = customers.filter(u => u.isBlocked).length;

    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      revenue,
      orders: orders.length,
      users: customers.length,   //  FIXED
      products: products.length,

      
      activeUsers,
      blockedUsers
    };

  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return {
      revenue: 0,
      orders: 0,
      users: 0,
      products: 0,
    };
  }
};