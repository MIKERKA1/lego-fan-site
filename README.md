# Кирпичик за кирпичиком

Фан-сайт об истории LEGO, свёрстанный как инструкция по сборке: четыре «пакета» (история, первые LEGO, компания сейчас, современные работы). Каждый факт на сайте подтверждён дословной цитатой из источника.

> Фан-проект, не связан с LEGO Group и не одобрен ею. LEGO® — товарный знак LEGO Group.

Сайт: **https://mikerka1.github.io/lego-fan-site/**

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
```

Статическая сборка (папка `out/`, её же публикует GitHub Pages):

```bash
npm run build && npm run start
```

Требования: Node.js ≥ 20.9. Для вспомогательных скриптов — Python 3.11+ с `pillow` и `pypdf` (`pip install pillow pypdf`).

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run facts:fetch` | Скачивает тексты всех источников из `content/facts.json` в `content/raw/` (Wikipedia API, страницы, PDF годового отчёта) |
| `npm run facts:check` | Проверяет, что цитата каждого факта есть в тексте источника, и пересобирает `content/sources.md`; падает, если цитаты нет (сначала `npm run facts:fetch`) |
| `npm run images` | Скачивает фото с Wikimedia Commons, конвертирует в AVIF + WebP (800/1600 px), пишет атрибуцию в `content/images.json` |
| `npm run typecheck`, `npm run lint` | TypeScript и ESLint |

## Устройство

- `content/facts.json` — 88 фактов: текст на русском, источник, дословная цитата. `content/site.ts` — тексты сайта; каждый блок ссылается на id фактов, неизвестный id валит сборку.
- `app/page.tsx` — главная, `app/sources/page.tsx` — все факты с источниками.
- `components/site/*` — секции и мелкие части сайта; `components/ui/*` (Magic UI, Aceternity UI, RetroUI), `components/kokonutui/*` (Kokonut UI), `components/TiltedCard.tsx` (React Bits), `components/charts/*` (Bklit UI) — компоненты из shadcn-реестров, адаптированные под проект.
- Тема — `app/globals.css` (shadcn-переменные в формате tweakcn, цвета кирпичей из LDraw).

## Публикация

Каждый пуш в `main` собирает сайт и выкладывает его на GitHub Pages (`.github/workflows/deploy.yml`).
