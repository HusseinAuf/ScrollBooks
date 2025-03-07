import { axiosInstance } from "../../axios/userAxios";

export const reviewAPI = {
  getReviews: async (bookID: number, page: number) => {
    const response = await axiosInstance.get(
      `/api/v1/books/books/${bookID}/reviews/?page_size=2&page=${page}`
    );
    return response;
  },
  createReview: async (bookID: number, data: object) => {
    const response = await axiosInstance.post(
      `/api/v1/books/books/${bookID}/reviews/`,
      data
    );
    return response;
  },
  updateReview: async (bookID: number, id: number, data: object) => {
    const response = await axiosInstance.patch(
      `/api/v1/books/books/${bookID}/reviews/${id}/`,
      data
    );
    return response;
  },
};
