import { Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Home from "./pages/dashboard.jsx";
import PrivateRoute from "./pages/protectedRoute.jsx";
import Reset from "./pages/reset.jsx";
import Chat from "./pages/chat.jsx";
import VoiceLearning from "./pages/voicelearnuing.jsx";
import ScenarioSelect from "./pages/scenarioselect.jsx";
import ScenarioRoom from "./pages/ScenarioRoom";
import DebateStart from "./pages/debatestart.jsx";
import DebateRoom from "./pages/DebateRoom";
import Userprofile from "./pages/profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";

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
              <Home/>
            </PrivateRoute>
          }
        />
        <Route path="/reset" element={<Reset />} />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Userprofile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        {/* VOICE */}
        <Route
          path="/voicelearn"
          element={
            <PrivateRoute>
              <VoiceLearning />
            </PrivateRoute>
          }
        />

        {/* SCENARIO */}
        <Route
          path="/secnarioroom"
          element={
            <PrivateRoute>
              <ScenarioSelect />
            </PrivateRoute>
          }
        />
        <Route path="/scenario/:scenarioId" element={<ScenarioRoom />} />

        {/* DEBATE */}
        <Route
          path="/debate"
          element={
            <PrivateRoute>
              <DebateStart />
            </PrivateRoute>
          }
        />
        <Route path="/debate-room" element={<DebateRoom />} />
      </Routes>
    </div>
  );
}

export default App;
