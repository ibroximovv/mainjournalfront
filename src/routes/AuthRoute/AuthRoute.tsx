import { Paths } from "@/hooks/paths"
import AuthLogin from "@/pages/Auth/AuthLogin"
import AuthRegister from "@/pages/Auth/AuthRegister"
import { Route, Routes } from "react-router-dom"

const AuthRoute = () => {
  return (
    <Routes>
        <Route path={Paths.login} element={<AuthLogin />} />
        <Route path={Paths.register} element={<AuthRegister />} />
    </Routes>
  )
}

export default AuthRoute