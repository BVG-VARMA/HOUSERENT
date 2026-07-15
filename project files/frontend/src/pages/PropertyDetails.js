import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=900&q=60";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        setError("This listing couldn't be found. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }

    if (!moveInDate) {
      setBookingError("Choose a move-in date.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/bookings", {
        property: id,
        moveInDate,
        message,
      });
      setBookingSuccess("Your booking request has been sent to the owner.");
      setMessage("");
      setMoveInDate("");
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Couldn't send your booking request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border spinner-border-nf" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [FALLBACK_IMAGE];

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <img
            src={images[0]}
            alt={property.title}
            className="img-fluid rounded mb-3"
            style={{ width: "100%", height: "360px", objectFit: "cover" }}
          />
          {images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${property.title} ${idx + 2}`}
                  className="rounded"
                  style={{ width: "100px", height: "70px", objectFit: "cover" }}
                />
              ))}
            </div>
          )}

          <h2 className="mt-4 mb-1">{property.title}</h2>
          <p className="text-muted mb-3">
            {property.location} &middot; {property.type}
          </p>
          <div className="d-flex gap-4 mb-3">
            <span>{property.bedrooms} bedrooms</span>
            <span>{property.bathrooms} bathrooms</span>
          </div>
          <h5 className="mb-2">About this place</h5>
          <p style={{ whiteSpace: "pre-wrap" }}>{property.description}</p>
          <p className="text-muted small mb-0">{property.address}</p>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card card-nf p-4 sticky-top" style={{ top: "90px" }}>
            <p className="mb-1">
              <span className="fs-4 fw-semibold">₹{property.price?.toLocaleString()}</span>
              <span className="text-muted"> / month</span>
            </p>

            {!property.isAvailable && (
              <div className="alert alert-warning py-2 px-3 small">
                This property is currently unavailable.
              </div>
            )}

            {bookingSuccess && (
              <div className="alert alert-success py-2 px-3 small">{bookingSuccess}</div>
            )}
            {bookingError && (
              <div className="alert alert-danger py-2 px-3 small">{bookingError}</div>
            )}

            <form onSubmit={handleBooking}>
              <div className="mb-3">
                <label className="form-label">Move-in date</label>
                <input
                  type="date"
                  className="form-control"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  disabled={!property.isAvailable}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Message to owner (optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!property.isAvailable}
                />
              </div>
              <button
                type="submit"
                className="btn btn-nf-primary w-100"
                disabled={submitting || !property.isAvailable}
              >
                {submitting ? "Sending request..." : "Request to book"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
