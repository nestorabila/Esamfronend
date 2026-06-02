import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import Monitoreo from "../pages/Monitoreo";
import SumarDiplomado from "../pages/sumardiplomado";
import SumarMaestria from "../pages/sumarmaestria";
import SumarEspecialidad from "../pages/sumarespecialidad";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Layout padre */}
        <Route path="/app" element={<MainLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="monitoreo" element={<Monitoreo />} />
          <Route path="sumardiplomado" element={<SumarDiplomado />} />
          <Route path="sumarmaestria" element={<SumarMaestria />} />
          <Route path="sumarespecialidad" element={<SumarEspecialidad />} />
        </Route>

        {/* Error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;