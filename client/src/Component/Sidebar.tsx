import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: "home", label: "Home" },
  { to: "/OST", icon: "library_music", label: "Library" },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-50 bg-white/40 backdrop-blur-2xl w-48 border-r border-white/40">
      {/* Logo */}
      <div className="p-6">
        <img
          alt="Blue Archive Music Logo"
          className="w-full h-auto drop-shadow-md"
          src="/blue_archivemusic_symbolon.png.png"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col items-center flex-1 overflow-y-auto custom-scrollbar px-4 pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `ba-sidebar-button ${isActive ? "active" : "text-slate-500"}`
            }
          >
            <span className="material-symbols-outlined mb-2 text-3xl">
              {item.icon}
            </span>
            <span className="font-bold tracking-tighter uppercase text-[10px]">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* User Info Footer — TODO: re-enable when login/profile feature is finalized */}
      {/* <div className="p-4 border-t border-white/20 mt-auto bg-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-sky-400/50 p-0.5">
            <div className="w-full h-full rounded-full bg-sky-400/20 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-sky-400 text-lg"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                account_circle
              </span>
            </div>
          </div>
          <div>
            <div className="font-bold text-[8px] text-slate-800 uppercase tracking-tighter">
              OPERATOR_01
            </div>
            <div className="text-[6px] text-sky-600 tracking-widest animate-pulse font-bold">
              SYSTEM_ACTIVE
            </div>
          </div>
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;
