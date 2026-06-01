import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import Monitoreo from "../pages/Monitoreo";

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
        </Route>

        {/* Error */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;