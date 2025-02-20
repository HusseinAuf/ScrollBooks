import { axiosInstance } from "../../axios/userAxios";

export const categoryService = {
  getCategories: async () => {
    const response = await axiosInstance.get("/api/v1/books/categories/");
    return response;
  },
};
