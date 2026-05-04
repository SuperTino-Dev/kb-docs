import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

type HeaderLink = {
	label: string;
	href: string;
};

const KB_DIR = path.join(process.cwd(), "src/app/kb");

function toTitleCase(slug: string) {
	return slug
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

async function getHeaderLinks(): Promise<HeaderLink[]> {
	const entries = await fs.readdir(KB_DIR, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.filter((name) => !name.startsWith("_") && !name.startsWith("(") && !name.startsWith("@"))
		.sort((a, b) => a.localeCompare(b))
		.map((dir) => ({ label: toTitleCase(dir), href: `/kb/${dir}` }));
}

export default async function SiteHeader() {
	const links = await getHeaderLinks();

	return (
		<header className="border-b border-gray-200 bg-white">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
				<div className="flex flex-col">
					<Link href="/" className="text-2xl font-bold leading-none text-black">
						TU24x7
					</Link>
					<span className="mt-1 text-sm text-gray-500">Technical Knowledge Base</span>
				</div>

				<nav className="flex gap-6 text-sm text-gray-600">
					{links.map((link) => (
						<Link key={link.href} href={link.href} className="hover:text-black">
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
}
