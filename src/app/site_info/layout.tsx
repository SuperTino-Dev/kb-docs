import fs from "node:fs/promises";
import path from "node:path";
import DocsSidebar, { type MenuNode } from "../kb/DocsSidebar";
import MobileDocsNav from "../kb/MobileDocsNav";

const SITE_INFO_DIR = path.join(process.cwd(), "src/app/site_info");

function toTitleCase(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getMenuTree(): Promise<MenuNode[]> {
  const children = await collectNestedNodes(SITE_INFO_DIR, []);

  return [
    {
      key: "site-info-root",
      label: "Site Info",
      href: "/site_info",
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
    const hasPage = nestedEntries.some(
      (entry) => entry.isFile() && (entry.name === "page.mdx" || entry.name === "page.tsx"),
    );
    const children = await collectNestedNodes(nestedDir, nextSegments);
    const href = hasPage ? `/site_info/${nextSegments.join("/")}` : undefined;

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

export default async function SiteInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menu = await getMenuTree();
  const sidebarMenu = menu[0]?.key === "site-info-root" ? menu[0].children : menu;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,820px)] lg:px-8 2xl:grid-cols-[260px_minmax(0,820px)]">
        <MobileDocsNav menu={sidebarMenu} label="Site menu" />

        <aside className="hidden min-w-0 border-r pr-6 lg:block">
          <nav className="sticky top-8 text-sm">
            <DocsSidebar menu={sidebarMenu} />
          </nav>
        </aside>

        <article className="prose prose-gray min-w-0 max-w-[820px]">
          {children}
        </article>
      </div>
    </main>
  );
}
