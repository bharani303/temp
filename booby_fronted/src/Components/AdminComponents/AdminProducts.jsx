import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [form, setForm] = useState({
    name: "", price: "", category: "", image: "",
    thumb1: "", thumb2: "", thumb3: "",
    description: "", features: "", inBox: "", dimensions: ""
  });

  useEffect(() => {
    fetch("https://booby-backend.onrender.com/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const newProduct = {
      name: form.name,
      price: form.price ? Number(form.price) : 0,
      category: form.category,
      image: form.image,
      images: [form.image, form.thumb1, form.thumb2, form.thumb3].filter(Boolean),
      description: form.description,
      features: form.features ? form.features.split(",").map(f => f.trim()) : [],
      inBox: form.inBox ? form.inBox.split(",").map(i => i.trim()) : [],
      dimensions: form.dimensions
    };

    if (editProduct) {
      const updatedProduct = { ...editProduct, ...newProduct };
      const res = await fetch(`https://booby-backend.onrender.com/products/${editProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
      });
      const savedProduct = await res.json();
      setProducts(prev => prev.map(p => p.id === editProduct.id ? savedProduct : p));
    } else {
      const res = await fetch("https://booby-backend.onrender.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
      const savedProduct = await res.json();
      setProducts(prev => [...prev, savedProduct]);
    }
    setShowForm(false);
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    await fetch(`https://booby-backend.onrender.com/products/${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      thumb1: product.images?.[1] || "",
      thumb2: product.images?.[2] || "",
      thumb3: product.images?.[3] || "",
      description: product.description,
      features: product.features?.join(","),
      inBox: product.inBox?.join(","),
      dimensions: product.dimensions
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? product.category.toLowerCase() === filter.toLowerCase() : true;
    return matchesSearch && matchesFilter;
  });

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  return (
    <div className="p-1 pb-20 md:pb-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold dark:text-black">Products</h1>
          <p className="text-sm text-gray-500">Manage your furniture inventory</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditProduct(null); }}
          className="flex items-center gap-2 bg-[#bf6f32] text-white px-3 py-1.5 rounded-lg text-sm"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border bg-white dark:bg-[#1c1c1c] text-sm focus:outline-none"
        />
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border bg-white dark:bg-[#1c1c1c] text-sm"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-[#1c1c1c] overflow-x-auto rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
            <tr>
              <th className="p-2 text-left">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-t hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition">
                <td className="p-1">
                  {product.image
                    ? <img src={product.image} className="w-10 h-10 object-cover rounded-[20%]" />
                    : <div className="w-10 h-10 bg-gray-300 rounded-[20%]" />}
                </td>
                <td className="text-[12px] font-medium">{product.name}</td>
                <td className="text-[12px] text-gray-500">{product.category}</td>
                <td className="text-[13px] font-medium">₹ {product.price}</td>
                <td className="flex gap-3 p-3">
                  <button onClick={() => handleEdit(product)}>
                    <Pencil className="text-blue-500" size={15} />
                  </button>
                  <button onClick={() => handleDelete(product.id)}>
                    <Trash2 className="text-red-500" size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white dark:bg-[#1c1c1c] rounded-xl shadow p-3 flex items-center gap-3">
            {product.image
              ? <img src={product.image} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
              : <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{product.name}</p>
              <p className="text-xs text-gray-500">{product.category}</p>
              <p className="text-sm font-medium text-[#bf6f32]">₹ {product.price}</p>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <button onClick={() => handleEdit(product)}>
                <Pencil className="text-blue-500" size={16} />
              </button>
              <button onClick={() => handleDelete(product.id)}>
                <Trash2 className="text-red-500" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-[#1c1c1c] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-5">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">
                {editProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-black text-lg">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <input
                name="name" placeholder="Product Name" value={form.name} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 col-span-1 md:col-span-2 rounded-xl bg-white dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#bf6f32]"
              />
              <input
                name="price" placeholder="Price" value={form.price} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-xl bg-white dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#bf6f32]"
              />
              <select
                name="category" value={form.category} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-xl bg-white dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#bf6f32]"
              >
                <option value="">Select Category</option>
                <option value="Beds">Beds</option>
                <option value="Sofa">Sofa</option>
                <option value="Chairs">Chairs</option>
                <option value="Tables">Tables</option>
                <option value="Dining Table">Dining Table</option>
                <option value="Wardrobe">Wardrobe</option>
                <option value="TV Unit">TV Unit</option>
                <option value="Bookshelf">Bookshelf</option>
                <option value="Office Chair">Office Chair</option>
                <option value="Office Table">Office Table</option>
                <option value="Mattress">Mattress</option>
                <option value="Recliners">Recliners</option>
              </select>
            </div>

            <div className="mb-5">
              <p className="text-sm font-medium mb-2">Main Image</p>
              <div className="flex gap-4 items-center flex-wrap">
                {form.image && (
                  <img src={form.image} className="w-16 h-16 object-cover rounded-lg border flex-shrink-0" />
                )}
                <input
                  type="text" name="image" placeholder="Paste Image URL" value={form.image} onChange={handleChange}
                  className="flex-1 min-w-0 border px-4 py-2 rounded-xl text-sm"
                />
              </div>
            </div>

            <p className="text-sm font-medium mb-2">Thumbnail Images</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {["thumb1", "thumb2", "thumb3"].map((field, index) => (
                <div key={field} className="flex flex-col gap-2">
                  {form[field] && (
                    <img src={form[field]} className="w-full h-16 object-cover rounded-lg border" />
                  )}
                  <input
                    type="text" name={field} placeholder={`Thumb ${index + 1} URL`}
                    value={form[field]} onChange={handleChange}
                    className="text-xs border p-1.5 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <textarea
              name="description" placeholder="Description" value={form.description} onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl bg-white dark:bg-[#2a2a2a] text-sm h-24 focus:outline-none focus:ring-2 focus:ring-[#bf6f32] mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="features" placeholder="Features (comma separated)" value={form.features} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-xl bg-white dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#bf6f32] col-span-1 md:col-span-2"
              />
              <input
                name="inBox" placeholder="In Box (comma separated)" value={form.inBox} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-xl bg-white dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#bf6f32]"
              />
              <input
                name="dimensions" placeholder="Dimensions" value={form.dimensions} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-xl bg-white dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#bf6f32]"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={handleSubmit} className="bg-[#bf6f32] text-white px-5 py-2 rounded-lg shadow hover:opacity-90">
                Save Product
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
