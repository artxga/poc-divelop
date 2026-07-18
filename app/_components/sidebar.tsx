"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/_lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Leaf,
  ChevronRight,
  LogOut,
  Shield,
  Users,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Progreso y KPIs",
  },
  {
    label: "Indicadores",
    href: "/indicadores",
    icon: BookOpen,
    description: "Biblioteca de indicadores",
  },
  {
    label: "Proyectos",
    href: "/proyectos",
    icon: FolderOpen,
    description: "Recojo de información",
  },
  {
    label: "Validación",
    href: "/validacion",
    icon: CheckSquare,
    description: "Flujo de estados",
  },
  {
    label: "Reportes",
    href: "/reportes",
    icon: BarChart3,
    description: "Análisis y exportación",
  },
];

const ROL_CONFIG = {
  admin: { label: "Administrador", icon: Shield, color: "text-purple-400" },
  consultor: { label: "Consultor", icon: Users, color: "text-blue-400" },
  cliente: { label: "Cliente Líder", icon: Shield, color: "text-emerald-400" },
  usuario_cliente: { label: "Usuario Cliente", icon: User, color: "text-emerald-400" },
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const rolConfig = ROL_CONFIG[user.rol];
  const RolIcon = rolConfig.icon;

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border/50 bg-card/40 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border/50">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Leaf className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-semibold text-sm leading-none">Divelop ESG</p>
          <p className="text-xs text-muted-foreground mt-0.5">Reporting Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Módulos
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", isActive && "text-emerald-400")} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.description}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer / user */}
      <div className="border-t border-border/50 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.nombre}</p>
            <div className={cn("flex items-center gap-1 text-xs", rolConfig.color)}>
              <RolIcon className="w-3 h-3" />
              {rolConfig.label}
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="text-muted-foreground hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Cerrar sesión</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
