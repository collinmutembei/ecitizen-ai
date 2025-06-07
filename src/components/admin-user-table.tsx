import { useEffect, useState } from "react";

export default function AdminUserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setError("Failed to load users."));
  }, []);

  const handleDeactivate = async (userId) => {
    await fetch(`/api/admin/users/${userId}/deactivate`, { method: "POST" });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, deactivated: true } : u)));
  };

  const handleUpdateCredits = async (userId, credits) => {
    await fetch(`/api/admin/users/${userId}/credits`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits }),
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, credits } : u)));
  };

  if (loading) return <div className="text-blue-300 animate-pulse">Loading users...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">User Management</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="py-2">Email</th>
            <th className="py-2">Name</th>
            <th className="py-2">Credits</th>
            <th className="py-2">Subscribed</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200">
              <td className="py-2">{user.email}</td>
              <td className="py-2">{user.name}</td>
              <td className="py-2">
                <input
                  type="number"
                  className="bg-gray-800 text-gray-100 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  value={user.credits}
                  min={0}
                  onChange={(e) => handleUpdateCredits(user.id, Number(e.target.value))}
                />
              </td>
              <td className="py-2">{user.isSubscribed ? "Yes" : "No"}</td>
              <td className="py-2">{user.deactivated ? "Deactivated" : "Active"}</td>
              <td className="py-2">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2 transition-all duration-200"
                  onClick={() => handleDeactivate(user.id)}
                  disabled={user.deactivated}
                >
                  Deactivate
                </button>
                <a
                  href={`/admin/users/${user.id}/transactions`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all duration-200"
                >
                  Transactions
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
