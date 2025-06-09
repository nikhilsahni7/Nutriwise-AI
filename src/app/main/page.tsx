"use client";
import { useEffect } from "react";
import WelcomePage from "@/components/AppPage";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {

    const timer = setTimeout(() => {
      router.push("/main/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  if (!session) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-4xl font-bold">You are not authenticated but it's okay 😐</div>
            <div className="text-lg">We recommend signing in for the best experience.</div>

            <div className="mt-4">
              <a
                href="/api/auth/signin"
                className="px-5 py-3 bg-blue-500 text-white rounded-full"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WelcomePage />
    </>
  );
};

export default Page;
