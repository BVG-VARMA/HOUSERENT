import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import SearchFilter from "../components/SearchFilter";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ location: "", type: "", price: "" });

  const fetchProperties = async (activeFilters) => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (activeFilters.location) params.location = activeFilters.location;
      if (activeFilters.type) params.type = activeFilters.type;
      if (activeFilters.price) params.price = activeFilters.price;

      const res = await api.get("/properties", { params });
      setProperties(res.data);
    } catch (err) {
      setError("Couldn't load listings right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div>
      <div className="hero-search mb-4">
        <div className="container py-4 py-md-5">
          <p className="section-label text-light mb-2">Find your next home</p>
          <h1 className="text-light mb-4">Rent, without the runaround</h1>
          <SearchFilter onSearch={handleSearch} initialValues={filters} />
        </div>
      </div>

      <div className="container pb-5">
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border spinner-border-nf" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-5">
            <h5>No listings match your search yet</h5>
            <p className="text-muted">Try widening your filters or check back soon.</p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="row g-4">
            {properties.map((property) => (
              <div className="col-12 col-sm-6 col-lg-4" key={property._id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
