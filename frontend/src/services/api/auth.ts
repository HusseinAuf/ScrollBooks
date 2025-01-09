import { axiosInstance, publicAxiosInstance } from "../../axios/userAxios";

export const authService = {
  signin: async (data: object) =>
    await publicAxiosInstance.post("/api/v1/users/login/", data, {
      withCredentials: true,
    }),
  signup: async (data: object) =>
    await publicAxiosInstance.post("/api/v1/users/users/", data),
  verifyEmail: async (id: string, token: string) =>
    await publicAxiosInstance.get(`/api/v1/users/verify-email/${id}/${token}/`),
  resetPassword: async (data: object) =>
    await publicAxiosInstance.post("/api/v1/users/password/reset/", data),
  confirmResetPassword: async (id: string, token: string, data: object) =>
    await publicAxiosInstance.post(
      `/api/v1/users/password/reset/confirm/${id}/${token}/`,
      data
    ),
  refreshToken: async (data: object = {}) =>
    await publicAxiosInstance.post("api/v1/users/token/refresh/", data, {
      withCredentials: true,
    }),
  logout: async () =>
    await axiosInstance.get("/api/v1/users/logout/", {
      withCredentials: true,
    }),
};

export const userService = {
  getMyProfile: () => axiosInstance.get("/api/v1/users/users/me/"),
  updateMyProfile: (id: string, data: object) =>
    axiosInstance.patch(`/api/v1/users/users/${id}`, data),
  getUsers: () => axiosInstance.get("/api/v1/users/users/"),
};
