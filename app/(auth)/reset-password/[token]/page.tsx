import React from "react";
import TokenClient from "./TokenClient";
import { validateResetPasswordToken } from "@/lib/actions/auth.actions";

export default async function ResetPasswordToken(
  props: {
    params: Promise<{ token: string }>;
  }
) {
  const params = await props.params;
  const tokenValidation = await validateResetPasswordToken(params.token);

  if (tokenValidation.errors) {
    const errorMessage = tokenValidation.errors.error
      ? tokenValidation.errors.error.toString()
      : "An unknown error occurred.";
    throw new Error(errorMessage);
  }

  return <TokenClient token={params.token} />;
}
