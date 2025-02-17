import { axiosInstance } from "../../axios/userAxios";

export const categoryService = {
  getCategories: () => axiosInstance.get("/api/v1/books/categories/"),
};
