import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { DashboardAdminNavList, DashboardSuperadminNavList, DashboardUserNavList } from "@/hooks/paths";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./sidebar";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import rtulogo from '../../assets/rtu-logo.svg';

export function AppSidebar() {
  const [role, setRole] = useState<string | null>(null);
  const [navList, setNavList] = useState<any[]>([]);
  const { open } = useSidebar();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userRole = decoded.role || decoded?.data?.role;
        setRole(userRole);

        if (userRole === "ADMIN") setNavList(DashboardAdminNavList);
        else if (userRole === "SUPERADMIN") setNavList(DashboardSuperadminNavList);
        else if (userRole === "USER") setNavList(DashboardUserNavList);
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    }
  }, []);

  return (
    <Sidebar 
      className={`border-none fixed top-0 h-full z-50 transition-all duration-300` }
      collapsible="icon"
      style={{ width: open ? '' : '85px' }}
    >
      {/* Header */}
      <SidebarHeader className="!bg-[#0f172a] border-b border-slate-700/50">
        <div className="flex items-center gap-3 px-3 py-4">
          <img 
            src={rtulogo} 
            className="w-10 h-10 rounded-full object-cover border flex-shrink-0" 
            alt="rtu-logo" 
          />
          {open && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-semibold truncate">RTU-journal</span>
              <span className="text-slate-400 text-sm truncate">{role ?? "Loading..."}</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="!bg-[#0f172a] !text-white">
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="text-slate-400 text-sm font-medium px-3 py-2">
              Platforma
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navList.map((item) => (
                <SidebarMenuItem key={item.key} title={!open ? item.title : undefined}>
                  <SidebarMenuButton
                    className="py-2 px-3 text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-md transition-colors flex items-center gap-3"
                    asChild
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {open && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="!bg-[#0f172a] border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          {open && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-white text-sm font-medium truncate">RTU User</span>
              <span className="text-slate-400 text-xs truncate">{role}</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}