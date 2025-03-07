import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (
  message: string,
  type: "success" | "error" | "warning" | "info" = "success"
) => {
  const baseClass = "rounded-md shadow-lg text-white font-semibold text-center";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500",
  };

  toast(message, {
    type,
    // className: `${baseClass} ${typeClasses[type] || "bg-gray-500"}`,
    progressClassName: "bg-green-700 h-1",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
