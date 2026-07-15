import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/bookings/mine");
      setBookings(res.data);
    } catch (err) {
      setError("Couldn't load your bookings right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    setActionError("");
    if (!window.confirm("Cancel this booking request?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't cancel this booking.");
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <h2 className="mb-1">My bookings</h2>
      <p className="text-muted mb-4">Track the requests you've sent to property owners.</p>

      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border spinner-border-nf" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-5">
          <h5>No bookings yet</h5>
          <p className="text-muted">Browse listings and request a move-in date to get started.</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="row g-3">
          {bookings.map((b) => (
            <div className="col-12" key={b._id}>
              <div className="card card-nf p-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <h5 className="mb-1">{b.property?.title || "Listing removed"}</h5>
                    <p className="text-muted small mb-1">
                      {b.property?.location}
                    </p>
                    <p className="small mb-0">
                      Move-in: {new Date(b.moveInDate).toLocaleDateString()}
                    </p>
                    {b.message && <p className="small text-muted mb-0">"{b.message}"</p>}
                  </div>
                  <div className="text-end">
                    <span className={`status-pill status-${b.status} d-inline-block mb-2`}>
                      {b.status}
                    </span>
                    <br />
                    {b.status === "pending" || b.status === "confirmed" ? (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleCancel(b._id)}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
