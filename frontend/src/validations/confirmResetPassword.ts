import * as Yup from "yup";
import { password } from "./validationUtils";

export const confirmResetPassword = Yup.object()
  .shape({
    new_password: password,
    confirm_new_password: password,
  })
  .test(function (value) {
    const { new_password, confirm_new_password } = value;
    if (new_password !== confirm_new_password) {
      return this.createError({
        path: "confirm_new_password", // Attach the error to confirm_new_password
        message: "The passwords are not identical.",
      });
    }
    return true;
  });
