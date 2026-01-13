import { useEffect, useState } from "react";
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

  if (loading)
    return (
      <p className="p-6 text-gray-600 dark:text-zinc-400">Loading profile...</p>
    );
  if (!profile)
    return (
      <p className="p-6 text-red-500">Failed to load profile</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white p-6">

      <div className="max-w-5xl mx-auto">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-6 text-center shadow-xl">
          <img
            src={profile.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-indigo-500"
          />

          <h2 className="text-2xl font-semibold mt-3">{profile.name}</h2>
          <p className="text-gray-500 dark:text-zinc-400">{profile.email}</p>

          <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
            {profile.bio || "No bio added yet."}
          </p>

          {/* Rank & Score */}
          <div className="mt-4">
            <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {profile.rank}
            </span>
            <p className="text-sm mt-1 text-gray-500 dark:text-zinc-400">
              Learning Score: {profile.learningScore}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div className="bg-white/60 dark:bg-zinc-800 rounded-xl p-3">
              <p className="font-bold text-lg">{profile.progress.chats}</p>
              <p className="text-gray-500 dark:text-zinc-400">Chats</p>
            </div>
            <div className="bg-white/60 dark:bg-zinc-800 rounded-xl p-3">
              <p className="font-bold text-lg">{profile.progress.debates}</p>
              <p className="text-gray-500 dark:text-zinc-400">Debates</p>
            </div>
            <div className="bg-white/60 dark:bg-zinc-800 rounded-xl p-3">
              <p className="font-bold text-lg">{profile.progress.scenarios}</p>
              <p className="text-gray-500 dark:text-zinc-400">Scenarios</p>
            </div>
          </div>
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {/* Bar Chart */}
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              Activity Overview
            </h3>
            <div className="w-full h-[300px]">
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

          {/* Radar Chart */}
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              Skill Balance
            </h3>
            <div className="w-full h-[300px]">
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

export default UserProfile;
