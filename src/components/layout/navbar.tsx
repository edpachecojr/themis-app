"use client";

import { Menu, User } from "lucide-react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { LogoutButton } from "../logout-button";
import { authClient } from "@/lib/authentication/client";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, isPending: _isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-neutral-200 fixed w-full top-0 z-50 h-16">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Left side */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden mr-2 text-neutral-600 hover:text-primary-600"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="ml-2 text-lg sm:text-xl font-semibold text-neutral-800 hidden sm:block">
                Themis
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center border border-primary-200">
                    {user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name ?? "User"}
                        className="h-8 w-8 object-cover rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm text-neutral-800">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-neutral-200"
              >
                <DropdownMenuLabel className="text-neutral-800">
                  Minha Conta
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-200" />
                <DropdownMenuItem className="text-neutral-700 hover:text-primary-600 hover:bg-primary-50">
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="text-neutral-700 hover:text-primary-600 hover:bg-primary-50">
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem className="text-neutral-700 hover:text-primary-600 hover:bg-primary-50">
                  Ajuda
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-200" />
                <DropdownMenuItem
                  asChild
                  className="text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
                >
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
