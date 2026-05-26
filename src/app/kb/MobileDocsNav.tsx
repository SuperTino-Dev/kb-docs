"use client";

import { useId, useState, type MouseEvent } from "react";
import DocsSidebar, { type MenuNode } from "./DocsSidebar";

type MobileDocsNavProps = {
  menu: MenuNode[];
  label?: string;
};

export default function MobileDocsNav({
  menu,
  label = "Docs menu",
}: MobileDocsNavProps) {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);

  function closeAfterLinkClick(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) {
      setIsOpen(false);
    }
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 shadow-sm"
      >
        <span>{label}</span>
        <span className="text-lg leading-none text-gray-500" aria-hidden="true">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      {isOpen ? (
        <nav
          id={panelId}
          aria-label="Documentation navigation"
          onClick={closeAfterLinkClick}
          className="mt-3 max-h-[70vh] overflow-y-auto rounded-md border border-gray-200 bg-white p-4 text-sm shadow-sm"
        >
          <DocsSidebar menu={menu} />
        </nav>
      ) : null}
    </div>
  );
}
