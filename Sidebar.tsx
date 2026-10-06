"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api, type User } from "@/lib/api";

const LIVE = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agents", label: "AI Agents" },
  { href: "/settings", label: "Settings" },
];
const PLANNED: [string, number][] = [
  ["Documents", 2], ["Knowledge Base", 2], ["Somali Language", 3], ["Research", 4], ["News Monitor", 4],
  ["Sources", 4], ["Articles", 6], ["Editorial", 6], ["Social Media", 7], ["Website", 7], ["Content Calendar", 7],
];

export function Sidebar({ user }: { user: User }) {
  const path = usePathname();
  const router = useRouter();
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-rule bg-surface px-4 py-6">
      <div className="font-serif text-lg leading-tight">Somali AI<br />Media Desk</div>
      <nav className="mt-8 flex flex-col gap-1 text-sm" aria-label="Sections">
        {LIVE.map((l) => (
          <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}
            className={`rounded-sm px-2 py-1.5 ${path === l.href ? "bg-sea/10 font-medium text-sea" : "hover:bg-sea/5"}`}>
            {l.label}
          </Link>
        ))}
        <div className="mt-6 border-t border-rule pt-3 text-xs text-muted">Coming in later phases</div>
        {PLANNED.map(([name, phase]) => (
          <div key={name} className="flex justify-between px-2 py-1 text-muted/80">
            <span>{name}</span><span className="text-xs">P{phase}</span>
          </div>
        ))}
      </nav>
      <div className="mt-auto border-t border-rule pt-4 text-sm">
        <div className="truncate font-medium">{user.full_name}</div>
        <div className="text-xs text-muted">{user.role}</div>
        <button className="btn-quiet mt-3" onClick={async () => { await api.logout(); router.push("/login"); }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
