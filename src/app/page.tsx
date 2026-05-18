import Link from "next/link";
import YouTube from "@/components/YouTube";

const topics = [
  {
    title: "Linux",
    desc: "Linux administration, nginx, Cloudflare and infrastructure.",
    href: "/kb/linux",
  },
  {
    title: "Oracle",
    desc: "Database, GoldenGate and related topics.",
    href: "/kb/oracle",
  },
  {
    title: "Security",
    desc: "Security best practices, hardening and SSL guides.",
    href: "/kb/security",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-18 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:gap-14">
          <div className="max-w-xl">
            <h1 className="max-w-[10ch] text-5xl font-bold leading-[0.95] text-zinc-950 md:text-6xl lg:text-7xl">
              Technical Knowledge Base.
            </h1>

            <p className="mt-6 max-w-[34ch] text-base leading-7 text-zinc-600 md:text-lg">
              Practical guides for Database, GoldenGate and others.
            </p>
          </div>

          <div className="w-full">
            <div className="[&>div]:my-0">
              <YouTube id="q5DJOAJ55LU" title="Technical Knowledge Base." />
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                href="/kb"
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Start reading
              </Link>
            </div>

            {/* <Link
              href="/docs/oracle-database/install-oracle-23ai"
              className="rounded-full border border-white/20 px-6 py-3 font-medium text-white"
            >
              Oracle install guide
            </Link>
            */}
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-16">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 transition hover:border-zinc-300 hover:bg-white hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-zinc-950">
                {topic.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {topic.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
