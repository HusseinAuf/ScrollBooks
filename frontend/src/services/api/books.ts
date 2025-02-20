import { axiosInstance, publicAxiosInstance } from "../../axios/userAxios";

export const bookAPI = {
  getBooks: async (queryString = "") => {
    const response = await axiosInstance.get(
      `/api/v1/books/books/?${queryString}`
    );
    return response;
  },

  getBook: async (id: number) => {
    const response = await axiosInstance.get(`/api/v1/books/books/${id}/`);
    return response;
  },

  createBook: async (data: object) => {
    const response = await axiosInstance.post("/api/v1/books/books/", data);
    return response;
  },
  updateBook: async (id: number, data: object) => {
    const response = await axiosInstance.patch(
      `/api/v1/books/books/${id}/`,
      data
    );
    return response;
  },
  deleteBook: async (id: number) => {
    const response = await axiosInstance.delete(`/api/v1/books/books/${id}/`);
    return response;
  },
};
