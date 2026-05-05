"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarNavProps {
  items: NavItem[];
}

export default function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1 w-full">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-primary-container text-white shadow-lg shadow-blue-600/20"
                  : "text-secondary hover:bg-surface-container hover:text-primary"
              }`}
            >
              <span className={`text-[22px] flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                {item.icon}
              </span>
              <span className="font-label-sm text-[14px] leading-relaxed">
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

