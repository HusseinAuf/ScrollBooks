import { axiosInstance } from "../../axios/userAxios";

export const reviewService = {
  getReviews: (bookID: string, page: number) =>
    axiosInstance.get(
      `/api/v1/books/books/${bookID}/reviews/?page_size=1&page=${page}`
    ),
  createReview: (bookID: string, data: object) =>
    axiosInstance.post(`/api/v1/books/books/${bookID}/reviews/`, data),
  updateReview: (bookID: string, id: string, data: object) =>
    axiosInstance.patch(`/api/v1/books/books/${bookID}/reviews/${id}/`, data),
};
