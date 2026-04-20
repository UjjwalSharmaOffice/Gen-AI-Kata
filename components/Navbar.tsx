"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { ApiResponse, AuthSession } from "@/lib/types";

const links = [
  { href: "/", label: "Home" },
  { href: "/employee", label: "Employee" },
  { href: "/employee/new-request", label: "New Request" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/requests", label: "Requests" },
];

export function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const result = (await response.json()) as ApiResponse<AuthSession | null>;

        if (!active) {
          return;
        }

        setSession(result.data ?? null);
      } catch {
        if (active) {
          setSession(null);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Office Supply Management
          </Link>
          <p className="text-sm text-slate-500">Simple employee requests and admin approvals for demo day.</p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          {session ? (
            <div className="text-right text-xs text-slate-500">
              Signed in as <span className="font-semibold text-slate-700">{session.displayName}</span> ({session.role})
            </div>
          ) : null}
        <nav className="flex flex-wrap gap-2 lg:justify-end">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {session ? <LogoutButton /> : null}
        </nav>
        </div>
      </div>
    </header>
  );
}
