import React, { useState } from "react";

const PROPERTY_TYPES = ["Apartment", "House", "Villa", "PG", "Room"];

export default function SearchFilter({ onSearch, initialValues = {} }) {
  const [location, setLocation] = useState(initialValues.location || "");
  const [type, setType] = useState(initialValues.type || "");
  const [price, setPrice] = useState(initialValues.price || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ location, type, price });
  };

  const handleReset = () => {
    setLocation("");
    setType("");
    setPrice("");
    onSearch({ location: "", type: "", price: "" });
  };

  return (
    <form className="hero-search p-3 p-md-4 rounded" onSubmit={handleSubmit}>
      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-4">
          <label className="form-label text-light small mb-1">Location</label>
          <input
            type="text"
            className="form-control"
            placeholder="City or area"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label text-light small mb-1">Type</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Any</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label text-light small mb-1">
            Max monthly rent
          </label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-2 d-flex gap-2">
          <button type="submit" className="btn btn-nf-accent flex-fill">
            Search
          </button>
        </div>
      </div>
      {(location || type || price) && (
        <button
          type="button"
          className="btn btn-link btn-sm text-light mt-2 ps-0"
          onClick={handleReset}
        >
          Clear filters
        </button>
      )}
    </form>
  );
}
