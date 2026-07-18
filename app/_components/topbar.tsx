"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/app/_lib/auth-context";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/indicadores": "Biblioteca de Indicadores",
  "/proyectos": "Proyectos",
  "/validacion": "Validación de Indicadores",
  "/reportes": "Reportería y Análisis",
};

export function TopBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = Object.entries(PAGE_TITLES).find(([key]) =>
    pathname.startsWith(key)
  )?.[1] ?? "Divelop ESG";

  if (!user) return null;

  return (
    <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 lg:px-6 bg-card/20 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden w-8 h-8">
          <Menu className="w-4 h-4" />
        </Button>
        <h2 className="font-semibold text-base">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </Button>
        <Avatar className="w-7 h-7 ml-1">
          <AvatarFallback className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold">
            {user.avatar}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
