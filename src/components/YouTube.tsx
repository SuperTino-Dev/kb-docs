import type { ComponentPropsWithoutRef } from "react";

type YouTubeProps = {
  id: string;
  title?: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"iframe">, "src" | "title" | "className">;

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function YouTube({
  id,
  title = "YouTube video",
  className,
  allow,
  ...props
}: YouTubeProps) {
  return (
    <div
      className={mergeClassNames(
        "not-prose my-8 overflow-hidden rounded-lg bg-zinc-100 shadow-sm ring-1 ring-zinc-200",
        className,
      )}
    >
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow={
          allow ??
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        }
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        {...props}
      />
    </div>
  );
}
