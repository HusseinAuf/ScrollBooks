import * as Yup from "yup";
import { email } from "./validationUtils";

export const resetPassword = Yup.object().shape({
  email: email,
});
