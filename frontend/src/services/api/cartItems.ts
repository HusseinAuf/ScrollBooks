import { axiosInstance } from "../../axios/userAxios";

export const cartAPI = {
  getMyCart: () => axiosInstance.get("/api/v1/books/cart-items/"),
  createCartItem: () => axiosInstance.post("/api/v1/books/cart-items/"),
  deleteCartItem: () => axiosInstance.delete("/api/v1/books/cart-items/"),
};
