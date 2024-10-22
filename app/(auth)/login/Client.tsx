"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/actions/auth.actions";
import { useFormStatus } from "react-dom";

const LoginClient = () => {
  const { pending } = useFormStatus();

  const handleSubmit = async (formData: FormData) => {
    const errors = await login(formData);

    if (errors) {
      console.log(errors);
    }
  };

  return (
    <form action={handleSubmit}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending} className="w-full">
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginClient;
