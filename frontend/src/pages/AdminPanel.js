import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminPanel() {
  const [tab, setTab] = useState("pending");
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchPending = async () => {
    const res = await api.get("/admin/properties/pending");
    setPending(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const loadTab = async (nextTab) => {
    setLoading(true);
    setError("");
    try {
      if (nextTab === "pending") {
        await fetchPending();
      } else {
        await fetchUsers();
      }
    } catch (err) {
      setError("Couldn't load this data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleApprove = async (id) => {
    setActionError("");
    try {
      await api.put(`/admin/properties/${id}/approve`);
      setPending((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't approve this listing.");
    }
  };

  const handleReject = async (id) => {
    setActionError("");
    try {
      await api.put(`/admin/properties/${id}/reject`);
      setPending((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't reject this listing.");
    }
  };

  const handleDeleteUser = async (id) => {
    setActionError("");
    if (!window.confirm("Remove this user? This can't be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't remove this user.");
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <h2 className="mb-1">Admin panel</h2>
      <p className="text-muted mb-4">Review new listings and manage user accounts.</p>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "pending" ? "active" : ""}`}
            onClick={() => setTab("pending")}
          >
            Pending listings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "users" ? "active" : ""}`}
            onClick={() => setTab("users")}
          >
            Users
          </button>
        </li>
      </ul>

      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border spinner-border-nf" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && tab === "pending" && (
        pending.length === 0 ? (
          <div className="text-center py-5">
            <h5>Nothing waiting for review</h5>
            <p className="text-muted">New listings will show up here.</p>
          </div>
        ) : (
          <div className="row g-3">
            {pending.map((p) => (
              <div className="col-12" key={p._id}>
                <div className="card card-nf p-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                      <h5 className="mb-1">{p.title}</h5>
                      <p className="text-muted small mb-1">
                        {p.location} &middot; {p.type} &middot; ₹{p.price?.toLocaleString()}/mo
                      </p>
                      <p className="small text-muted mb-0">
                        Listed by {p.owner?.name || "Unknown"} ({p.owner?.email})
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-nf-primary"
                        onClick={() => handleApprove(p._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleReject(p._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {!loading && !error && tab === "users" && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="text-capitalize">{u.role}</td>
                  <td className="text-end">
                    {u.role !== "admin" && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
