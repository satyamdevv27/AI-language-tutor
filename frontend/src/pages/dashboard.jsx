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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold">AI Language Tutor</div>

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
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Learn English with AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Practice conversations, improve speaking, and learn confidently with
            AI-powered guidance.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Conversational */}
          <Link
            to={isLoggedIn ? "/chat" : "/login"}
            className="bg-white dark:bg-gray-800
    text-gray-800 dark:text-gray-100
    transition-colors duration-300 border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg "
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
              Feature Image
            </div>
            <h3 className="text-lg font-semibold text-center">
              Chat with AI
            </h3>
          </Link>

          {/* Voice */}
          <Link
            to={isLoggedIn ? "/voicelearn" : "/login"}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
              Feature Image
            </div>
            <h3 className="text-lg font-semibold text-center">
              Grammar and vocabulary support
            </h3>
          </Link>

         
          <Link
            to={isLoggedIn ? "/debate" : "/login"}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
              coming soon
            </div>
            <h3 className="text-lg font-semibold text-center">
              Debate mode
            </h3>
          </Link>

          <Link
            to={isLoggedIn ? "/secnarioroom" : "/login"}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
              coming soon
            </div>
            <h3 className="text-lg font-semibold text-center">
              Scenario Practice
            </h3>
          </Link>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} AI Language Tutor
        </div>
      </footer>
    </div>
  );
};

export default Home;
