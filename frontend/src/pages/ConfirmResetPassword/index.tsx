import React, { useEffect, useState } from "react";
import Button from "../../components/common/buttons/Button";
import useUserContext from "../../contexts/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { confirmResetPassword } from "../../validations/confirmResetPassword";
import { authService } from "../../services/api/auth";
import { showToast } from "../../utils/toast";
import LoadingPage from "../../components/common/LoadingPages/LoadingPage";
import { error } from "console";

const ConfirmResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(confirmResetPassword), // Integrate Yup with React Hook Form
  });
  const { setAccessToken } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmResetPassword = async (formData: object) => {
    console.log("sdf");
    console.log(id, token);
    try {
      setIsLoading(true);
      await authService.confirmResetPassword(id ?? "", token ?? "", formData);
      showToast("Your password has been successfully reset.");
      navigate("/signin");
    } catch (err) {
      /**/
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return isLoading ? (
    <LoadingPage />
  ) : (
    <div className="h-screen p-4 flex flex-col gap-y-4 items-center justify-center bg-gradient-to-r from-darkBlue to-mediumBlue text-white">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-6">Set Your New Password</h1>
            <form
              onSubmit={handleSubmit(handleConfirmResetPassword)}
              className="text-sm flex flex-col items-center gap-y-4 w-[90%] sm:w-60"
            >
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("new_password")}
                  className={`bg-white border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${
                    errors?.new_password
                      ? "border-red-400"
                      : "focus:border-mediumBlue"
                  }`}
                />
                {errors?.new_password && (
                  <p className="text-sm text-red-300">
                    {errors.new_password?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirm_new_password")}
                  className={`bg-white border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${
                    errors?.confirm_new_password
                      ? "border-red-400"
                      : "focus:border-mediumBlue"
                  }`}
                />
                {errors?.confirm_new_password && (
                  <p className="text-sm text-red-300">
                    {errors.confirm_new_password?.message}
                  </p>
                )}
              </div>
              <Button type="submit">Reset</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmResetPassword;
