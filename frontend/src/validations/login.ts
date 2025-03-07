import * as Yup from "yup";
import { email, password } from "./validationUtils";

export const loginSchema = Yup.object().shape({
  email: email,
  password: password,
});
