import { axiosInstance, publicAxiosInstance } from "../../axios/userAxios";

export const authService = {
  signin: async (data: object) => {
    const response = await publicAxiosInstance.post(
      "/api/v1/users/login/",
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  },
  signup: async (data: object) => {
    const response = await publicAxiosInstance.post(
      "/api/v1/users/users/",
      data
    );
    return response;
  },
  googleAuth: async (data: object) => {
    const response = await publicAxiosInstance.post(
      "/api/v1/users/google-auth/",
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  },
  resendVerificationEmail: async (data: object) => {
    const response = await axiosInstance.post(
      "/api/v1/users/resend-verification-email/",
      data
    );
    return response;
  },
  verifyEmail: async (id: string, token: string) => {
    const response = await publicAxiosInstance.get(
      `/api/v1/users/verify-email/${id}/${token}/`
    );
    return response;
  },
  resetPassword: async (data: object) => {
    const response = await publicAxiosInstance.post(
      "/api/v1/users/password/reset/",
      data
    );
    return response;
  },
  confirmResetPassword: async (id: string, token: string, data: object) => {
    const response = await publicAxiosInstance.post(
      `/api/v1/users/password/reset/confirm/${id}/${token}/`,
      data
    );
    return response;
  },
  refreshToken: async (data: object = {}) => {
    const response = await publicAxiosInstance.post(
      "api/v1/users/token/refresh/",
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  },
  logout: async () => {
    const response = await axiosInstance.get("/api/v1/users/logout/", {
      withCredentials: true,
    });
    return response;
  },
};

export const userService = {
  getMe: async () => {
    const response = await axiosInstance.get("/api/v1/users/users/me/");
    return response;
  },
  updateUser: async (id: number, data: object) => {
    const response = await axiosInstance.patch(
      `/api/v1/users/users/${id}/`,
      data
    );
    return response;
  },
  getUsers: async () => {
    const response = await axiosInstance.get("/api/v1/users/users/");
    return response;
  },
};
