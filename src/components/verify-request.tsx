// components/VerifyRequest.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Check } from "lucide-react";

interface VerifyRequestProps {
  email: string;
}

export function VerifyRequest({ email }: VerifyRequestProps) {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
          <CardHeader className="space-y-1">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Check your email
            </CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a magic link to:
              <div className="font-medium text-blue-600 mt-1">{email}</div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Click the link in your email to sign in to your account.
              </p>
              <p className="text-xs text-gray-500">
                If you don&apos;t see it, check your spam folder.
              </p>
            </div>
            {countdown > 0 ? (
              <p className="text-sm text-center text-gray-500">
                Resend email in {countdown}s
              </p>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Resend Email
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
