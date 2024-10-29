import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/Themes/ThemeToggle";
import GoogleAuthButton from "@/components/Authentication/GoogleAuthButton";

const AuthScreen = () => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div>
          <GoogleAuthButton />
        </div>
    </div>
  )
}

export default AuthScreen