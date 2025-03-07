import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import useUserContext from "../contexts/UserContext";
import { ToastContainer } from "react-toastify";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-w-screen min-h-screen flex flex-col">
      <ToastContainer />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
