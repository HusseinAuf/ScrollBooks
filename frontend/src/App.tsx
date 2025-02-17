import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import VerifyEmail from "./pages/VerifyEmail";
import SendVerifyEmail from "./pages/SendVerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";
import BooksPage from "./features/books/BooksPage";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/verify-email/:id/:token" element={<VerifyEmail />} />
          <Route path="/send-verify-email" element={<SendVerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/confirm-reset-password/:id/:token"
            element={<ConfirmResetPassword />}
          />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BooksPage />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
