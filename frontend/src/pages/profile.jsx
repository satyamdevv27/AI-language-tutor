import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

function Userprofile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading)
    return <p className="p-6 text-gray-400">Loading profile...</p>;

  if (!profile)
    return <p className="p-6 text-red-500">Failed to load profile</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-4 sm:p-6">

      <div className="max-w-5xl mx-auto">

        {/* ================= PROFILE CARD ================= */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">

          {/* 🔹 TOP LEFT BUTTONS */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => navigate("/home")}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Home
            </button>

            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>

          {/* 🔹 TOP RIGHT BUTTON */}
          <button
            onClick={() => navigate("/profile/edit")}
            className="absolute top-4 right-4 px-3 py-1.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Edit Profile
          </button>

          {/* PROFILE CONTENT */}
          <div className="flex flex-col items-center text-center pt-14 sm:pt-10">
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-500"
            />

            <h2 className="text-2xl font-semibold mt-3">{profile.name}</h2>
            <p className="text-sm text-zinc-400">{profile.email}</p>

            <p className="mt-2 text-sm text-zinc-400">
              {profile.bio || "No bio added yet"}
            </p>

            <div className="mt-4">
              <span className="inline-block bg-indigo-600 px-4 py-1 rounded-full text-sm font-semibold">
                {profile.rank}
              </span>
              <p className="text-sm text-zinc-400 mt-1">
                Learning Score: {profile.learningScore}
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-md">
              {[
                ["Chats", profile.progress.chats],
                ["Debates", profile.progress.debates],
                ["Scenarios", profile.progress.scenarios],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-white/5 rounded-xl py-3"
                >
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-xs text-zinc-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Activity Overview</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profile.chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Skill Balance</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={profile.chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Userprofile;
