import {
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  UserPlus,
} from "lucide-react";

export const menuItems = [
  {
    id: "dashboard",
    name: "Início",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: "contacts",
    name: "Contatos",
    href: "/contacts",
    icon: Users,
  },

  {
    id: "analytics",
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    id: "records",
    name: "Prontuários",
    href: "/records",
    icon: FileText,
  },
  {
    id: "settings",
    name: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export const quickActions = [
  {
    id: "new-contact",
    name: "Novo Contato",
    href: "/contacts/new",
    icon: UserPlus,
  },
];
