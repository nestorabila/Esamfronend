import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiMonitor,
  FiGrid,
} from "react-icons/fi";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Programas",
      path: "/app/home",
      icon: <FiHome size={20} />,
    },
    {
      name: "Monitoreo",
      path: "/app/monitoreo",
      icon: <FiMonitor size={20} />,
    },
  ];

  return (
    <aside
  className="
    w-[160px]
    h-screen
    bg-gradient-to-b
    from-gray-950
    via-gray-900
    to-black
    text-white
    shadow-2xl
    border-r
    border-gray-800
    flex
    flex-col
    flex-shrink-0
  "
>
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          
          {/* Logo */}
          <div
            className="
              bg-cyan-500
              p-3
              rounded-2xl
              shadow-lg
              shadow-cyan-500/30
            "
          >
            <FiGrid size={24} />
          </div>

          {/* Texto */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">
            ESAM
            </h1>

            <p className="text-sm text-gray-400">
              System
            </p>
          </div>
        </div>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group
                flex
                items-center
                gap-4
                px-5
                py-4
                rounded-2xl
                transition-all
                duration-300
                font-semibold
                text-[15px]
                hover:scale-[1.02]
                ${
                  active
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    : "text-gray-300 hover:bg-gray-800 hover:text-cyan-400"
                }
              `}
            >
              {/* Icono */}
              <span
                className={`
                  transition-all
                  duration-300
                  ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-cyan-400"
                  }
                `}
              >
                {item.icon}
              </span>

              {/* Texto */}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-900 rounded-2xl p-4">
          <p className="text-sm text-gray-400">
           
          </p>

          <p className="text-cyan-400 font-bold mt-2">
            v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;