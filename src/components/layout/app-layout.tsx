"use client";

import type React from "react";
import { useState } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        {/* Sidebar fixo para desktop, overlay para mobile */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Conteúdo principal com margem reduzida */}
        <main className="flex-1 overflow-y-auto transition-[margin,padding] duration-300 ease-in-out">
          <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-30 max-w mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
