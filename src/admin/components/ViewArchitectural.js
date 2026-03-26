import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBuilding,
  FaTrashAlt,
  FaEye,
  FaRegBuilding,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const d = (val) => val || "—";

// ── Pill badge ────────────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const palette = {
    residential: "bg-emerald-100 text-emerald-700",
    commercial: "bg-violet-100 text-violet-700",
    industrial: "bg-amber-100 text-amber-700",
  };
  const cls = palette[type?.toLowerCase()] ?? "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      {type || "Unknown"}
    </span>
  );
};

// ── Single info row ───────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-2.5 py-2 border-b border-slate-50 last:border-0">
    <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-sm text-slate-700 font-medium truncate">{value}</p>
    </div>
  </div>
);

// ── Project card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, onShowMore, onDelete, isDeleting }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Card header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <FaRegBuilding className="text-white" size={18} />
          </div>
          <TypeBadge type={project.projectType} />
        </div>
        <h3 className="font-bold text-white text-base leading-tight">
          {d(project.clientName)}
        </h3>
        <p className="text-slate-400 text-xs mt-1 truncate">
          📍 {d(project.siteAddress)}
        </p>
      </div>

      {/* Core details */}
      <div className="px-5 py-4 flex-1 space-y-0.5">
        <InfoRow
          icon="👤"
          label="Project Head"
          value={d(project.projectHead)}
        />
        <InfoRow icon="🏢" label="Lead Firm" value={d(project.leadFirm)} />
        <InfoRow
          icon="✏️"
          label="RCC Designer"
          value={d(project.rccDesignerName)}
        />
        <InfoRow icon="📧" label="Email" value={d(project.email)} />

        {/* Expandable section */}
        {expanded && (
          <>
            <InfoRow icon="🪪" label="PAN" value={d(project.Pan)} />
            <InfoRow icon="🪪" label="Aadhar" value={d(project.Aadhar)} />
            <InfoRow icon="📮" label="PIN Code" value={d(project.Pin)} />
            <InfoRow icon="🧾" label="GST No." value={d(project.gstNo)} />
          </>
        )}

        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-1 text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          {expanded ? "Show less ▲" : "Show more ▼"}
        </button>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={() => onShowMore(project._id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-blue-200"
        >
          <FaEye size={13} /> Full Details
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this project?"))
              onDelete(project._id);
          }}
          disabled={isDeleting === project._id}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
            isDeleting === project._id
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600"
          }`}
          title="Delete"
        >
          {isDeleting === project._id ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <FaTrashAlt size={13} />
          )}
        </button>
      </div>
    </div>
  );
};

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  from,
  to,
  total,
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
    <p className="text-xs text-slate-400">
      Showing {from}–{to} of {total} projects
    </p>
    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrentPage((p) => p - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }
        return (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
              currentPage === pageNum
                ? "bg-blue-500 text-white shadow-sm"
                : "border border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {pageNum}
          </button>
        );
      })}
      <button
        onClick={() => setCurrentPage((p) => p + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const ViewArchitecturalProject = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  const projectsPerPage = 6;
  const navigate = useNavigate();
  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/architecture/data`;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjectData(
        data.success
          ? Array.isArray(data.data)
            ? data.data
            : [data.data]
          : [],
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = useCallback(
    async (id) => {
      if (!id) return;

      setIsDeleting(id);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/architecture/upload/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete project");
        }

        // Update state immediately after successful deletion
        setProjectData((prevData) => {
          const newData = prevData.filter((p) => p._id !== id);
          return newData;
        });

        toast.success("Project deleted successfully!");

        // Adjust current page if needed
        const remainingProjects = projectData.filter(
          (p) => p._id !== id,
        ).length;
        const newTotalPages = Math.ceil(remainingProjects / projectsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else if (remainingProjects === 0) {
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Delete error:", err);
        toast.error(
          err.message || "Failed to delete project. Please try again.",
        );
        setError(err.message);
      } finally {
        setIsDeleting(null);
      }
    },
    [projectData, currentPage, projectsPerPage],
  );

  // Filter projects based on search term
  const filtered = projectData.filter(
    (p) =>
      p.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectHead?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.siteAddress?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / projectsPerPage));
  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ── Render states ───────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading projects…</p>
      </div>
    );

  if (error && !loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xl">
          ✕
        </div>
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FaBuilding size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Architectural Projects
            </h2>
            <p className="text-xs text-slate-400">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <FaSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
            size={13}
          />
          <input
            type="text"
            placeholder="Search by client name, project head, or address…"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Grid */}
      {current.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <FaRegBuilding size={36} className="opacity-30" />
          <p className="text-sm">No projects found.</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-500 text-sm hover:text-blue-600"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {current.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onShowMore={(id) => navigate(`/admin/shows/${id}`)}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          from={indexOfFirst + 1}
          to={Math.min(indexOfLast, filtered.length)}
          total={filtered.length}
        />
      )}
    </div>
  );
};

export default ViewArchitecturalProject;
