import { axiosInstance, publicAxiosInstance } from "../../axios/userAxios";

export const bookAPI = {
  getBooks: async (queryString = ""): Promise<any> => {
    const response = await axiosInstance.get(
      `/api/v1/books/books/?page_size=2&${queryString}`
    );
    return response;
  },

  getMyLibrary: async (queryString = ""): Promise<any> => {
    const response = await axiosInstance.get(
      `/api/v1/books/books/?page_size=2&library=true&${queryString}`
    );
    return response;
  },

  getFavoriteBooks: async (queryString = ""): Promise<any> => {
    const response = await axiosInstance.get(
      `/api/v1/books/books/?page_size=2&favorites=true&${queryString}`
    );
    return response;
  },

  getBook: async (id: number): Promise<any> => {
    const response = await axiosInstance.get(`/api/v1/books/books/${id}/`);
    return response;
  },

  createBook: async (data: object): Promise<any> => {
    const response = await axiosInstance.post("/api/v1/books/books/", data);
    return response;
  },
  updateBook: async (id: number, data: object): Promise<any> => {
    const response = await axiosInstance.patch(
      `/api/v1/books/books/${id}/`,
      data
    );
    return response;
  },
  deleteBook: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`/api/v1/books/books/${id}/`);
    return response;
  },
};
