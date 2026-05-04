import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

type FooterLink = {
	label: string;
	href: string;
};

const SITE_INFO_DIR = path.join(process.cwd(), "src/app/site_info");

function toTitleCase(slug: string) {
	return slug
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

async function getFooterLinks(): Promise<FooterLink[]> {
	const entries = await fs.readdir(SITE_INFO_DIR, { withFileTypes: true });

	return entries
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.filter((name) => !name.startsWith("_") && !name.startsWith("(") && !name.startsWith("@"))
		.sort((a, b) => a.localeCompare(b))
		.map((dir) => ({
			label: toTitleCase(dir),
			href: `/site_info/${dir}`,
		}));
}

export default async function SiteFooter() {
	const links = await getFooterLinks();

	return (
		<footer className="border-t border-gray-200 bg-white">
			<div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-5 text-center">
				<nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-600">
					{links.map((link) => (
						<Link key={link.href} href={link.href} className="hover:text-black">
							{link.label}
						</Link>
					))}
				</nav>

				<p className="text-xs text-gray-400">
					This is an independent technical knowledge base and is not affiliated with any Corporation.
				</p>
			</div>
		</footer>
	);
}
