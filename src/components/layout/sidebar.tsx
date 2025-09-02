"use client";

import {
  Users,
  X,
  Home,
  Settings,
  UserPlus,
  CreditCard,
  Construction,
} from "lucide-react";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { cn } from "../../lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
}

// Páginas que estão em construção
const pagesUnderConstruction = [
  "/records",
  "/analytics",
  "/settings",
  "/subscription",
];

const navigation = [
  { name: "Início", href: "/dashboard", icon: Home },
  { name: "Contatos", href: "/contacts", icon: Users },
  // { name: "Atendimentos", href: "/encounters", icon: Stethoscope },
  // { name: "Notificações", href: "/notifications", icon: Bell },
  // { name: "Prontuários", href: "/records", icon: FileText },
  // { name: "Relatórios", href: "/analytics", icon: Activity },
];

const administration = [
  { name: "Configurações", href: "/settings", icon: Settings },
  { name: "Assinatura", href: "/subscription", icon: CreditCard },
];

const quickActions = [
  { name: "Novo Contato", href: "/contacts/new", icon: UserPlus },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-16 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:top-16 lg:z-auto border-r border-neutral-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {/* Mobile close button */}
            <div className="flex justify-end mb-4 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-neutral-600 hover:text-primary-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1 mb-6">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
                Ações Rápidas
              </h3>
              {quickActions.map((item) => {
                const LinkIcon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-left transition-all duration-200 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    <LinkIcon className="mr-3 h-4 w-4 flex-shrink-0 text-neutral-400 group-hover:text-primary-500" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Main Navigation */}
            <div className="space-y-1 mb-6">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
                Navegação
              </h3>
              {navigation.map((item) => {
                const LinkIcon = item.icon;
                const isUnderConstruction = pagesUnderConstruction.includes(
                  item.href
                );
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full text-left transition-all duration-200 relative",
                      pathname === item.href
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-500 shadow-sm"
                        : "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                    )}
                  >
                    <LinkIcon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                        pathname === item.href
                          ? "text-primary-600"
                          : "text-neutral-400 group-hover:text-primary-500"
                      )}
                    />
                    <span className="truncate flex-1">{item.name}</span>
                    {isUnderConstruction && (
                      <Badge variant="warning" className="ml-2 p-1 shrink-0">
                        <Construction className="h-3 w-3" />
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Administration */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
                Administração
              </h3>
              {administration.map((item) => {
                const LinkIcon = item.icon;
                const isUnderConstruction = pagesUnderConstruction.includes(
                  item.href
                );
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full text-left transition-all duration-200 relative",
                      pathname === item.href
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-500 shadow-sm"
                        : "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                    )}
                  >
                    <LinkIcon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                        pathname === item.href
                          ? "text-primary-600"
                          : "text-neutral-400 group-hover:text-primary-500"
                      )}
                    />
                    <span className="truncate flex-1">{item.name}</span>
                    {isUnderConstruction && (
                      <Badge variant="warning" className="ml-2 p-1 shrink-0">
                        <Construction className="h-3 w-3" />
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 bg-gradient-to-r from-neutral-50 to-neutral-100">
            <div className="text-xs text-neutral-600 text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-4 w-4 rounded bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">T</span>
                </div>
                <span className="font-semibold text-neutral-800">Themis</span>
              </div>
              <p className="text-neutral-500">v0.0.1-alpha</p>
              <div className="flex items-center justify-center space-x-1 text-neutral-400">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs">Sistema Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
