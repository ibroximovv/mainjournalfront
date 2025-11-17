import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminDashboardRoute from "@/routes/DashboardRoute/AdminDashboardRoute";

import UserDashboardRoute from "@/routes/DashboardRoute/UserDashboardRoute";
import SuperadminDashboardRoute from "./DashboardRoute/SuperadminDashboardRoute";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);
      setRole(user?.role);
      setLoading(false);
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("https://backendjournal.ilyosbekibroximov.uz/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        setRole(data?.role || null);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Checking authorization...
      </div>
    );
  }

  if (!role) return <Navigate to="/auth/login" />;

  if (role === "ADMIN") return <AdminDashboardRoute />;
  if (role === "SUPERADMIN") return <SuperadminDashboardRoute />;
  if (role === "USER") return <UserDashboardRoute />;

  return <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
