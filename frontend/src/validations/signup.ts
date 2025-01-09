import * as Yup from "yup";
import { email, password } from "./validationUtils";

export const signupSchema = Yup.object().shape({
  email: email,
  password: password,
  name: Yup.string().required("Name is required."),
  phone_number: Yup.string().notRequired(),
});
