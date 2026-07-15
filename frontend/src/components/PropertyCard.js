import React from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=600&q=60";

export default function PropertyCard({ property }) {
  const {
    _id,
    title,
    price,
    location,
    type,
    bedrooms,
    bathrooms,
    images,
    status,
  } = property;

  const coverImage = images && images.length > 0 ? images[0] : FALLBACK_IMAGE;

  return (
    <div className="card card-nf h-100">
      <img
        src={coverImage}
        alt={title}
        className="card-img-top"
        style={{ height: "180px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h5 className="card-title mb-0">{title}</h5>
          {status && status !== "approved" && (
            <span className={`status-pill status-${status}`}>{status}</span>
          )}
        </div>
        <p className="text-muted small mb-2">
          {location} &middot; {type}
        </p>
        <p className="mb-2">
          <span className="fw-semibold">₹{price?.toLocaleString()}</span>
          <span className="text-muted small"> / month</span>
        </p>
        <p className="text-muted small mb-3">
          {bedrooms} bed &middot; {bathrooms} bath
        </p>
        <Link
          to={`/properties/${_id}`}
          className="btn btn-nf-primary btn-sm mt-auto"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
