// components/GoogleAuthButton.tsx

"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const GoogleAuthButton = () => {
  const handleGoogleAuth = async () => {
    try {
      await signIn("google", { callbackUrl: "/" }); // Adjust the callback URL if needed
    } catch (error) {
      console.error("Google authentication failed:", error);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
      <FcGoogle className="mr-2 h-5 w-5" />
      Sign in with Google
    </Button>
  );
};

export default GoogleAuthButton;
