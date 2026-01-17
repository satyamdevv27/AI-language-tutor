import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ AUTO REDIRECT IF LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handlelogin = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/home", { replace: true });
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white">
      <div className="w-full max-w-md bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handlelogin} className="space-y-4">
          <div>
            <label className="text-sm mb-1 block">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-xl bg-white/80 dark:bg-zinc-800 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-xl bg-white/80 dark:bg-zinc-800 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm mt-3 text-gray-600 dark:text-zinc-400">
            Forgot password?{" "}
            <Link to="/reset" className="text-indigo-500 hover:underline">
              Reset
            </Link>
          </p>
          
          <p className="text-center text-sm mt-3 text-gray-600 dark:text-zinc-400">
            didn't have account{" "}
            <Link to="/signup" className="text-indigo-500 hover:underline">
              signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
