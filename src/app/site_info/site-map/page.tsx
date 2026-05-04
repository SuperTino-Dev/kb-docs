import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

type SiteRoute = {
  href: string;
  label: string;
};

const APP_DIR = path.join(process.cwd(), "src/app");

function isPublicSegment(name: string) {
  return !name.startsWith("_") && !name.startsWith("(") && !name.startsWith("@") && name !== "api";
}

function toLabelFromHref(href: string) {
  if (href === "/") return "Home";

  const parts = href
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .split("-")
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(" "),
    );

  return parts.join(" / ");
}

async function collectRoutes(currentDir: string, segments: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  const hasPage = entries.some(
    (entry) => entry.isFile() && (entry.name === "page.tsx" || entry.name === "page.mdx"),
  );

  const routes: string[] = [];
  if (hasPage) {
    routes.push(segments.length ? `/${segments.join("/")}` : "/");
  }

  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter(isPublicSegment)
    .sort((a, b) => a.localeCompare(b));

  for (const dir of dirs) {
    const childRoutes = await collectRoutes(path.join(currentDir, dir), [...segments, dir]);
    routes.push(...childRoutes);
  }

  return routes;
}

async function getSiteMap(): Promise<SiteRoute[]> {
  const hrefs = await collectRoutes(APP_DIR);

  return hrefs
    .filter((href) => href !== "/site_info/site-map")
    .sort((a, b) => a.localeCompare(b))
    .map((href) => ({
      href,
      label: toLabelFromHref(href),
    }));
}

export default async function SiteMapPage() {
  const routes = await getSiteMap();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-black">Site Map</h1>
      <p className="mt-2 text-sm text-gray-600">Dynamic list of public pages in this site.</p>

      <ul className="mt-8 space-y-3">
        {routes.map((route) => (
          <li key={route.href}>
            <Link href={route.href} className="text-sm text-gray-700 hover:text-black hover:underline">
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
