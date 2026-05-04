"use client";

import { useEffect, useRef, useState } from "react";

export default function CodeBlock({ children }: { children: React.ReactNode }) {
	const preRef = useRef<HTMLPreElement>(null);
	const timeoutRef = useRef<number | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	async function handleCopy() {
		const text = preRef.current?.innerText ?? "";
		if (!text) {
			return;
		}

		await navigator.clipboard.writeText(text);
		setCopied(true);

		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = window.setTimeout(() => {
			setCopied(false);
		}, 2000);
	}

	return (
		<div className="group relative mb-6">
			<pre
				ref={preRef}
				className="overflow-x-auto rounded-xl border border-[#e8e8e5] bg-[#f7f7f5] p-4 text-sm text-zinc-800"
			>
				{children}
			</pre>

			<button
				type="button"
				onClick={handleCopy}
				className="absolute right-3 top-3 rounded-md border border-[#dcdcd8] bg-white px-2.5 py-1 text-xs text-gray-600 opacity-0 transition group-hover:opacity-100 hover:bg-gray-50 hover:text-black"
				aria-label="Copy code"
			>
				{copied ? "Copied" : "Copy"}
			</button>
		</div>
	);
}
