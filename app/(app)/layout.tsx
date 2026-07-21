"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/api/auth-context";
import { Sidebar, TopBar } from "@/features/shared";
import { Leaf } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (user) {
      const isClientLeader = user.role === "cliente";
      const isClientUser = user.role === "usuario_cliente";
      const isAdmin = user.role === "admin";
      
      const isMyFormsPath = pathname.startsWith("/my-forms") || pathname.startsWith("/forms/");
      const isProjectOrReport = pathname.startsWith("/projects") || pathname.startsWith("/reports");
      const isSettings = pathname.startsWith("/settings");
      const isProfile = pathname.startsWith("/profile");
      
      if (isSettings && !isAdmin) {
        router.replace("/dashboard");
      } else if (isClientUser && !isMyFormsPath && !isProfile) {
        router.replace("/my-forms");
      } else if (isClientLeader && !isMyFormsPath && !isProjectOrReport && !isProfile) {
        router.replace("/projects");
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center animate-pulse">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-muted-foreground">Cargando plataforma...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
