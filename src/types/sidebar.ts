export interface MenuItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarContextProps {
  isOpen: boolean;
  activeItem: string;
  setActiveItem: (id: string) => void;
  toggleSidebar: () => void;
}
