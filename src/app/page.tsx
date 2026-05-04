import Link from "next/link";

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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex max-w-5xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          {/*<p className="mb-4 text-sm text-gray-400">
            Oracle Knowledge Base
          </p>*/}

          <div className="max-w-2xl space-y-6">
            <h1 className="max-w-[12ch] text-3xl font-bold leading-[1] tracking-[-0.02em] [text-wrap:balance] md:text-5xl">
              Technical Knowledge Base.
            </h1>

            <p className="max-w-[36ch] text-base text-gray-600 md:text-lg">
              Practical guides for Database, GoldenGate and others.
            </p>
          </div>

          <div className="md:shrink-0">
            <Link
              href="/kb"
              className="rounded-full bg-black px-6 py-3 font-medium text-white"
            >
              Start reading
            </Link>

            {/* <Link
              href="/docs/oracle-database/install-oracle-23ai"
              className="rounded-full border border-white/20 px-6 py-3 font-medium text-white"
            >
              Oracle install guide
            </Link>
            */}
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 hover:bg-gray-100"
            >
              <h2 className="text-xl font-semibold">{topic.title}</h2>
              <p className="mt-3 text-gray-600">{topic.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}