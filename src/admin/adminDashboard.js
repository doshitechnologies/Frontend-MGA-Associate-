import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUsers,
  faBuilding,
  faCouch,
  faSignOutAlt,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ViewArchitecturalProject from "./components/ViewArchitectural";
import ViewInteriorProject from "./components/ViewInterior";
import ViewUsers from "./components/ViewUser";
import { useAdmin } from "../context/AdminContext";

const NAV_ITEMS = [
  {
    key: "viewData",
    label: "View Users",
    icon: faUsers,
    description: "Manage registered users",
  },
  {
    key: "viewReport",
    label: "Architectural Reports",
    icon: faBuilding,
    description: "Browse architectural projects",
  },
  {
    key: "seeUsers",
    label: "Interior Reports",
    icon: faCouch,
    description: "Browse interior projects",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("viewData");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const activeItem = NAV_ITEMS.find((item) => item.key === activeTab);

  const logoutHandler = () => {
    const confirmDelete = window.confirm("Are you sure you want to logout?");
    if (!confirmDelete) return;
    window.sessionStorage.removeItem("authorizationadmin");
    navigate("/adminlogin");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "viewData":
        return <ViewUsers />;
      case "viewReport":
        return <ViewArchitecturalProject />;
      case "seeUsers":
        return <ViewInteriorProject />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-10 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">
            Access Denied
          </h2>
          <p className="text-slate-400 text-sm">
            You do not have admin privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          w-72 bg-gradient-to-b from-slate-900 to-slate-800
          flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="px-6 py-7 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">MG</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Mayur Gandhi
              </p>
              <p className="text-slate-400 text-xs">& Associates</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>
          {NAV_ITEMS.map(({ key, label, icon, description }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left
                  transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-blue-500 shadow-lg shadow-blue-500/30 text-white"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <div
                  className={`
                  w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                  ${isActive ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"}
                `}
                >
                  <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{label}</p>
                  <p
                    className={`text-xs truncate ${isActive ? "text-blue-200" : "text-slate-500"}`}
                  >
                    {description}
                  </p>
                </div>
                {isActive && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-xs text-blue-200 flex-shrink-0"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 border-t border-white/10 pt-4">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-all">
              <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shadow-sm">
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-800">
              {activeItem?.label ?? "Dashboard"}
            </h1>
            <p className="text-xs text-slate-400">{activeItem?.description}</p>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow">
            <span className="text-white font-semibold text-sm">Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-full p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
