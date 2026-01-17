import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const avatars = [
    "/avatars/male1.jpg",
    "/avatars/male2.jpg",
    "/avatars/male3.jpg",
    "/avatars/male4.jpg",
    "/avatars/male5.jpg",
    "/avatars/female1.avif",
    "/avatars/female2.avif",
    "/avatars/female3.avif",
    "/avatars/female4.jpg",
    "/avatars/female5.webp",
  ];

  /* ---------------- FETCH PROFILE ---------------- */
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setName(data.name || "");
      setBio(data.bio || "");
      setAvatar(data.avatar || "");
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------------- SAVE PROFILE ---------------- */
  const saveProfile = async () => {
    if (saving) return;

    setSaving(true);

    try {
      await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          avatar,
        }),
      });

      // show success animation
      setSuccess(true);

      // redirect after animation
      setTimeout(() => {
        navigate("/profile");
      }, 1800);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500 dark:text-zinc-400">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950 px-4">
      {/* SUCCESS TOAST */}
      {success && (
        <div className="fixed bottom-6 right-6 z-50 animate-toast">
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
            <span className="text-lg">✅</span>
            <span className="font-medium">Profile updated successfully</span>
          </div>
        </div>
      )}

      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl
        bg-white dark:bg-zinc-900
        border border-gray-200 dark:border-zinc-800
        p-6 transition ${
          success ? "opacity-80 scale-[0.98]" : ""
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          Edit Profile
        </h2>

        {/* NAME */}
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-zinc-300">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl px-4 py-2 mb-4
            bg-white dark:bg-zinc-800
            text-gray-900 dark:text-white
            border border-gray-300 dark:border-zinc-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* BIO */}
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-zinc-300">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full rounded-xl px-4 py-2 mb-6
            bg-white dark:bg-zinc-800
            text-gray-900 dark:text-white
            border border-gray-300 dark:border-zinc-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* AVATAR PICKER */}
        <p className="text-sm font-medium mb-3 text-gray-700 dark:text-zinc-300">
          Choose Avatar
        </p>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {avatars.map((img) => (
            <img
              key={img}
              src={img}
              alt="avatar"
              onClick={() => setAvatar(img)}
              className={`w-14 h-14 rounded-full cursor-pointer transition
                border-2
                ${
                  avatar === img
                    ? "border-indigo-500 ring-2 ring-indigo-500"
                    : "border-transparent hover:border-indigo-400"
                }`}
            />
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/profile")}
            disabled={saving}
            className="px-4 py-2 rounded-xl
              bg-gray-100 dark:bg-zinc-800
              text-gray-700 dark:text-zinc-300
              border border-gray-300 dark:border-zinc-700
              hover:bg-gray-200 dark:hover:bg-zinc-700
              transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-5 py-2 rounded-xl
              bg-indigo-600 hover:bg-indigo-500
              text-white font-medium transition
              disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* TOAST ANIMATION */}
      <style>
        {`
          @keyframes toast {
            0% { opacity: 0; transform: translateY(20px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-toast {
            animation: toast 0.4s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default EditProfile;
