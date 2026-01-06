import { useEffect, useState } from "react";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profile) return <p className="p-6">Failed to load profile</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white shadow rounded p-6 text-center">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 mx-auto rounded-full object-cover"
        />

        <h2 className="text-xl font-semibold mt-3">{profile.name}</h2>
        <p className="text-gray-500">{profile.email}</p>

        <p className="mt-3 text-sm text-gray-600">
          {profile.bio || "No bio added yet."}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div>
            <p className="font-semibold">{profile.progress.chats}</p>
            <p>Chats</p>
          </div>
          <div>
            <p className="font-semibold">{profile.progress.debates}</p>
            <p>Debates</p>
          </div>
          <div>
            <p className="font-semibold">{profile.progress.scenarios}</p>
            <p>Scenarios</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
