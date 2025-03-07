import React, { useState, useEffect } from "react";
import Button from "../../../components/common/button/Button";
import { authAPI } from "../../../services/api/auth";
import { showToast } from "../../../utils/toast";
import useUserContext from "../../../contexts/UserContext";
import { email } from "../../../validations/validationUtils";

const SendVerifyEmailPage: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get("email");

  const handleResendEmail = async () => {
    try {
      await authAPI.resendVerificationEmail({ email });
      showToast("Email was sent successfully");
    } catch (err) {
      /**/
    }
  };

  return (
    <div className="h-screen p-4 flex flex-col gap-y-4 items-center justify-center bg-gradient-to-r from-darkBlue to-mediumBlue text-white">
      <div className="flex flex-col justify-center items-center text-center">
        <p className="text-md text-center mb-6 w-full md:w-[70%]">
          You're almost there! 🚀 Check your inbox/spam for a link to verify
          your email!
        </p>
        <Button onClick={handleResendEmail}>Resend Email</Button>
      </div>
    </div>
  );
};

export default SendVerifyEmailPage;
