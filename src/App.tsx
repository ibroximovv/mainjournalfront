import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { MainRouteList } from "@/hooks/paths";
import HomeLayout from "@/layout/HomeLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import SmoothLoader from "./modules/Loader";
import { Toaster } from "sonner";


function App() {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Tokenni tekshirish
    const token = localStorage.getItem("token");
    setHasToken(!!token);

    // 2.5 sekundli loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SmoothLoader />;

  return (
    <div style={{ fontFamily: 'SourceSerif4, serif' }}>
      <Toaster richColors />
      {hasToken ? (
        <DashboardLayout />
      ) : (
        <HomeLayout>
          <Routes>
            {MainRouteList.map((route) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
          </Routes>
        </HomeLayout>
      )}
    </div>
  );
}

export default App;
