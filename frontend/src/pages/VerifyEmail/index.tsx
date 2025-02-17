import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingPage from "../../components/common/LoadingPages/LoadingPage";
import { authService } from "../../services/api/auth";
import { showToast } from "../../utils/toast";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const onEmailVerificationSuccess = () => {
    showToast("Welcome to ScrollBooks!");
    navigate("/signin");
  };

  const onEmailVerificationFailure = () => {
    showToast("This link may have expired. Please request a new one.", "error");
    // navigate("/signin");
  };

  useEffect(() => {
    const verify = async () => {
      if (!id || !token) {
        onEmailVerificationFailure();
        return;
      }
      try {
        await authService.verifyEmail(id, token);
        onEmailVerificationSuccess();
        return;
      } catch (err) {
        onEmailVerificationFailure();
        return;
      }
    };
    verify();
  }, []);

  return <LoadingPage />;
};

export default VerifyEmail;
