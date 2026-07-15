import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PROPERTY_TYPES = ["Apartment", "House", "Villa", "PG", "Room"];

const initialForm = {
  title: "",
  description: "",
  type: "Apartment",
  price: "",
  location: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  images: "",
};

export default function AddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.price || !form.location || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        images: form.images
          ? form.images.split(",").map((url) => url.trim()).filter(Boolean)
          : [],
      };
      await api.post("/properties", payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't create the listing. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: "640px" }}>
      <h2 className="mb-1">List a property</h2>
      <p className="text-muted mb-4">
        New listings are reviewed by an admin before they appear in search.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            placeholder="Sunny 2BHK near city center"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label">Type</label>
            <select
              name="type"
              className="form-select"
              value={form.type}
              onChange={handleChange}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label">Monthly rent (₹)</label>
            <input
              type="number"
              min="0"
              name="price"
              className="form-control"
              value={form.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label">Bedrooms</label>
            <input
              type="number"
              min="0"
              name="bedrooms"
              className="form-control"
              value={form.bedrooms}
              onChange={handleChange}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Bathrooms</label>
            <input
              type="number"
              min="0"
              name="bathrooms"
              className="form-control"
              value={form.bathrooms}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Location (city / area)</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Full address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Image URLs (comma-separated, optional)</label>
          <input
            type="text"
            name="images"
            className="form-control"
            value={form.images}
            onChange={handleChange}
            placeholder="https://..., https://..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-nf-primary w-100"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit listing"}
        </button>
      </form>
    </div>
  );
}
