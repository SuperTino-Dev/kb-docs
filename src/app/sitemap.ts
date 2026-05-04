import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const baseUrl = "https://kb.tu24x7.com";

function getRoutesFromAppDir(dir: string, routeBase = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Ignorar archivos y carpetas internas de Next.js
    if (
      !entry.isDirectory() ||
      entry.name.startsWith("_") ||
      entry.name.startsWith("(") ||
      entry.name === "api"
    ) {
      continue;
    }

    const routePath = `${routeBase}/${entry.name}`;
    const hasPage =
      fs.existsSync(path.join(fullPath, "page.tsx")) ||
      fs.existsSync(path.join(fullPath, "page.jsx")) ||
      fs.existsSync(path.join(fullPath, "page.md")) ||
      fs.existsSync(path.join(fullPath, "page.mdx"));

    if (hasPage) {
      routes.push(routePath);
    }

    routes = routes.concat(getRoutesFromAppDir(fullPath, routePath));
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), "src/app");

  const routes = [
    "", // homepage /
    ...getRoutesFromAppDir(appDir),
  ];

  const uniqueRoutes = Array.from(new Set(routes));

  return uniqueRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}