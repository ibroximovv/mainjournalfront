import { DashboardAdminRouteList } from "@/hooks/paths"
import { Route, Routes } from "react-router-dom"

const AdminDashboardRoute = () => {
  return (
    <Routes>
      {DashboardAdminRouteList.map((route) => (
        <Route key={route.id} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}

export default AdminDashboardRoute