import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [loggedInUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.name : "";
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-indigo-500 text-white">
      <h1 className="text-2xl">Dashboard</h1>
      <h2 className="mt-2">Welcome, {loggedInUser}</h2>

      {/* Your future dashboard UI goes here */}
      <button
        onClick={handleLogout}
        className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded"
      >
        Log out
      </button>
    </div>
  );
}

export default Home;
