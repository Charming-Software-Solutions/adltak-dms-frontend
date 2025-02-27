import React from "react";
import TokenClient from "./TokenClient";
import { validateResetPasswordToken } from "@/lib/actions/auth.actions";

export default async function ResetPasswordToken({
  params,
}: {
  params: { token: string };
}) {
  const tokenValidation = await validateResetPasswordToken(params.token);

  if (tokenValidation.errors) {
    const errorMessage = tokenValidation.errors.error
      ? tokenValidation.errors.error.toString()
      : "An unknown error occurred.";
    throw new Error(errorMessage);
  }

  return <TokenClient token={params.token} />;
}
