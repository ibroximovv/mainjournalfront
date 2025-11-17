import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Bell, LogOut, User as UserIcon } from "lucide-react";
import AdminDashboardRoute from "@/routes/DashboardRoute/AdminDashboardRoute";
import SuperadminDashboardRoute from "@/routes/DashboardRoute/SuperadminDashboardRoute";
import UserDashboardRoute from "@/routes/DashboardRoute/UserDashboardRoute";

// shadcn components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DecodedToken {
  role?: "ADMIN" | "USER" | "SUPERADMIN";
  [key: string]: any;
}

function DashboardContent() {
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [notifCount, setNotifCount] = useState<number>(3);
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useSidebar();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setRole(decoded.role || decoded?.data?.role || null);
      } catch (err) {
        console.error("Token decode error:", err);
        setRole(null);
      }
    }
    setLoadingRole(false);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  }

  const renderRoutes = () => {
    switch (role) {
      case "ADMIN":
        return <AdminDashboardRoute />;
      case "SUPERADMIN":
        return <SuperadminDashboardRoute />;
      case "USER":
        return <UserDashboardRoute />;
      default:
        return (
          <div className="text-center mt-10 text-slate-400">
            {loadingRole ? "Loading..." : "No role found"}
          </div>
        );
    }
  };

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    return (
      <nav className="text-sm text-slate-500" aria-label="breadcrumb">
        <ol className="flex space-x-2">
          <li>
            <Link to="/" className="hover:underline text-slate-600">
              Home
            </Link>
          </li>
          {paths.map((segment, idx) => {
            const path = "/" + paths.slice(0, idx + 1).join("/");
            const isLast = idx === paths.length - 1;
            return (
              <li key={path} className="flex items-center">
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="text-slate-400 capitalize">{segment}</span>
                ) : (
                  <Link to={path} className="hover:underline capitalize">
                    {segment}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };

  return (
    <div className="flex bg-[#0f172a] h-screen w-full overflow-hidden">
      <AppSidebar />
      <main 
        className="flex-1 flex flex-col w-full transition-all duration-300"
        style={{ 
          marginLeft: open ? '0' : '0'
        }}
      >
        {/* Topbar */}
        <header className="bg-[#0f172a] border-b border-slate-700/50 px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            {/* left: sidebar trigger */}
            <div className="flex items-center">
              <SidebarTrigger className="text-slate-400 hover:bg-slate-700/50 cursor-pointer hover:text-white p-2 rounded-md duration-200">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
            </div>

            {/* center: breadcrumb */}
            <div className="flex-1 px-4">
              {generateBreadcrumbs()}
            </div>

            {/* right: notifications + avatar/logout */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative p-2 rounded-md hover:bg-slate-700/50 text-slate-300"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {notifCount > 0 && (
                      <Badge variant={'destructive'} className="absolute -top-1 -right-1">{notifCount}</Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <div className="divide-y">
                    <DropdownMenuItem className="flex flex-col text-sm">
                      <span className="font-medium">New comment on article</span>
                      <span className="text-xs text-slate-400">2 hours ago</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col text-sm">
                      <span className="font-medium">Author approved</span>
                      <span className="text-xs text-slate-400">1 day ago</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-center text-sm py-2">
                      <Button size="sm" variant="ghost" onClick={() => setNotifCount(0)}>
                        Mark all as read
                      </Button>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile dropdown (avatar + logout) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-700/50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/assets/avatar.jpg" alt="User" />
                      <AvatarFallback>
                        <UserIcon className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-white text-sm">Ilyosbek</span>
                      <span className="text-slate-400 text-xs">{role}</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-between" onClick={handleLogout}>
                    <span>Log out</span>
                    <LogOut className="w-4 h-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="p-6 bg-slate-50 flex-1 overflow-auto">{renderRoutes()}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardContent />
    </SidebarProvider>
  );
}