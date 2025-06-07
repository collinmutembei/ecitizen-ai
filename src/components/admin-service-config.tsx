import { getUser } from "@workos-inc/authkit-nextjs";
import { useEffect, useState } from "react";

export default function AdminServiceConfig() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch(() => setError("Failed to load services."));
  }, []);

  const handlePriceChange = async (serviceName, newPrice) => {
    await fetch(`/api/admin/services/${serviceName}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creditsRequired: newPrice }),
    });
    setServices((prev) =>
      prev.map((s) =>
        s.name === serviceName ? { ...s, creditsRequired: newPrice } : s
      )
    );
  };

  if (loading) return <div className="text-blue-300 animate-pulse">Loading services...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">Service Pricing</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="py-2">Service</th>
            <th className="py-2">Credits Required</th>
            <th className="py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.name} className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200">
              <td className="py-2">{service.name}</td>
              <td className="py-2">
                <input
                  type="number"
                  className="bg-gray-800 text-gray-100 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  value={service.creditsRequired}
                  min={0}
                  onChange={(e) => handlePriceChange(service.name, Number(e.target.value))}
                />
              </td>
              <td className="py-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all duration-200"
                  onClick={() => handlePriceChange(service.name, service.creditsRequired)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
