import React, { useState } from "react";
import Button from "../../components/common/buttons/Button";
import useUserContext from "../../contexts/UserContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassword } from "../../validations/resetPassword";
import { authService } from "../../services/api/auth";
import { showToast } from "../../utils/toast";
import LoadingPage from "../../components/common/LoadingPages/LoadingPage";

const ResetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPassword), // Integrate Yup with React Hook Form
  });
  const { setAccessToken } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (formData: object) => {
    try {
      setIsLoading(true);
      await authService.resetPassword(formData);
      showToast("A reset password link has been sent to you");
    } catch (error) {
      /**/
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingPage />
  ) : (
    <div className="h-screen p-4 flex flex-col gap-y-4 items-center justify-center bg-gradient-to-r from-darkBlue to-mediumBlue text-white">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-6">Reset Your Password</h1>
            <form
              onSubmit={handleSubmit(handleResetPassword)}
              className="text-sm flex flex-col items-center gap-y-4 w-[90%] sm:w-60"
            >
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={`bg-white border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${
                    errors?.email ? "border-red-400" : "focus:border-mediumBlue"
                  }`}
                />
                {errors?.email && (
                  <p className="text-sm text-red-300">
                    {errors.email?.message}
                  </p>
                )}
              </div>
              <Button type="submit">Send Email</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
