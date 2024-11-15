"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerErrorPage />
    </Suspense>
  );
}

function InnerErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: { [key: string]: string } = {
    default: "An error occurred during authentication.",
    configuration: "There is a problem with the server configuration.",
    verification:
      "The verification link may have expired or already been used.",
  };

  const errorMessage = errorMessages[error || "default"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Authentication Error
        </h2>
        <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        <button
          onClick={() => (window.location.href = "/auth/signin")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
