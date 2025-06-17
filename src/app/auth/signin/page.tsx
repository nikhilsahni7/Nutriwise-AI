"use client";

import React, { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, LoaderCircle, Sparkles, Shield } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerSignIn />
    </Suspense>
  );
}

function InnerSignIn() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/auth/setup";
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("resend", {
        email,
        callbackUrl,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or too many attempts");
      } else {
        router.push(`/auth/verify-request?email=${encodeURIComponent(email)}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("google", { callbackUrl });
      if (result?.error) {
        setError("Invalid email or too many attempts");
      } else {
        router.push(`/auth/setup`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background with Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,154,158,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-200/20 to-indigo-200/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <Card className="backdrop-blur-xl bg-white/80 shadow-2xl border-0 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />

            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <CardHeader className="space-y-1 relative">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center"
              >
                {/* Icon with Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>

                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600 mt-3 text-base">
                  Sign in to your account to continue your journey
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-8 relative">
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="space-y-3"
                >
                  <div className="relative group">
                    <motion.div
                      animate={{
                        scale: isFocused ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <motion.div
                        animate={{
                          scale: isFocused ? 1.1 : 1,
                          color: isFocused ? "#3b82f6" : "#9ca3af"
                        }}
                        className="absolute right-4 top-4 h-6 w-6"
                      >
                        <Mail className="h-full w-full transition-colors duration-300" />
                      </motion.div>
                    </motion.div>

                    {/* Input Glow Effect */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isFocused ? 1 : 0 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md -z-10"
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg text-white font-semibold rounded-xl relative overflow-hidden group"
                  >
                    {/* Button Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />

                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <LoaderCircle className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center justify-center"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Sign in with Email
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 font-medium backdrop-blur-sm rounded-full">
                    Or continue with
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full h-14 border-2 border-gray-200/50 hover:border-gray-300 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-sm backdrop-blur-sm rounded-xl group relative overflow-hidden"
                >
                  {/* Google Button Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <motion.div
                    className="flex items-center justify-center relative z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FcGoogle className="mr-3 h-6 w-6" />
                    </motion.div>
                    <span className="font-semibold text-white group-hover:text-gray-900 transition-colors duration-200">
                      Sign in with Google
                    </span>
                  </motion.div>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}