"use client";

import { useState } from "react";
import { USERS, CLIENTS } from "@/features/shared/api/mock-db";
import { useAuth } from "@/features/auth/api/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Shield, Check, X } from "lucide-react";
import type { User } from "@/features/auth/model/types";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  consultor: "Consultor",
  cliente: "Cliente (Líder)",
  usuario_cliente: "Usuario Cliente",
};

const PERMISSIONS_MATRIX = [
  { module: "Dashboard Analítico", admin: true, consultor: true, cliente: false, usuario_cliente: false },
  { module: "Gestión de Indicadores", admin: true, consultor: true, cliente: false, usuario_cliente: false },
  { module: "Gestión de Clientes", admin: true, consultor: true, cliente: false, usuario_cliente: false },
  { module: "Todos los Proyectos", admin: true, consultor: true, cliente: false, usuario_cliente: false },
  { module: "Proyectos Asignados", admin: true, consultor: true, cliente: true, usuario_cliente: false },
  { module: "Creador de Formularios", admin: true, consultor: true, cliente: false, usuario_cliente: false },
  { module: "Ver Todos los Reportes", admin: true, consultor: true, cliente: false, usuario_cliente: false },
  { module: "Reportes de su Empresa", admin: true, consultor: true, cliente: true, usuario_cliente: false },
  { module: "Llenar sus Formularios", admin: true, consultor: true, cliente: true, usuario_cliente: true },
  { module: "Panel de Validación", admin: true, consultor: true, cliente: false, usuario_cliente: false },
];

export function RolesPage() {
  const { user: currentUser } = useAuth();
  const [usersList, setUsersList] = useState<User[]>(USERS);
  
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [clientFilter, setClientFilter] = useState("todos");

  // New User Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "usuario_cliente",
    clientId: "none",
  });

  if (!currentUser || currentUser.role !== "admin") return null;

  const handleRoleChange = (userId: string, newRole: string) => {
    // Modify local state
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    
    // Modify mock DB (in-memory mutation for demo)
    const dbUser = USERS.find(u => u.id === userId);
    if (dbUser) {
      dbUser.role = newRole as any;
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = newUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    
    const userToCreate: User = {
      id: `u${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role as any,
      avatar: initials,
      clientId: newUser.clientId !== "none" ? newUser.clientId : undefined,
    };

    setUsersList(prev => [...prev, userToCreate]);
    USERS.push(userToCreate); // In-memory mutation
    setModalOpen(false);
    setNewUser({ name: "", email: "", password: "", role: "usuario_cliente", clientId: "none" });
  };

  const filteredUsers = usersList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "todos" || u.role === roleFilter;
    const matchClient = clientFilter === "todos" || (u.clientId === clientFilter) || (clientFilter === "none" && !u.clientId);
    return matchSearch && matchRole && matchClient;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración de Accesos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Administra los roles, permisos y usuarios del sistema
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="gap-2">
            <UsersIcon className="w-4 h-4" />
            Usuarios del Sistema
          </TabsTrigger>
          <TabsTrigger value="matrix" className="gap-2">
            <Shield className="w-4 h-4" />
            Matriz de Permisos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-wrap gap-2 flex-1">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por nombre o correo..." 
                      className="pl-9 h-9 bg-secondary/50 border-border/50"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[160px] h-9 bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los Roles</SelectItem>
                      {Object.entries(ROLE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="w-[200px] h-9 bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Empresa Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las Empresas</SelectItem>
                      <SelectItem value="none">Personal Interno (Sin Empresa)</SelectItem>
                      {CLIENTS.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 gap-2 h-9">
                      <Plus className="w-4 h-4" /> Nuevo Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Nombre Completo</Label>
                        <Input required placeholder="Ej. Ana García" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Correo Electrónico</Label>
                        <Input required type="email" placeholder="ana@empresa.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Contraseña Temporal</Label>
                        <Input required type="password" placeholder="••••••••" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Rol en el Sistema</Label>
                        <Select value={newUser.role} onValueChange={(val) => setNewUser({...newUser, role: val})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ROLE_LABELS).map(([val, label]) => (
                              <SelectItem key={val} value={val}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {(newUser.role === "cliente" || newUser.role === "usuario_cliente") && (
                        <div className="space-y-2">
                          <Label>Empresa a la que pertenece</Label>
                          <Select value={newUser.clientId} onValueChange={(val) => setNewUser({...newUser, clientId: val})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona la empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Ninguna</SelectItem>
                              {CLIENTS.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mt-4">
                        Crear Usuario
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="pl-6">Usuario</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="pr-6 w-[200px]">Rol / Accesos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No se encontraron usuarios que coincidan con la búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => {
                      const client = CLIENTS.find(c => c.id === u.clientId);
                      return (
                        <TableRow key={u.id} className="border-border/30 hover:bg-secondary/20">
                          <TableCell className="pl-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold">
                                  {u.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium leading-none">{u.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {client ? client.name : <span className="italic">Interno (Divelop)</span>}
                          </TableCell>
                          <TableCell className="pr-6">
                            {u.id === currentUser.id ? (
                              <div className="text-sm font-medium px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 inline-block">
                                {ROLE_LABELS[u.role]} (Tú)
                              </div>
                            ) : (
                              <Select value={u.role} onValueChange={(val) => handleRoleChange(u.id, val)}>
                                <SelectTrigger className="h-8 text-xs border-emerald-500/20 bg-secondary/30">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(ROLE_LABELS).map(([val, label]) => (
                                    <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg">Matriz de Permisos por Rol</CardTitle>
              <CardDescription>Visualiza a qué módulos tiene acceso cada perfil del sistema</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent bg-secondary/10">
                    <TableHead className="pl-6 w-[300px]">Módulo / Acción</TableHead>
                    <TableHead className="text-center font-medium text-emerald-400">Admin</TableHead>
                    <TableHead className="text-center font-medium text-blue-400">Consultor</TableHead>
                    <TableHead className="text-center font-medium text-purple-400">Cliente (Líder)</TableHead>
                    <TableHead className="text-center pr-6 font-medium text-amber-400">Usuario Cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERMISSIONS_MATRIX.map((row, i) => (
                    <TableRow key={i} className="border-border/30 hover:bg-secondary/20">
                      <TableCell className="pl-6 font-medium text-sm">{row.module}</TableCell>
                      <TableCell className="text-center">
                        {row.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.consultor ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.cliente ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                      </TableCell>
                      <TableCell className="text-center pr-6">
                        {row.usuario_cliente ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Para usar lucide sin importarlo mal
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
