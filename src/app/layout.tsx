import type { Metadata } from "next";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/Themes/ThemeProvider";
import Provider from "@/components/Authentication/Provider";

export const metadata: Metadata = {
  title: "NutriWise",
  description:
    "NutriWise AI - Your Personal Nutritionist for personalized diet plans,recommendations,meal tracking and recipe comuninty sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
