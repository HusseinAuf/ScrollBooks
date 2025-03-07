import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./features/landing/pages/LandingPage";
import SignupPage from "./features/auth/pages/SignupPage";
import LoginPage from "./features/auth/pages/LoginPage";
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";
import SendVerifyEmailPage from "./features/auth/pages/SendVerifyEmailPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import ConfirmResetPasswordPage from "./features/auth/pages/ConfirmResetPasswordPage";
import BookListPage from "./features/books/pages/BookListPage";
import LibraryPage from "./features/books/pages/LibraryPage";
import FavoriteBooksPage from "./features/books/pages/FavoriteBooksPage";
import BookDetailPage from "./features/books/pages/BookDetailPage";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/verify-email/:id/:token"
            element={<VerifyEmailPage />}
          />
          <Route path="/send-verify-email" element={<SendVerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/confirm-reset-password/:id/:token"
            element={<ConfirmResetPasswordPage />}
          />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/books/library" element={<LibraryPage />} />
          <Route path="/books/favorites" element={<FavoriteBooksPage />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
