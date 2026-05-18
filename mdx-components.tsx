import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import CodeBlock from "./src/components/CodeBlock";
import YouTube from "./src/components/YouTube";

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, className, ...props }: ComponentPropsWithoutRef<"h1">) => (
      <h1
        className={mergeClassNames(
          "mb-6 text-4xl font-bold tracking-tight text-zinc-900",
          className,
        )}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, className, ...props }: ComponentPropsWithoutRef<"h2">) => (
      <h2
        className={mergeClassNames(
          "mt-10 mb-4 text-2xl font-semibold text-zinc-900",
          className,
        )}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, className, ...props }: ComponentPropsWithoutRef<"h3">) => (
      <h3
        className={mergeClassNames(
          "mt-8 mb-3 text-xl font-semibold text-zinc-900",
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-5 leading-7 text-zinc-700">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 text-zinc-700">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li>{children}</li>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-900">
        {children}
      </code>
    ),
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    YouTube,
    ...components,
  };
}
