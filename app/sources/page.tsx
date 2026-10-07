import type { Metadata } from "next";
import { allFacts } from "@/content/site";

export const metadata: Metadata = {
  title: "Факты и источники",
  description: "Все факты сайта с источниками: годовые отчёты LEGO Group, Wikipedia, AP, Brickset.",
};

const SECTIONS = [
  { id: "bio", title: "Биография компании" },
  { id: "first", title: "Первые LEGO" },
  { id: "now", title: "Компания сейчас" },
  { id: "modern", title: "Современные работы" },
];

export default function SourcesPage() {
  const list = allFacts();
  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-tight">Факты и источники</h1>
      <p className="mt-4 max-w-[62ch] text-muted-foreground">
        {list.length} фактов. Для каждого скрипт <code className="rounded bg-muted px-1">scripts/check_facts.py</code> находит дословную цитату в тексте источника; если цитаты нет, проверка не проходит.
      </p>
      {SECTIONS.map((s) => (
        <section key={s.id} aria-labelledby={`src-${s.id}`} className="mt-12">
          <h2 id={`src-${s.id}`} className="text-2xl font-bold">{s.title}</h2>
          <ol className="mt-4 grid gap-3">
            {list.filter((f) => f.section === s.id).map((f) => (
              <li key={f.id} className="callout p-4">
                <p>{f.ru}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {f.source.publisher}:{" "}
                  <a href={f.source.url} target="_blank" rel="noopener" className="underline underline-offset-2">{f.source.title}</a>
                </p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
