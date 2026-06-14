import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    image: ""
  });

  const localUser = JSON.parse(localStorage.getItem("user"));

  //  LOAD USER
  useEffect(() => {
    if (!localUser?.id) return;

    fetch(`https://booby-backend.onrender.com/users/${localUser.id}`, {
      headers: {
        "Authorization": localUser?.token ? `Bearer ${localUser.token}` : ""
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          image: data.image || ""
        });
      })
      .catch(() => {
        toast.error("Failed to load profile ❌");
      });
  }, []);

  //  AUTO SAVE (ONLY TEXT, NOT IMAGE)
  useEffect(() => {
    if (!editMode || !user?.id) return;

    const timeout = setTimeout(async () => {
      try {
        setIsSaving(true);

        const res = await fetch(
          `https://booby-backend.onrender.com/users/${user.id}`,
          {
            method: "PATCH",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": localUser?.token ? `Bearer ${localUser.token}` : ""
            },
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              phone: form.phone,
            })
          }
        );

        const updatedUser = await res.json();

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

      } catch {
        console.log("Auto save failed");
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => clearTimeout(timeout);

  }, [form.name, form.email, form.phone]);

  //  IMAGE HANDLER (separate save, no race condition)
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100000) {
      toast.error("Image too large (max 200KB)");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const newImage = reader.result;

      // UI update instantly
      setForm(prev => ({ ...prev, image: newImage }));
      setUser(prev => ({ ...prev, image: newImage }));

      try {
        setIsSaving(true);

        const res = await fetch(
          `https://booby-backend.onrender.com/users/${user.id}`,
          {
            method: "PATCH",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": localUser?.token ? `Bearer ${localUser.token}` : ""
            },
            body: JSON.stringify({ image: newImage })
          }
        );

        const updatedUser = await res.json();

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Image updated ✅");

      } catch {
        toast.error("Image update failed ❌");
      } finally {
        setIsSaving(false);
      }
    };

    reader.readAsDataURL(file);
  };

  if (!user) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">

      <h2 className="text-3xl font-bold text-center mb-8">
        My Profile
      </h2>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="h-32 bg-gradient-to-r from-[#bf6f32] to-[#d99156]" />

        <div className="flex flex-col items-center -mt-16 px-6">

          <img
            src={form.image || "https://via.placeholder.com/150"}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            alt="Profile Avatar"
          />

          {editMode && (
            <input
              type="file"
              onChange={handleImage}
              className="mt-3 text-sm p-2 border text-black"
            />
          )}

          <h3 className="mt-3 text-xl font-semibold text-black">
            {form.name || "Your Name"}
          </h3>

          <p className="text-black text-sm">
            {form.email}
          </p>

          {editMode && (
            <p className="text-xs mt-2 text-black">
              {isSaving ? "Saving..." : "All changes saved ✓"}
            </p>
          )}

        </div>

        <div className="grid md:grid-cols-2 gap-4 p-6">

          <div>
            <label className="text-sm text-black">Full Name</label>
            <input
              value={form.name}
              disabled={!editMode}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className={`w-full mt-1 p-2 border rounded-md text-black
              ${editMode ? "bg-white" : "bg-gray-100 opacity-70"}`}
            />
          </div>

          <div>
            <label className="text-sm text-black">Email</label>
            <input
              value={form.email}
              disabled={!editMode}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className={`w-full mt-1 p-2 border rounded-md text-black
              ${editMode ? "bg-white" : "bg-gray-100 opacity-70"}`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-black">Phone</label>
            <input
              value={form.phone}
              disabled={!editMode}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className={`w-full mt-1 p-2 border rounded-md text-black
              ${editMode ? "bg-white" : "bg-gray-100 opacity-70"}`}
            />
          </div>

        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            onClick={async () => {
              if (editMode) {
                try {
                  setIsSaving(true);

                  const res = await fetch(
                    `https://booby-backend.onrender.com/users/${user.id}`,
                    {
                      method: "PATCH",
                      headers: { 
                        "Content-Type": "application/json",
                        "Authorization": localUser?.token ? `Bearer ${localUser.token}` : ""
                      },
                      body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        phone: form.phone
                      })
                    }
                  );

                  const updatedUser = await res.json();

                  setUser(updatedUser);
                  localStorage.setItem("user", JSON.stringify(updatedUser));

                  toast.success("Profile updated 🎉");

                  //for refreshing the page
                  window.location.reload();

                } catch {
                  toast.error("Update failed ❌");
                } finally {
                  setIsSaving(false);
                }
              }

              setEditMode(!editMode);
            }}
            className="bg-[#bf6f32] text-white px-5 py-2 rounded-md hover:scale-105 transition"
          >
            {editMode ? "Done" : "Edit Profile"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
