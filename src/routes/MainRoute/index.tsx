import { Navigate } from "react-router-dom";
import AdminDashboardRoute from "../DashboardRoute/AdminDashboardRoute";
import UserDashboardRoute from "../DashboardRoute/UserDashboardRoute";
import SuperadminDashboardRoute from "../DashboardRoute/SuperadminDashboardRoute";

const MainRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "user";

  if (role === "ADMIN") return <AdminDashboardRoute />;
  if (role === "SUPERADMIN") return <SuperadminDashboardRoute />;
  if (role === "USER") return <UserDashboardRoute />;

  return <Navigate to="/auth/login" />;
};

export default MainRoute;
