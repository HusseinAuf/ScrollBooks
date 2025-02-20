import React, { useState } from "react";
import Button from "../../components/common/buttons/Button";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../validations/signup";
import { authService } from "../../services/api/auth";
import { showToast } from "../../utils/toast";
import LoadingPage from "../../components/common/LoadingPages/LoadingPage";
import { useNavigate } from "react-router-dom";
import useUserContext from "../../contexts/UserContext";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema), // Integrate Yup with React Hook Form
  });
  const { setUser } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (formData: object) => {
    try {
      setIsLoading(true);
      const response = await authService.signup(formData);
      setUser(response.data);
      showToast("Welcome to ScrollBooks!");
      navigate(`/send-verify-email?email=${response.data.email}`);
    } catch (error) {
      showToast("Failed to Sign Up", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlegoogleAuth = useGoogleLogin({
    onSuccess: async (googleResponse) => {
      try {
        const response = await authService.googleAuth({
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
            <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
            <form
              onSubmit={handleSubmit(handleSignup)}
              className="text-sm flex flex-col items-center gap-y-4 w-[90%] sm:w-60"
            >
              <div className="flex flex-col gap-1 w-full">
                <input
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                  className={`bg-white border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${
                    errors?.name ? "border-red-400" : "focus:border-mediumBlue"
                  }`}
                />
                {errors?.name && (
                  <p className="text-sm text-red-300">{errors.name?.message}</p>
                )}
              </div>
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
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={`bg-white border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${
                    errors?.password
                      ? "border-red-400"
                      : "focus:border-mediumBlue"
                  }`}
                />
                {errors?.password && (
                  <p className="text-sm text-red-300">
                    {errors.password?.message}
                  </p>
                )}
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </div>
          <div className="font-bold">OR</div>
          <div>
            <Button onClick={() => handlegoogleAuth()} icon={FaGoogle}>
              Sign in with Google
            </Button>
          </div>
        </div>
        <div className="text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-md font-semibold text-xLightBlue">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
