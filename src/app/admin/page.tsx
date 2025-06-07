"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@workos-inc/authkit-nextjs";
import AdminUserTable from "../../components/admin-user-table";
import AdminServiceConfig from "../../components/admin-service-config";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser({ ensureSignedIn: true }).then(({ user }) => {
      if (!user || user.role !== "admin") {
        router.replace("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-blue-300 animate-pulse">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-400 animate-fade-in">Admin Dashboard</h1>
      <section className="mb-12 animate-slide-in">
        <AdminServiceConfig />
      </section>
      <section className="animate-slide-in delay-200">
        <AdminUserTable />
      </section>
    </main>
  );
}
