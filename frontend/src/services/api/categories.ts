import { axiosInstance } from "../../axios/userAxios";

export const categoryAPI = {
  getCategories: async () => {
    const response = await axiosInstance.get("/api/v1/books/categories/");
    return response;
  },
};
