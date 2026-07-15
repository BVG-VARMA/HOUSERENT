import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't create your account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "480px" }}>
      <h2 className="mb-1">Create an account</h2>
      <p className="text-muted mb-4">List properties or book a place to rent.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone (optional)</label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="row g-3 mb-4">
          <div className="col-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          <div className="col-6">
            <label className="form-label">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-nf-primary w-100"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
