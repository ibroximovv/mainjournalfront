import { DashboardUserRouteList } from "@/hooks/paths"
import { Route, Routes } from "react-router-dom"

const UserDashboardRoute = () => {
  return (
    <Routes>
      {DashboardUserRouteList.map((route) => (
        <Route key={route.id} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}

export default UserDashboardRoute