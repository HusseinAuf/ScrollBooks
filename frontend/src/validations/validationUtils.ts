import * as Yup from "yup";

export const dateRegex = /^(?:\d{4}-\d{2}-\d{2}|\d{4}-\d{1,2}-\d{1,2})$/; //"YYYY-MM-DD" or "YYYY-M-D"

export const password = Yup.string()
  .required("Password is required.")
  .min(8, "Password must be at least 8 characters long.")
  .matches(/[A-Za-z]/, "Password must contain at least one letter.")
  .matches(/[0-9]/, "Password must have at least one number.")
  .matches(/[@$!%*?&#]/, "Password must have at least one special character.");

export const email = Yup.string()
  .required("Email is required.")
  .email("Invalid email format.");
