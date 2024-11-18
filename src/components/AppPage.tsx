"use client";

import React from "react";

import { Button } from "@/components/ui/button"; // Replace with your button component
import { Sparkle, Smile, CheckCircle, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-5xl font-bold">
              Welcome to <span className="text-blue-500">NutriWise</span>!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your AI-powered solution for a healthier lifestyle.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <Sparkle className="h-12 w-12 text-blue-500" />
              <h3 className="mt-4 text-xl font-semibold">NutriWise AI</h3>
              <p className="text-center mt-2 text-sm text-muted-foreground">
                Get personalized nutrition insights powered by AI.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <Smile className="h-12 w-12 text-yellow-500" />
              <h3 className="mt-4 text-xl font-semibold">Community</h3>
              <p className="text-center mt-2 text-sm text-muted-foreground">
                Connect and share recipes with like-minded individuals.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold">Track Progress</h3>
              <p className="text-center mt-2 text-sm text-muted-foreground">
                Stay on top of your goals with advanced tracking tools.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <User2Icon className="h-12 w-12 text-blue-500" />
              <h3 className="mt-4 text-xl font-semibold">
                Recipe Recommendations
              </h3>
              <p className="text-center mt-2 text-sm text-muted-foreground">
                Discover new recipes tailored to your preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
