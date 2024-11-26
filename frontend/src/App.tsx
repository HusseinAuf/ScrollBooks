import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import LandingPage from "./pages/LandingPage/LandingPage";
// import LoginSignup from "./pages/LoginSignup/LoginSignup";
// import VerifyEmail from "./pages/LoginSignup/VerifyEmail";
// import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route>
          {/* <Route element={<AuthProvider />}> */}
          {/* <Route path="/" element={<LandingPage />} /> */}
          {/* <Route path="/login-signup" element={<LoginSignup />} /> */}
          {/* <Route path="/verify-email/:id/:token" element={<VerifyEmail />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
