import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutriWise Dashboard",
  description:
    "NutriWise AI - Your Personal Nutritionist for personalized diet plans,recommendations,meal tracking and recipe comuninty sharing - Dashboard Page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-2 w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
