import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSearch, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Avatar = ({ name }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = [
    "from-blue-400 to-indigo-500",
    "from-emerald-400 to-teal-500",
    "from-violet-400 to-purple-500",
    "from-rose-400 to-pink-500",
    "from-amber-400 to-orange-500",
  ];
  const color = colors[name?.charCodeAt(0) % colors.length];
  return (
    <div
      className={`h-10 w-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow`}
    >
      {initials}
    </div>
  );
};

const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
    {children}
  </span>
);

const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const InputField = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300"
    />
  </div>
);

const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
    <span className="text-lg mt-0.5 flex-shrink-0">{icon}</span>
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-slate-700 font-medium mt-0.5">
        {value || "—"}
      </p>
    </div>
  </div>
);

const ViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const usersPerPage = 5;
  const token = window.sessionStorage.getItem("authorization");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "${process.env.REACT_APP_BACKEND_URL}/api/auth/users",
        {
          method: "GET",
        },
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, navigate]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData(user);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/users/${editingUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        },
      );
      if (!response.ok) throw new Error("Failed to update user");
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? editFormData : u)),
      );
      showToast("User updated successfully!");
      setEditingUser(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/users/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) {
        const d = await response.json();
        throw new Error(d.message || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (currentUsers.length === 1 && currentPage > 1)
        setCurrentPage((p) => p - 1);
      showToast("User deleted successfully!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading users…</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xl">
          ✕
        </div>
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
        >
          <span>{toast.type === "error" ? "⚠️" : "✅"}</span>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <FaUsers size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Users</h2>
            <p className="text-xs text-slate-400">
              {filteredUsers.length} total registered
            </p>
          </div>
        </div>
        <div className="relative max-w-xs w-full">
          <FaSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
            size={13}
          />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300 bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                Contact
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                Address
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {currentUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-16 text-center text-slate-400 text-sm"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {user.dob
                            ? new Date(user.dob).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {user.phone || "No phone"}
                    </p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-sm text-slate-600 max-w-[200px] truncate">
                      {user.address || "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        title="View"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                      >
                        <FaEye size={15} />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        title="Edit"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                      >
                        <FaEdit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        title="Delete"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing {indexOfFirst + 1}–
            {Math.min(indexOfLast, filteredUsers.length)} of{" "}
            {filteredUsers.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${currentPage === page ? "bg-blue-500 text-white shadow-sm" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedUser && (
        <Modal title="User Details" onClose={() => setSelectedUser(null)}>
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
            <Avatar name={selectedUser.name} />
            <div>
              <p className="font-bold text-slate-800">{selectedUser.name}</p>
              <Badge>{selectedUser.email}</Badge>
            </div>
          </div>
          <DetailRow
            icon="🎂"
            label="Date of Birth"
            value={
              selectedUser.dob
                ? new Date(selectedUser.dob).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : null
            }
          />
          <DetailRow icon="📞" label="Phone" value={selectedUser.phone} />
          <DetailRow
            icon="👨‍👩‍👧"
            label="Family Phone"
            value={selectedUser.familyPhoneNumber}
          />
          <DetailRow icon="📍" label="Address" value={selectedUser.address} />
          <button
            className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
            onClick={() => setSelectedUser(null)}
          >
            Close
          </button>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <Modal title="Edit User" onClose={() => setEditingUser(null)}>
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={editFormData.name || ""}
            onChange={handleEditChange}
            placeholder="Enter name"
          />
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={editFormData.email || ""}
            onChange={handleEditChange}
            placeholder="Enter email"
          />
          <InputField
            label="Date of Birth"
            type="date"
            name="dob"
            value={
              editFormData.dob
                ? new Date(editFormData.dob).toISOString().split("T")[0]
                : ""
            }
            onChange={handleEditChange}
          />
          <InputField
            label="Phone Number"
            type="text"
            name="phone"
            value={editFormData.phone || ""}
            onChange={handleEditChange}
            placeholder="Enter phone"
          />
          <InputField
            label="Family Phone Number"
            type="text"
            name="familyPhoneNumber"
            value={editFormData.familyPhoneNumber || ""}
            onChange={handleEditChange}
            placeholder="Enter family phone"
          />
          <InputField
            label="Address"
            type="text"
            name="address"
            value={editFormData.address || ""}
            onChange={handleEditChange}
            placeholder="Enter address"
          />
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleEditSubmit}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewUsers;
