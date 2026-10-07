import Link from "next/link";
import { facts, imageCredits, type ImageKey } from "@/content/site";
import { cn } from "@/lib/utils";

// Static files are served under the GitHub Pages sub-path in production (see next.config.ts).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Pre-converted AVIF/WebP (scripts/images.py) at 800/1600 px; intrinsic size reserved to avoid layout shift. */
export function Pic({ image, alt, sizes = "(min-width: 768px) 50vw, 100vw", className, eager = false }: { image: ImageKey; alt: string; sizes?: string; className?: string; eager?: boolean }) {
  const { width, height } = imageCredits[image];
  const set = (ext: string) => `${BASE}/img/${image}-800.${ext} 800w, ${BASE}/img/${image}-1600.${ext} ${width}w`;
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img src={`${BASE}/img/${image}-800.webp`} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("h-auto w-full", className)} />
    </picture>
  );
}

export function Credit({ image, className }: { image: ImageKey; className?: string }) {
  const c = imageCredits[image];
  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      Фото: <a href={c.page} className="underline underline-offset-2" rel="noopener" target="_blank">{c.author}</a>, {c.licenseUrl ? <a href={c.licenseUrl} className="underline underline-offset-2" rel="noopener license" target="_blank">{c.license}</a> : c.license}
    </span>
  );
}

/** Collapsible list of the verified facts (and their sources) behind a block of copy. */
export function Sources({ ids, className }: { ids: string[]; className?: string }) {
  const list = facts(ids);
  return (
    <details className={cn("group text-sm", className)}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded font-semibold text-muted-foreground underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="transition-transform group-open:rotate-90">›</span> Источники ({list.length})
      </summary>
      <ul className="mt-2 grid gap-1.5 border-l-2 border-border pl-3">
        {list.map((f) => (
          <li key={f.id}>
            {f.ru}{" "}
            <a href={f.source.url} target="_blank" rel="noopener" className="whitespace-nowrap text-muted-foreground underline underline-offset-2">
              {f.source.publisher}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function Footer() {
  return (
    <footer id="sources" className="border-t-2 border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:px-8">
        <div className="min-w-0">
          <p className="font-heading text-2xl font-extrabold">Конец инструкции</p>
          <p className="mt-3 max-w-[56ch]">
            Каждый факт на сайте проверен скриптом по дословной цитате из источника: годовые отчёты LEGO Group, Wikipedia, AP, Brickset.
          </p>
          <Link href="/sources" className="mt-4 inline-flex h-11 items-center rounded-md border-2 border-border px-4 font-semibold hover:bg-muted">
            Все факты и источники
          </Link>
          <p className="mt-8 max-w-[60ch] rounded-md bg-muted p-4 text-sm font-semibold">
            Фан-проект, не связан с LEGO Group и не одобрен ею. LEGO® — товарный знак LEGO Group.
          </p>
        </div>
        <div className="min-w-0">
          <p className="font-semibold">Фотографии (Wikimedia Commons)</p>
          <ul className="mt-2 grid gap-1">
            {(Object.keys(imageCredits) as ImageKey[]).map((k) => (
              <li key={k}><Credit image={k} /></li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Иллюстрации кирпичиков нарисованы для этого сайта (SVG).</p>
        </div>
      </div>
    </footer>
  );
}

/** Section opener styled as a numbered parts bag from a LEGO instruction booklet. */
export function BagHeading({ n, id, title, lead }: { n: number; id: string; title: string; lead: string }) {
  return (
    <header className="mb-10 grid gap-4 md:mb-14 md:grid-cols-[auto_minmax(0,1fr)] md:items-end">
      <span aria-hidden="true" className="step-num grid h-20 w-16 place-items-center rounded-[6px_6px_14px_14px] border-2 border-border bg-card text-5xl">
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-muted-foreground">Пакет {n}</p>
        <h2 id={id} className="text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">{title}</h2>
        <p className="mt-3 max-w-[60ch] text-muted-foreground">{lead}</p>
      </div>
    </header>
  );
}
