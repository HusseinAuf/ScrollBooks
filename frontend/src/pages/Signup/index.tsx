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
import LoadingPage from "../../components/common/Loading/LoadingPage";

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema), // Integrate Yup with React Hook Form
  });
  const [checkInbox, setCheckInbox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (errors && Object.keys(errors).length === 0) {
      return;
    }
    // validationErrorToast(errors);
  }, [errors]);

  const handleSignup = async (formData: object) => {
    try {
      setIsLoading(true);
      await authService.signup(formData);
      showToast("Welcome to ScrollBooks");
      setCheckInbox(true);
      // const succeeded = await signup(formData);
      // if (succeeded) {
      //   setCheckInbox(true);
      // }
    } catch (error) {
      showToast("Failed to Sign Up", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlegooglelogin = useGoogleLogin({
    onSuccess: (response) => {
      console.log(response);
      // Handle login success (e.g., send token to backend)
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  const handleSendAgain = () => {
    setCheckInbox(false);
  };

  return isLoading ? (
    <LoadingPage />
  ) : (
    <div className="h-screen p-4 flex flex-col gap-y-4 items-center justify-center bg-gradient-to-r from-darkBlue to-mediumBlue text-white">
      {!checkInbox ? (
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
                      errors?.name
                        ? "border-red-400"
                        : "focus:border-mediumBlue"
                    }`}
                  />
                  {errors?.name && (
                    <p className="text-sm text-red-300">
                      {errors.name?.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className={`bg-white border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none ${
                      errors?.email
                        ? "border-red-400"
                        : "focus:border-mediumBlue"
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
              <Button onClick={() => handlegooglelogin()} icon={FaGoogle}>
                Sign in with Google
              </Button>
            </div>
          </div>
          <div className="text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-md font-semibold text-xLightBlue"
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center">
          <p className="text-md text-center mb-4 w-full md:w-[70%]">
            You're almost there! 🚀 Check your inbox/spam for a link to verify
            your email!
          </p>

          <Button onClick={handleSendAgain}>Send Again</Button>
        </div>
      )}
    </div>
  );
};

export default Signup;
