import { Hero } from "@/components/site/hero";
import { BagHeading, Credit, Pic, Sources } from "@/components/site/parts";
import { StudClick } from "@/components/site/stud-click";
import { RevenueChart } from "@/components/site/revenue-chart";
import { Gallery } from "@/components/site/gallery";
import { Timeline } from "@/components/ui/timeline";
import CardFlip from "@/components/kokonutui/card-flip";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { bento, factories, firstCards, nowCards, patentFacts, revenueFacts, stats, timeline } from "@/content/site";

const section = "mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28";

export default function Home() {
  return (
    <main id="main">
      <Hero />

      {/* Пакет 1 */}
      <section aria-labelledby="bio" className={section}>
        <BagHeading n={1} id="bio" title="Как собиралась компания" lead="Четырнадцать шагов от столярной мастерской до рекордного 2025 года. Каждая эпоха — кирпич в башне: листайте, и она растёт." />
        <Timeline data={timeline} />
      </section>

      {/* Пакет 2 */}
      <section aria-labelledby="first" className="border-y-2 border-border bg-card/40">
        <div className={section}>
          <BagHeading n={2} id="first" title="Первые LEGO" lead="От деревянной утки до минифигурки: детали, из которых выросла система. Нажмите «Подробнее», чтобы перевернуть карточку." />

          <div className="callout mb-12 grid gap-8 p-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:p-8">
            <div className="min-w-0">
              <p className="step-num text-5xl">1958</p>
              <h3 className="mt-1 text-2xl font-bold md:text-3xl">Шип и трубка: тот самый щелчок</h3>
              <p className="mt-3 max-w-[52ch]">
                28 января 1958 года в Дании подали заявку на патент кирпичика с трубками внутри: шипы нижнего кирпича входят между трубками верхнего, как на чертеже справа. Через пять лет материал сменили на ABS, а кирпичики 1958 года до сих пор подходят к сегодняшним. Шесть кирпичиков 2×4 можно соединить 915&nbsp;103&nbsp;765 способами.
              </p>
              <div className="mt-6"><StudClick /></div>
              <Sources ids={patentFacts} className="mt-4" />
            </div>
            <figure className="min-w-0 self-start rounded-md bg-white p-3 text-[#1b2a34]">
              <Pic image="patent-1958" alt="Чертёж из патента US 3 005 282 «Toy building brick»: кирпичик с шипами сверху и трубками снизу, фигуры 1–6" sizes="(min-width: 768px) 40vw, 100vw" />
              <figcaption className="mt-2 text-xs">
                Патент US 3 005 282, Г. К. Кристиансен (заявка 1958, публикация 1961). <Credit image="patent-1958" className="text-[#45576a]" />
              </figcaption>
            </figure>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {firstCards.map((card) => (
              <li key={card.year} className="grid gap-2">
                <CardFlip card={card} />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Sources ids={card.facts} />
                  {card.image && <Credit image={card.image} />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Пакет 3 */}
      <section aria-labelledby="now" className={section}>
        <BagHeading n={3} id="now" title="Компания сейчас" lead="Цифры из годового отчёта LEGO Group за 2025 год, опубликованного 10 марта 2026 года." />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <li key={s.label} className="callout flex flex-col gap-1 p-5">
              <span className="step-num text-[clamp(2.25rem,5vw,3.25rem)] tracking-[-0.02em]">
                <NumberTicker value={s.value} decimalPlaces={s.decimals ?? 0} />
                <span className="text-[0.55em]">{s.suffix}</span>
              </span>
              <span className="text-muted-foreground">{s.label}</span>
              <Sources ids={s.facts} className="mt-auto pt-2" />
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <RevenueChart />
            <p className="mt-4 max-w-[60ch]">
              За пять лет выручка выросла с 55,3 до 83,5 млрд крон, чистая прибыль 2025 года — 16,7 млрд. Потребительские продажи прибавили 16% — более чем вдвое быстрее рынка игрушек. LEGO — крупнейший производитель игрушек в мире по продажам.
            </p>
            <Sources ids={revenueFacts} className="mt-3" />
          </div>
          <div className="grid min-w-0 content-start gap-4">
            <div className="callout p-5">
              <h3 className="text-xl font-bold">Где отливают кирпичики</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {factories.moulding.map((c) => (
                  <li key={c} className="rounded-md bg-secondary px-2.5 py-1 text-sm font-semibold text-secondary-foreground">{c}</li>
                ))}
              </ul>
              <p className="mt-3 text-[0.95rem]">{factories.note}</p>
              <Sources ids={factories.facts} className="mt-3" />
            </div>
            {nowCards.map((c) => (
              <div key={c.title} className="callout p-5">
                <h3 className="text-xl font-bold">{c.title}</h3>
                <p className="mt-1 text-[0.95rem]">{c.text}</p>
                <Sources ids={c.facts} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Пакет 4 */}
      <section aria-labelledby="modern" className="border-t-2 border-border bg-card/40">
        <div className={section}>
          <BagHeading n={4} id="modern" title="Современные работы" lead="Линейки для взрослых, рекордные наборы, фан-проекты LEGO Ideas и художники, для которых кирпичик — материал." />
          <BentoGrid>
            {bento.map((item) => <BentoCard key={item.name} item={item} />)}
          </BentoGrid>

          <h3 className="mb-5 mt-16 text-2xl font-bold">Галерея</h3>
          <Gallery />
        </div>
      </section>
    </main>
  );
}
