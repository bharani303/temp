import { useEffect, useState } from "react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", image: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/users/bfa6")
      .then(res => res.json())
      .then(data => {
        setAdmin(data);
        setForm(data);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const updatedData = { ...admin, ...form };
    const res = await fetch(`http://localhost:5000/users/bfa6`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    const savedUser = await res.json();
    setAdmin(savedUser);
    setForm(savedUser);
    localStorage.setItem("user", JSON.stringify(savedUser));
    window.dispatchEvent(new Event("userUpdated"));
    setEditMode(false);
  };

  if (!admin) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 pb-24 md:pb-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-[#1c1c1c] p-5 rounded-2xl shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Admin Profile</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-[#bf6f32] text-white px-4 py-2 rounded-lg text-sm"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* IMAGE */}
        <div className="flex flex-col items-center gap-3 mb-6">
          {form.image ? (
            <img src={form.image} alt="profile" className="w-24 h-24 rounded-full object-cover border" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
              {(form.name || form.email || "A")[0].toUpperCase()}
            </div>
          )}
          {editMode && (
            <label className="text-sm text-[#bf6f32] cursor-pointer border border-[#bf6f32] px-3 py-1.5 rounded-lg">
              Upload Photo
              <input type="file" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Name</label>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              disabled={!editMode}
              className="border px-3 py-2 rounded-lg text-sm disabled:bg-gray-50 dark:disabled:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#bf6f32]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Email</label>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={!editMode}
              className="border px-3 py-2 rounded-lg text-sm disabled:bg-gray-50 dark:disabled:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#bf6f32]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Phone</label>
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editMode}
              className="border px-3 py-2 rounded-lg text-sm disabled:bg-gray-50 dark:disabled:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#bf6f32]"
            />
          </div>

        </div>

        {/* SAVE BUTTON */}
        {editMode && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-5 py-2 rounded-lg w-full md:w-auto"
            >
              Save Changes
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProfile;