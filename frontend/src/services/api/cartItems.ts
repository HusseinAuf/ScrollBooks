import { axiosInstance } from "../../axios/userAxios";

export const cartAPI = {
  getMyCart: async () => {
    const response = await axiosInstance.get("/api/v1/books/cart-items/");
    return response;
  },
  createCartItem: async (data: object) => {
    const response = await axiosInstance.post(
      "/api/v1/books/cart-items/",
      data
    );
    return response;
  },
  deleteCartItem: async (cartItemID: number) => {
    const response = await axiosInstance.delete(
      `/api/v1/books/cart-items/${cartItemID}/`
    );
    return response;
  },
};
