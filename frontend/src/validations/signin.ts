import * as Yup from "yup";
import { email, password } from "./validationUtils";

export const signinSchema = Yup.object().shape({
  email: email,
  password: password,
});
