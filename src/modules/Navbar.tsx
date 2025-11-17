import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import logo from "@/assets/rtu-logo.svg";
import { Link } from "react-router-dom";

type NavLink = {
  name: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { name: "HOME", href: "/" },
  { name: "CONTACT", href: "/contact" },
  { name: "ARTICLE", href: "/article" },
  { name: "ABOUT", href: "/about" },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <nav className="w-full bg-[#133654] text-[#eaf1fb] shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center text-lg font-bold shadow-md"
            >
              <img src={logo} alt="RTU Logo" className="w-full h-full rounded-full border border-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold tracking-wide">RTU JOURNAL</h1>
              <p className="text-xs text-blue-200">
                Ilmiy nashrlar va tadqiqotlar markazi
              </p>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative text-sm font-medium tracking-wide after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-blue-400 hover:after:w-full after:transition-all hover:text-blue-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <input
                placeholder="Qidirish..."
                className="px-3 py-1.5 rounded-md bg-[#133654] border border-[#2a6fa3] text-sm text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Link to="/auth/login">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-[#1d4b73]/70 hover:shadow-[0_0_10px_#3b82f6] hover:text-white"
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/auth/register">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-[0_0_10px_#3b82f6]"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none hover:scale-105 transition-transform">
                    <Avatar>
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
                        I
                      </div>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-[#133654] shadow-md border-none">
                  <DropdownMenuItem>Profil</DropdownMenuItem>
                  <DropdownMenuItem>Sozlamalar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>
                    Chiqish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-[#1d4b73]/60"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="md:hidden bg-[#133654]/95 overflow-hidden border-t border-[#1d4b73]"
      >
        <div className="px-5 pt-3 pb-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-blue-100 hover:text-white border-b border-[#1d4b73]/40"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-3 border-t border-[#1d4b73]">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <a href="/signin">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-[0_0_8px_#3b82f6]">
                    Kirish
                  </Button>
                </a>
                <a href="/register">
                  <Button
                    variant="outline"
                    className="w-full border-blue-400 text-blue-300 hover:bg-blue-600/10"
                  >
                    Ro‘yxatdan o‘tish
                  </Button>
                </a>
              </div>
            ) : (
              <div className="space-y-2 text-blue-100">
                <a href="/profile" className="block py-1">
                  Profil
                </a>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="block py-1"
                >
                  Chiqish
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
