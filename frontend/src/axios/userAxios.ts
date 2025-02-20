import axios from "axios";
import { authService } from "../services/api/auth";

const apiRootUrl = process.env.REACT_APP_API_ROOT_URL;

const axiosInstance = axios.create({
  baseURL: apiRootUrl,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) =>
    response.config.method === "delete" ? response : response.data,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await authService.refreshToken();
        const token = response?.data?.access_token;
        if (token) {
          localStorage.setItem("access_token", token);
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        localStorage.removeItem("access_token");
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

const publicAxiosInstance = axios.create({
  baseURL: apiRootUrl,
  headers: {
    Accept: "application/json",
  },
});

export { axiosInstance, publicAxiosInstance };
