"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type MenuNode = {
  key: string;
  label: string;
  href?: string;
  children: MenuNode[];
};

type DocsSidebarProps = {
  menu: MenuNode[];
};

function collectAncestorKeys(nodes: MenuNode[], pathname: string): string[] {
  const keys: string[] = [];

  function walk(items: MenuNode[], parents: string[]) {
    for (const item of items) {
      if (item.href === pathname) {
        keys.push(...parents);
      }

      if (item.children.length > 0) {
        walk(item.children, [...parents, item.key]);
      }
    }
  }

  walk(nodes, []);
  return Array.from(new Set(keys));
}

export default function DocsSidebar({ menu }: DocsSidebarProps) {
  const pathname = usePathname();

  const defaultExpanded = useMemo(() => {
    const keys = collectAncestorKeys(menu, pathname);
    for (const item of menu) {
      keys.push(item.key);
    }
    return Array.from(new Set(keys));
  }, [menu, pathname]);

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(defaultExpanded),
  );

  function toggle(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function renderNodes(nodes: MenuNode[], depth = 0): React.ReactNode {
    return nodes.map((node) => {
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedKeys.has(node.key);
      const isActive = node.href === pathname;

      return (
        <div key={node.key} className="space-y-1">
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${depth * 14}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggle(node.key)}
                className="flex h-5 w-5 items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-100 hover:text-black"
                aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
              >
                {isExpanded ? "-" : "+"}
              </button>
            ) : (
              <span className="block h-5 w-5" aria-hidden="true" />
            )}

            {node.href ? (
              <Link
                href={node.href}
                className={isActive ? "truncate font-semibold text-black" : "truncate text-gray-700 hover:text-black"}
              >
                {node.label}
              </Link>
            ) : (
              <span className="truncate text-gray-700">{node.label}</span>
            )}
          </div>

          {hasChildren && isExpanded ? (
            <div className="space-y-1">{renderNodes(node.children, depth + 1)}</div>
          ) : null}
        </div>
      );
    });
  }

  return <div className="space-y-1">{renderNodes(menu)}</div>;
}
