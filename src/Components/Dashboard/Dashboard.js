import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faPlus,
  faBuilding,
  faCouch,
  faSignOutAlt,
  faChevronRight,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import AddArchitecturalProject from "./AddArchitecturalProject";
import AddInteriorProject from "./AddInteriorProject";
import { useNavigate } from "react-router-dom";
import ViewArchitecturalProject from "./ViewArchitecturalProject";
import ViewInteriorProject from "./ViewInteriorProject";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NAV_ITEMS = [
  {
    key: "addButton",
    label: "Add Interior Project",
    icon: faCouch,
    description: "Submit a new interior project",
    group: "Add",
  },
  {
    key: "addReport",
    label: "Add Architectural Project",
    icon: faBuilding,
    description: "Submit a new architectural project",
    group: "Add",
  },
  {
    key: "viewReport",
    label: "Architectural Reports",
    icon: faEye,
    description: "Browse architectural projects",
    group: "View",
  },
  {
    key: "seeUsers",
    label: "Interior Reports",
    icon: faEye,
    description: "Browse interior projects",
    group: "View",
  },
];

const GROUPS = ["Add", "View"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("addButton");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      setActiveTab("addButton");
    }
  }, [isLoggedIn, navigate]);

  const logoutHandler = () => {
    const confirmDelete = window.confirm("Are you sure you want to logout?");
    if (!confirmDelete) return;
    window.localStorage.removeItem("authorization");
    navigate("/");
  };

  const activeItem = NAV_ITEMS.find((item) => item.key === activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case "addButton":
        return <AddInteriorProject />;
      case "addReport":
        return <AddArchitecturalProject />;
      case "viewReport":
        return <ViewArchitecturalProject />;
      case "seeUsers":
        return <ViewInteriorProject />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
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
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-md flex-shrink-0">
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
        <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-5">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
                {group}
              </p>
              <div className="space-y-1">
                {NAV_ITEMS.filter((item) => item.group === group).map(
                  ({ key, label, icon, description }) => {
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
                            ? "bg-indigo-500 shadow-lg shadow-indigo-500/30 text-white"
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
                          <p className="text-sm font-medium truncate">
                            {label}
                          </p>
                          <p
                            className={`text-xs truncate ${isActive ? "text-indigo-200" : "text-slate-500"}`}
                          >
                            {description}
                          </p>
                        </div>
                        {isActive && (
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="text-xs text-indigo-200 flex-shrink-0"
                          />
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
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

          {/* User avatar */}
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
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-full p-6">
            {renderContent()}
          </div>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
