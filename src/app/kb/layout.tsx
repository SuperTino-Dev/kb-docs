import fs from "node:fs/promises";
import path from "node:path";
import DocsSidebar, { type MenuNode } from "./DocsSidebar";
import TableOfContents from "./TableOfContents";

const KB_DIR = path.join(process.cwd(), "src/app/kb");

function toTitleCase(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getMenuTree(): Promise<MenuNode[]> {
  const children = await collectNestedNodes(KB_DIR, []);

  return [
    {
      key: "kb-root",
      label: "KB",
      href: "/kb",
      children,
    },
  ];
}

async function collectNestedNodes(
  currentDir: string,
  segments: string[],
): Promise<MenuNode[]> {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("_") && !name.startsWith("(") && !name.startsWith("@"))
    .sort((a, b) => a.localeCompare(b));

  const nodes: MenuNode[] = [];

  for (const dir of dirs) {
    const nextSegments = [...segments, dir];
    const nestedDir = path.join(currentDir, dir);
    const nestedEntries = await fs.readdir(nestedDir, { withFileTypes: true });
    const hasPage = nestedEntries.some((entry) => entry.isFile() && entry.name === "page.mdx");
    const children = await collectNestedNodes(nestedDir, nextSegments);
    const href = hasPage ? `/kb/${nextSegments.join("/")}` : undefined;

    if (!href && children.length === 0) {
      continue;
    }

    nodes.push({
      key: nextSegments.join("/"),
      label: toTitleCase(dir),
      href,
      children,
    });
  }

  return nodes;
}

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menu = await getMenuTree();
  const sidebarMenu = menu[0]?.key === "kb-root" ? menu[0].children : menu;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[260px_1fr] xl:grid-cols-[260px_minmax(0,1fr)_220px]">
        <aside className="border-r pr-6">
          <nav className="sticky top-8 text-sm">
            <DocsSidebar menu={sidebarMenu} />
          </nav>
        </aside>

        <article className="prose prose-gray max-w-none" data-doc-article>
          {children}
        </article>

        <aside className="hidden xl:block">
          <TableOfContents />
        </aside>
      </div>
    </main>
  );
}
