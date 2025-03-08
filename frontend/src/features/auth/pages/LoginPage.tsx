import React, { useState } from "react";
import Button from "../../../components/common/button/Button";
import useUserContext from "../../../contexts/UserContext";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../validations/login";
import { authAPI } from "../../../services/api/auth";
import { showToast } from "../../../utils/toast";
import LoadingPage from "../../../components/common/LoadingPages/LoadingPage";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(loginSchema), // Integrate Yup with React Hook Form
  });
  const { setAccessToken } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (formData: object) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(formData);
      const token = response.data.access_token;
      localStorage.setItem("access_token", token);
      setAccessToken(token);
      showToast("Welcome to Scroll Books");
      navigate("/books");
      navigate(0);
    } catch (err: any) {
      showToast("Failed to Log In", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlegoogleAuth = useGoogleLogin({
    onSuccess: async (googleResponse) => {
      try {
        const response = await authAPI.googleAuth({
          google_code: googleResponse.code,
        });
      } catch (err) {
        /**/
      }
    },
    onError: () => {
      console.error("Login Failed");
    },
    flow: "auth-code",
    scope: "openid email profile",
  });

  return isLoading ? (
    <LoadingPage />
  ) : (
    <div className="h-screen p-4 flex flex-col gap-y-4 items-center justify-center bg-gradient-to-r from-darkBlue to-mediumBlue text-white">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-6">Log In</h1>
            <form
              onSubmit={handleSubmit(handleLogin)}
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
              <div className="flex flex-col gap-2 w-full">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                    className={`bg-white border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${
                      errors?.password
                        ? "border-red-400"
                        : "focus:border-mediumBlue"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mediumBlue hover:text-darkBlue"
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiFillEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors?.password && (
                  <p className="text-sm text-red-300">
                    {errors.password?.message}
                  </p>
                )}
                <Link
                  to="/reset-password"
                  className="mt-1 text-sm font-semibold text-xLightBlue"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </div>
          <div className="font-bold">OR</div>
          <div>
            <Button onClick={() => handlegoogleAuth()} icon={FaGoogle}>
              Log in with Google
            </Button>
          </div>
        </div>
        <div className="text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-md font-semibold text-xLightBlue">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
