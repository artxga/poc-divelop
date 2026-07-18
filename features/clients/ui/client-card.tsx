import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users as UsersIcon, Briefcase, ChevronRight, Building } from "lucide-react";
import type { Client } from "@/features/clients/model/types";
import { USERS, PROJECTS } from "@/features/shared/api/mock-db";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  const clientUsers = USERS.filter(u => u.clientId === client.id);
  const clientProjects = PROJECTS.filter(p => p.clientId === client.id);

  return (
    <Link href={`/clients/${client.id}`} className="block group">
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 h-full">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base mb-1 line-clamp-2">{client.name}</h2>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <UsersIcon className="w-3.5 h-3.5" /> 
              {clientUsers.length} {clientUsers.length === 1 ? 'Usuario' : 'Usuarios'}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {clientProjects.length} {clientProjects.length === 1 ? 'Proyecto' : 'Proyectos'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
