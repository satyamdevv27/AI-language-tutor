import { Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Home from "./pages/dashboard.jsx";
import PrivateRoute from "./pages/protectedRoute.jsx";
import Reset from "./pages/reset.jsx";
import Chat from "./pages/chat.jsx";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/reset" element={<Reset />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
