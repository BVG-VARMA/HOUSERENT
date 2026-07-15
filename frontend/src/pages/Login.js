import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Enter both your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't log you in. Check your credentials and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "440px" }}>
      <h2 className="mb-1">Log in</h2>
      <p className="text-muted mb-4">Welcome back — find your next place or manage your listings.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
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
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-nf-primary w-100"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
