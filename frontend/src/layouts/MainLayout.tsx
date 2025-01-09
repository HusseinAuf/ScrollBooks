import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import useUserContext from "../contexts/UserContext";
import { ToastContainer } from "react-toastify";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  return (
    <div className="min-w-screen">
      <ToastContainer />
      {user && <Navbar />}
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
