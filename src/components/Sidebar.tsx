import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiMonitor,
  FiGrid,
  FiChevronDown,
  FiBookOpen,
  FiAward,
  FiBriefcase,
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

  const sumatorias = [
    {
      name: "Suma Diplomado",
      path: "/app/sumardiplomado",
      icon: <FiBookOpen size={18} />,
    },
    {
      name: "Suma Maestría",
      path: "/app/sumarmaestria",
      icon: <FiAward size={18} />,
    },
    {
      name: "Suma Especialidad",
      path: "/app/sumarespecialidad",
      icon: <FiBriefcase size={18} />,
    },
  ];

  return (
    <aside
      className="
        w-[220px]
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
              <span
                className={`
                  ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-cyan-400"
                  }
                `}
              >
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* SUMATORIAS */}
        <div className="relative group">
          <button
            className="
              w-full
              flex
              items-center
              justify-between
              px-5
              py-4
              rounded-2xl
              text-gray-300
              font-semibold
              hover:bg-gray-800
              hover:text-cyan-400
              transition-all
              duration-300
            "
          >
            <div className="flex items-center gap-4">
              <FiGrid size={20} />
              <span>Sumatorias</span>
            </div>

            <FiChevronDown />
          </button>

          {/* Card desplegable */}
          <div
            className="
              hidden
              group-hover:flex
              flex-col
              gap-2
              mt-2
              bg-gray-900
              border
              border-gray-700
              rounded-2xl
              p-3
              shadow-2xl
              animate-in
            "
          >
            {sumatorias.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  text-gray-300
                  hover:bg-cyan-500
                  hover:text-white
                  transition-all
                  duration-300
                "
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-900 rounded-2xl p-4">
          <p className="text-cyan-400 font-bold">
            v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;