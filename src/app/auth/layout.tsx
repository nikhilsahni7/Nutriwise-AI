
import { cn } from "@/lib/utils";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("light")} >
      <body>
        {children}
      </body>
    </html>
  );
}
