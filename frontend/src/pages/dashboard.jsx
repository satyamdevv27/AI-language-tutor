import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  /* ---------------- AUTH ---------------- */
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user && token);

  /* ---------------- DARK MODE ---------------- */
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="border-b border-black/10 dark:border-white/10 backdrop-blur-xl bg-white/60 dark:bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            AI Language Tutor
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="px-4 py-2 rounded-full text-sm border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Signup
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="px-4 py-2 rounded-full text-sm border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition"
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className={`flex-1 max-w-7xl mx-auto px-6 py-16 w-full ${!isLoggedIn ? "flex flex-col justify-center" : ""}`}>

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Learn English with AI
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Practice real conversations, improve fluency, and gain confidence with AI-powered speaking tools.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Chat */}
          <Link
            to={isLoggedIn ? "/chat" : "/login"}
            className="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/5 dark:border-white/5 p-6 hover:-translate-y-2 transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.4)]"
          >
            <div className="h-48 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-6 flex items-center justify-center text-indigo-500 dark:text-indigo-300 text-4xl">
              💬
            </div>
            <h3 className="text-xl font-semibold mb-2">Chat with AI</h3>
            <p className="text-gray-600 dark:text-zinc-400 text-sm">Have natural conversations with your AI tutor.</p>
          </Link>

          {/* Voice */}
          <Link
            to={isLoggedIn ? "/voicelearn" : "/login"}
            className="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/5 dark:border-white/5 p-6 hover:-translate-y-2 transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.4)]"
          >
            <div className="h-48 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6 flex items-center justify-center text-purple-500 dark:text-purple-300 text-4xl">
              🎤
            </div>
            <h3 className="text-xl font-semibold mb-2">Voice Learning</h3>
            <p className="text-gray-600 dark:text-zinc-400 text-sm">Improve pronunciation and speaking skills.</p>
          </Link>

          {/* Debate */}
          <Link
            to={isLoggedIn ? "/debate" : "/login"}
            className="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/5 dark:border-white/5 p-6 hover:-translate-y-2 transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.4)]"
          >
            <div className="h-48 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-6 flex items-center justify-center text-blue-500 dark:text-blue-300 text-4xl">
              ⚔️
            </div>
            <h3 className="text-xl font-semibold mb-2">Debate Mode</h3>
            <p className="text-gray-600 dark:text-zinc-400 text-sm">Sharpen thinking with AI-powered debates.</p>
          </Link>

          {/* Scenario */}
          <Link
            to={isLoggedIn ? "/secnarioroom" : "/login"}
            className="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/5 dark:border-white/5 p-6 hover:-translate-y-2 transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.4)]"
          >
            <div className="h-48 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-6 flex items-center justify-center text-emerald-500 dark:text-emerald-300 text-4xl">
              🌍
            </div>
            <h3 className="text-xl font-semibold mb-2">Scenario Practice</h3>
            <p className="text-gray-600 dark:text-zinc-400 text-sm">Practice real-life English situations.</p>
          </Link>

        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500 dark:text-zinc-500">
          © {new Date().getFullYear()} AI Language Tutor
        </div>
      </footer>
    </div>
  );
};

export default Home;
