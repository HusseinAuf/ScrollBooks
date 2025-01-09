import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import VerifyEmail from "./pages/VerifyEmail";
import { UserProvider } from "./contexts/UserContext";
import MainLayout from "./layouts/MainLayout";

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/verify-email/:id/:token" element={<VerifyEmail />} />
          </Routes>
        </MainLayout>
      </UserProvider>
    </Router>
  );
};
export default App;
