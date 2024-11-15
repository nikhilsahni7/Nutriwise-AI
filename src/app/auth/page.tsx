import { cn } from "@/lib/utils"
import GoogleAuthButton from "@/components/Authentication/GoogleAuthButton";

const AuthScreen = () => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <div>
          <GoogleAuthButton />
        </div>
    </div>
  )
}

export default AuthScreen