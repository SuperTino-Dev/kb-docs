"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type TocItem = {
  id: string;
  level: 2 | 3;
  text: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function uniqueSlug(baseSlug: string, usedSlugs: Set<string>) {
  const fallbackSlug = baseSlug || `section-${usedSlugs.size + 1}`;
  let slug = fallbackSlug;
  let count = 2;

  while (usedSlugs.has(slug)) {
    slug = `${fallbackSlug}-${count}`;
    count += 1;
  }

  usedSlugs.add(slug);
  return slug;
}

export default function TableOfContents() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    let canceled = false;

    function updateItems(nextItems: TocItem[]) {
      queueMicrotask(() => {
        if (!canceled) {
          setItems(nextItems);
        }
      });
    }

    const article = document.querySelector<HTMLElement>("[data-doc-article]");

    if (!article) {
      updateItems([]);
      return () => {
        canceled = true;
      };
    }

    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2, h3"),
    );
    const usedSlugs = new Set<string>();

    const nextItems = headings
      .map((heading) => {
        const text = heading.textContent?.trim() ?? "";

        if (!text) {
          return null;
        }

        const existingId = heading.id.trim();
        const id = existingId || uniqueSlug(slugify(text), usedSlugs);

        if (existingId) {
          usedSlugs.add(existingId);
        } else {
          heading.id = id;
        }

        return {
          id,
          level: heading.tagName === "H3" ? 3 : 2,
          text,
        } satisfies TocItem;
      })
      .filter((item): item is TocItem => item !== null);

    updateItems(nextItems);

    return () => {
      canceled = true;
    };
  }, [pathname]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="doc-toc" aria-label="Table of contents">
      <p className="doc-toc__title">On this page</p>
      <ol className="doc-toc__list">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "doc-toc__item doc-toc__item--nested" : "doc-toc__item"}
          >
            <a className="doc-toc__link" href={`#${item.id}`}>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
