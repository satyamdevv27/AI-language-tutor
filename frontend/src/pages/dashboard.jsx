import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  /* ---------------- AUTH ---------------- */
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = Boolean(user);

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold">
            AI Language Tutor
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="border rounded-full px-3 py-1 text-sm dark:border-gray-600"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Signup
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 max-w-7xl mx-auto px-6 py-12 ${
          !isLoggedIn ? "flex flex-col justify-center" : ""
        }`}
      >
        {/* Hero text */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Learn English with AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Practice real conversations, improve speaking skills, and learn
            confidently with AI-powered guidance.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Conversational Learning */}
          <Link
            to={isLoggedIn ? "/chat" : "/login"}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center text-gray-500">
              Feature Image
            </div>
            <h3 className="text-lg font-semibold text-center">
              Conversational Learning
            </h3>
          </Link>

          {/* Voice Based Learning */}
          <Link
            to={isLoggedIn ? "/voice" : "/login"}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center text-gray-500">
              Feature Image
            </div>
            <h3 className="text-lg font-semibold text-center">
              Voice Based Learning
            </h3>
          </Link>

          {/* Grammar & Vocabulary */}
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 opacity-60 cursor-not-allowed">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center text-gray-500">
              Coming Soon
            </div>
            <h3 className="text-lg font-semibold text-center">
              Grammar & Vocabulary
            </h3>
          </div>

          {/* Scenario Practice */}
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 opacity-60 cursor-not-allowed">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center text-gray-500">
              Coming Soon
            </div>
            <h3 className="text-lg font-semibold text-center">
              Scenario Based Practice
            </h3>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} AI Language Tutor. Built with ❤️
        </div>
      </footer>
    </div>
  );
};

export default Home;
