"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";

const NAV = [
  { href: "/#bio", n: 1, label: "История" },
  { href: "/#first", n: 2, label: "Первые LEGO" },
  { href: "/#now", n: 3, label: "Сейчас" },
  { href: "/#modern", n: 4, label: "Работы" },
];

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-heading font-extrabold">
          <span aria-hidden="true" className="flex gap-0.5">
            <i className="block size-3 rounded-[2px] bg-brick-red" />
            <i className="block size-3 rounded-[2px] bg-brick-yellow" />
            <i className="block size-3 rounded-[2px] bg-brick-blue" />
          </span>
          <span className="max-sm:sr-only">Кирпичик за кирпичиком</span>
        </Link>
        <nav aria-label="Пакеты" className="ml-auto min-w-0 overflow-x-auto">
          <ul className="flex items-center gap-1 text-sm font-semibold">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-md px-2 hover:bg-muted">
                  <span className="step-num grid size-6 place-items-center rounded-[3px_3px_6px_6px] border-2 border-border text-xs" aria-hidden="true">{item.n}</span>
                  <span className="max-md:sr-only">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" onClick={toggleTheme} className="grid size-10 shrink-0 place-items-center rounded-md border-2 border-border bg-card hover:bg-muted" aria-label="Переключить светлую и тёмную тему">
          <Sun className="size-5 dark:hidden" aria-hidden="true" />
          <Moon className="hidden size-5 dark:block" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
