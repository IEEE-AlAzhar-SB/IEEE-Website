import { Link } from "react-router-dom";
import { LuShieldCheck, LuMessageSquare, LuFileText } from "react-icons/lu";
import { FiLogOut, FiUsers, FiX } from "react-icons/fi";

interface SideBarContentProps {
  sideBarOnclick: () => void;
  handleLogOut: () => void;
}

const SidebarContent = ({
  sideBarOnclick,
  handleLogOut,
}: SideBarContentProps) => (
  <div className="flex flex-col h-full justify-between">
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/15 p-2 rounded-lg">
            <LuShieldCheck className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight text-white">
              IEEE Al-Azhar
            </h2>
            <span className="text-xs text-white/80">Admin Panel</span>
          </div>
        </div>
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={sideBarOnclick}
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="space-y-2">
        <Link
          to="/dashboard"
          onClick={sideBarOnclick}
          className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl text-sm transition border ${
            location.pathname === "/dashboard" ||
            location.pathname === "/dashboard/"
              ? "bg-white text-[#05568D] border-transparent"
              : "text-white/70 hover:bg-white/10 border-transparent"
          }`}
        >
          <FiUsers size={18} /> Board Members
        </Link>
        <Link
          to="/dashboard/feedback"
          onClick={sideBarOnclick}
          className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl text-sm transition border ${
            location.pathname === "/dashboard/feedback"
              ? "bg-white text-[#05568D] border-transparent"
              : "text-white/70 hover:bg-white/10 border-transparent"
          }`}
        >
          <LuMessageSquare size={18} /> Feedback
        </Link>
        <Link
          to="/dashboard/forms"
          onClick={sideBarOnclick}
          className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl text-sm transition border ${
            location.pathname === "/dashboard/forms" ||
            location.pathname.startsWith("/dashboard/forms/")
              ? "bg-white text-[#05568D] border-transparent"
              : "text-white/70 hover:bg-white/10 border-transparent"
          }`}
        >
          <LuFileText size={18} /> Forms
        </Link>
      </nav>
    </div>

    <button
      onClick={handleLogOut}
      className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition w-full mt-auto"
    >
      <FiLogOut size={18} /> Logout
    </button>
  </div>
);

export default SidebarContent;
