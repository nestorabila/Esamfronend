import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f172a]">
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-0">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default MainLayout;