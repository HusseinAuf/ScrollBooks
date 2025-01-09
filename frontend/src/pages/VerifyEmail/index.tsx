import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingPage from "../../components/common/Loading/LoadingPage";
import { authService } from "../../services/api/auth";
import { showToast } from "../../utils/toast";

const VerifyEmail: React.FC = () => {
  const { id, token } = useParams();

  // const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (id && token) {
        try {
          await authService.verifyEmail(id, token);
          navigate("/home");
          showToast("Welcom to ScollBooks.");
        } catch {
          showToast(
            "This link may have expired. Please request a new one.",
            "error"
          );
          navigate("/login");
        }
      } else {
        showToast(
          "This link may have expired. Please request a new one.",
          "error"
        );
        navigate("/login");
      }
    };
    verify();
  }, []);

  return <LoadingPage />;
};

export default VerifyEmail;
