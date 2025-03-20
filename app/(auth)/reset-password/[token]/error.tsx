"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center justify-center gap-2">
            <AlertCircle className="w-6 h-6" /> {error.message}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Your password reset link is invalid or has expired.
          </p>
          <p className="text-gray-700 mt-2">Please request a new one.</p>
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={() => router.push("/reset-password")}>
              Request New Link
            </Button>
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
