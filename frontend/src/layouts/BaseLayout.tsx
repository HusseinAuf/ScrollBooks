import Navbar from "../components/layout/Navbar/index";
import Footer from "../components/layout/Footer";
import useUserContext from "../contexts/UserContext";
import { ToastContainer } from "react-toastify";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken } = useUserContext();
  return (
    <div className="min-w-screen">
      <ToastContainer />
      {accessToken && <Navbar />}
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
