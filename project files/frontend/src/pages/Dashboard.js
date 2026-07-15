import React, { useEffect, useState } from "react";
import api from "../api/axios";

const PROPERTY_TYPES = ["Apartment", "House", "Villa", "PG", "Room"];

function EditModal({ property, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: property.title,
    description: property.description,
    type: property.type,
    price: property.price,
    location: property.location,
    address: property.address,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    isAvailable: property.isAvailable,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put(`/properties/${property._id}`, {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(31,42,36,0.5)", zIndex: 1050 }}
    >
      <div className="card card-nf p-4" style={{ width: "90%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
        <h5 className="mb-3">Edit listing</h5>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <form onSubmit={handleSave}>
          <div className="mb-2">
            <label className="form-label small">Title</label>
            <input className="form-control" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label className="form-label small">Description</label>
            <textarea className="form-control" rows="3" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label small">Type</label>
              <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small">Rent (₹/mo)</label>
              <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} />
            </div>
          </div>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label small">Bedrooms</label>
              <input type="number" className="form-control" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
            </div>
            <div className="col-6">
              <label className="form-label small">Bathrooms</label>
              <input type="number" className="form-control" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
            </div>
          </div>
          <div className="mb-2">
            <label className="form-label small">Location</label>
            <input className="form-control" name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label small">Address</label>
            <input className="form-control" name="address" value={form.address} onChange={handleChange} />
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="isAvailable"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            <label className="form-check-label small" htmlFor="isAvailable">
              Available for booking
            </label>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-nf-primary flex-fill" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button type="button" className="btn btn-outline-secondary flex-fill" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState("");

  const fetchMine = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/properties/mine");
      setProperties(res.data);
    } catch (err) {
      setError("Couldn't load your listings right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const handleDelete = async (id) => {
    setActionError("");
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't delete this listing.");
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <h2 className="mb-1">My listings</h2>
      <p className="text-muted mb-4">Manage the properties you've posted.</p>

      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border spinner-border-nf" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && properties.length === 0 && (
        <div className="text-center py-5">
          <h5>You haven't listed anything yet</h5>
          <p className="text-muted">Post your first property to start receiving bookings.</p>
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Rent</th>
                <th>Status</th>
                <th>Available</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.location}</td>
                  <td>₹{p.price?.toLocaleString()}</td>
                  <td>
                    <span className={`status-pill status-${p.status}`}>{p.status}</span>
                  </td>
                  <td>{p.isAvailable ? "Yes" : "No"}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditModal
          property={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchMine();
          }}
        />
      )}
    </div>
  );
}
