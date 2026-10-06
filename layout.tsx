"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  const { data: user, error } = useAsync(api.me);
  const router = useRouter();
  useEffect(() => { if (error?.status === 401) router.replace("/login"); }, [error, router]);
  if (!user) return <div className="p-10 text-sm text-muted">{error && error.status !== 401 ? error.message : "Loading…"}</div>;
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="min-w-0 flex-1 px-10 py-8">{children}</main>
    </div>
  );
}
