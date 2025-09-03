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
    <div className="h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Layout principal usando grid para controle preciso */}
      <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] h-[calc(100vh-4rem)] mt-16">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Conteúdo principal */}
        <main className="relative overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300 hover:scrollbar-thumb-neutral-400 scrollbar-thumb-rounded-full">
            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-12 max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
