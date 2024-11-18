import { auth } from "../../../auth";
import WelcomePage from "@/components/AppPage";
export const dynamic = "force-dynamic";
const page = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl font-bold">You are not authenticated 😢</div>
          <div className="text-lg">Please sign in to continue</div>

          <div className="mt-4">
            <a
              href="/api/auth/signin"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <WelcomePage />;
};

export default page;
