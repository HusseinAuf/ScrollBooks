import { axiosInstance, publicAxiosInstance } from "../../axios/userAxios";

export const booksAPI = {
  getBooks: async (queryString = "") =>
    await axiosInstance.get(`/api/v1/books/books/?${queryString}`),
  getBook: async (id: string) =>
    await axiosInstance.get(`/api/v1/books/books/${id}/`),
  createBook: async (data: object) =>
    await axiosInstance.post("/api/v1/books/books/", data),
  updateBook: async (id: string, data: object) =>
    await axiosInstance.patch(`/api/v1/books/books/${id}/`, data),
  deleteBook: async (id: string) =>
    await axiosInstance.delete(`/api/v1/books/books/${id}/`),
};
