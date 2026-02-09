"use client";

import { useState } from "react";

export default function SidebarLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-controls="default-sidebar"
        type="button"
        className="text-heading bg-transparent border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>

        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M5 7h14M5 12h14M5 17h10"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                  {item.icon}
                  <span className="ms-3 flex-1 whitespace-nowrap">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  )}

                  {item.notification && (
                    <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-fg-danger-strong bg-danger-soft border border-danger-subtle rounded-full">
                      {item.notification}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 sm:ml-64">
        <div className="p-4 border border-default border-dashed rounded-base">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} />
            ))}
          </div>

          <BigCard />

          <div className="grid grid-cols-2 gap-4 mb-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} />
            ))}
          </div>

          <BigCard />

          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function Card() {
  return (
    <div className="flex items-center justify-center h-24 rounded-base bg-neutral-secondary-soft">
      <svg
        className="w-5 h-5 text-fg-disabled"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 12h14m-7 7V5"
        />
      </svg>
    </div>
  );
}

function BigCard() {
  return (
    <div className="flex items-center justify-center h-48 rounded-base bg-neutral-secondary-soft mb-4">
      <svg
        className="w-5 h-5 text-fg-disabled"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 12h14m-7 7V5"
        />
      </svg>
    </div>
  );
}

/* ---------------- Menu Data ---------------- */

const menuItems = [
  {
    label: "Dashboard",
    icon: <Icon />,
  },
  {
    label: "Kanban",
    badge: "Pro",
    icon: <Icon />,
  },
  {
    label: "Inbox",
    notification: "2",
    icon: <Icon />,
  },
  {
    label: "Users",
    icon: <Icon />,
  },
  {
    label: "Products",
    icon: <Icon />,
  },
  {
    label: "Sign In",
    icon: <Icon />,
  },
];

function Icon() {
  return (
    <svg
      className="w-5 h-5 transition duration-75 group-hover:text-fg-brand"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14"
      />
    </svg>
  );
}
