import { axiosInstance } from "../../axios/userAxios";

export const orderAPI = {
  getOrders: async () => {
    const response = await axiosInstance.get("/api/v1/books/orders/");
    return response;
  },
  createOrder: async (data: object) => {
    const response = await axiosInstance.post("/api/v1/books/orders/", data);
    return response;
  },
};
