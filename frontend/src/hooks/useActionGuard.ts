import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserContext from "../contexts/UserContext";
import { showToast } from "../utils/toast";

export function useActionGuard() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  return (action: () => void) => {
    if (!user) {
      showToast("Login to start using Scroll Books 🚀.");
      navigate("/login");
    } else if (!user.is_verified) {
      showToast(
        "Please verify your account to perform this action.",
        "warning"
      );
      navigate(`/send-verify-email?email=${user.email}`);
    } else {
      action(); // Execute the intended action if all conditions are met
    }
  };
}
