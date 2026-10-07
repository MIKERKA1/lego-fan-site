// Site copy (Russian). Every block lists the fact ids it relies on; `facts()` throws on an unknown id,
// so a claim without a verified source (content/facts.json, checked by scripts/check_facts.py) fails the build.
import data from "./facts.json";
import images from "./images.json";

type Source = { title: string; publisher: string; url: string };
export type Fact = { id: string; ru: string; section: string; source: Source };

const sources = data.sources as Record<string, Source & { raw: string }>;
const byId = new Map(data.facts.map((f) => [f.id, f]));

export function facts(ids: string[]): Fact[] {
  return ids.map((id) => {
    const f = byId.get(id);
    if (!f) throw new Error(`Unknown fact id "${id}" — add it to content/facts.json first`);
    const { title, publisher, url } = sources[f.source];
    return { id, ru: f.ru, section: f.section, source: { title, publisher, url } };
  });
}

export const allFacts = () => facts(data.facts.map((f) => f.id));

export type ImageKey = keyof typeof images;
export type ImageCredit = { title: string; page: string; author: string; license: string; licenseUrl: string; width: number; height: number };
export const imageCredits = images as Record<ImageKey, ImageCredit>;

export type BrickColor = "red" | "yellow" | "blue" | "white" | "gray";

// ---------- Пакет 1: биография (башня-таймлайн) ----------
export type TimelineStep = { year: string; title: string; text: string; color: BrickColor; facts: string[] };

export const timeline: TimelineStep[] = [
  { year: "1916", title: "Столяр приезжает в Биллунн", color: "white", facts: ["carpenter"],
    text: "Оле Кирк Кристиансен покупает столярную мастерскую в датской деревне Биллунн. Игрушки появятся позже." },
  { year: "1924", title: "Первый пожар", color: "gray", facts: ["fire-1924"],
    text: "Четырёхлетний Готфрид с братом Карлом Георгом случайно поджигают стружку у клеевого котла. Мастерская сгорает дотла." },
  { year: "1932", title: "Начало компании", color: "red", facts: ["founded", "billund"],
    text: "Оле Кирк Кристиансен основывает компанию, которая и сегодня живёт в Биллунне." },
  { year: "1934", title: "Имя: leg godt", color: "yellow", facts: ["name-1934", "leg-godt", "latin"],
    text: "Компания получает имя LEGO — от датского «leg godt», «играй хорошо». По-латыни lego значит ещё и «я собираю»." },
  { year: "1947", title: "Первая машина для пластика", color: "blue", facts: ["plastic-1947"],
    text: "Мастерская покупает литьевую машину — с неё начинается переход от дерева к пластику." },
  { year: "1958", title: "Новый руководитель и патент", color: "red", facts: ["godtfred-1958", "patent-1958"],
    text: "Умирает основатель, компанию возглавляет его сын Готфрид. В том же году подана заявка на патент современного кирпичика." },
  { year: "1960", title: "Второй пожар", color: "gray", facts: ["fire-1960"],
    text: "4 февраля сгорает цех деревянных игрушек. На следующий день Готфрид решает: дальше — только пластиковые кирпичики." },
  { year: "1979", title: "Третье поколение", color: "yellow", facts: ["kjeld", "kjeld-themes"],
    text: "Кьельд Кирк Кристиансен руководит компанией 25 лет. При нём появляются тематические серии, минифигурки, LEGO.com, Mindstorms и первые лицензии." },
  { year: "1996", title: "«LEGO. Концлагерь»", color: "gray", facts: ["libera-1996", "libera-bricks", "libera-boxes", "libera-1997", "libera-legal", "libera-intent"],
    text: "Польский художник Збигнев Либера собирает из кирпичиков LEGO модели нацистского концлагеря и упаковывает их в коробки, похожие на настоящие наборы, с надписью «спонсировано LEGO». Кирпичики LEGO Group дала по его просьбе о пожертвовании: компании сказали, что он построит дом или больницу. 24 февраля 1997 года LEGO Group назвала работу «тревожной и достойной сожаления», отказалась признавать спонсорство и грозила художнику судом. Сам Либера объяснял замысел контрастом между ужасами реального мира и идеальным миром, который показывают детям." },
  { year: "1998", title: "Первый убыток", color: "white", facts: ["loss-1998", "starwars-1999"],
    text: "Впервые в истории компания уходит в минус. Через год выходят первые лицензионные наборы — LEGO Star Wars." },
  { year: "2004", title: "На грани", color: "gray", facts: ["loss-2004", "knudstorp", "parks-sold"],
    text: "Убыток £174 млн; директор по маркетингу позже назовёт компанию «почти банкротом». CEO впервые становится человек не из семьи — Йорген Виг Кнудсторп. Парки Legoland продают Merlin." },
  { year: "2005", title: "Разворот", color: "blue", facts: ["profit-2005"],
    text: "Уже через год после кризиса — прибыль 702 млн датских крон." },
  { year: "2017", title: "Новый CEO", color: "red", facts: ["niels"],
    text: "В октябре компанию возглавляет Нильс Б. Кристиансен. Он руководит LEGO Group и сейчас." },
  { year: "2025", title: "Рекордный год", color: "yellow", facts: ["revenue-2025", "thomas", "ownership"],
    text: "Выручка 83,5 млрд крон. Совет директоров возглавляет Томас Кирк Кристиансен — четвёртое поколение семьи, которая через KIRKBI владеет 75% компании." },
];

// ---------- Пакет 2: первые LEGO ----------
// `illustration: "duck"` = our own isometric SVG (no freely licensed photo of the 1935 wooden duck exists on Commons).
export type FirstCard = { year: string; title: string; front: string; back: string[]; image?: ImageKey; imageAlt?: string; illustration?: "duck"; facts: string[] };

export const firstCards: FirstCard[] = [
  { year: "1935", title: "Деревянная утка", illustration: "duck", facts: ["duck"],
    front: "Утка на колёсиках, которую тянут за верёвочку, — одна из первых игрушек мастерской.",
    back: ["К 1935 году в ассортименте уже были деревянные животные.", "У утки с тех пор вышло множество вариаций."] },
  { year: "1949", title: "Automatic Binding Bricks", image: "abb-bricks", imageAlt: "Ранние кирпичики LEGO Automatic Binding Bricks с прорезями и окном на зелёной пластине", facts: ["abb-1949", "kiddicraft", "acetate"],
    front: "Первые пластиковые кирпичики LEGO.",
    back: ["Прообраз — самозапирающиеся кубики британской фирмы Kiddicraft.", "Делались из ацетата целлюлозы, а не из нынешнего ABS."] },
  { year: "1955", title: "Town Plan", image: "town-system", imageAlt: "Витрина Немецкого музея в Мюнхене: ранние городские модели из кирпичиков LEGO", facts: ["town-plan", "compat"],
    front: "Первый набор, задуманный как система: город из совместимых деталей.",
    back: ["Идея системы: новый набор сочетается со всеми прежними.", "Кирпичики 1958 года до сих пор подходят к сегодняшним."] },
  { year: "1963", title: "ABS-пластик", image: "bricks-1958", imageAlt: "Первые запатентованные кирпичики LEGO 1958 года в Датском техническом музее", facts: ["abs", "acetate", "compat"],
    front: "Через пять лет после патента кирпичики начали отливать из ABS.",
    back: ["ABS заменил ацетат целлюлозы, из которого делали первые кирпичики.", "Совместимость сохранилась: кирпичик 1958 года подходит к сегодняшнему."] },
  { year: "1968", title: "Первый Legoland", image: "legoland-1968", imageAlt: "Миниатюрная мельница и дома из кирпичиков в Legoland Биллунн, 1968 год, чёрно-белое фото", facts: ["legoland-1968", "legoland-visitors", "legoland-11"],
    front: "7 июня 1968 года в Биллунне открылся парк с миниатюрными городами из кирпичиков.",
    back: ["За первый сезон пришло 625 000 человек.", "Сегодня в мире 11 парков Legoland."] },
  { year: "1969", title: "DUPLO", image: "duplo", imageAlt: "Синий и жёлтый кирпичики DUPLO рядом с маленьким красным кирпичиком LEGO", facts: ["duplo-1969"],
    front: "Крупные кирпичики для самых маленьких.",
    back: ["Линейку запустили в 1969 году.", "Позже добавились фигурки, животные, машины, дома и поезда."] },
  { year: "1977", title: "Technic", image: "technic-gears", imageAlt: "Шестерни LEGO Technic крупным планом", facts: ["technic-1977", "technic-name", "technic-top"],
    front: "Шестерни, оси и балки: LEGO для тех, кто собирает механизмы.",
    back: ["Сначала серия называлась Expert Builder, имя Technic — с 1982 года.", "Сегодня это одна из самых продаваемых линеек."] },
  { year: "1978", title: "Минифигурка", image: "classic-space", imageAlt: "Наборы Classic Space с минифигурками-космонавтами на полке", facts: ["minifig-1978", "minifig-height", "past-present-future"],
    front: "Человечек ростом 4 см, придуманный Йенсом Нюгором Кнудсеном.",
    back: ["Дебют — в трёх сериях: Castle (прошлое), Town (настоящее), Space (будущее).", "Торсы, ноги и руки взаимозаменяемы."] },
];

export const patentFacts = ["patent-1958", "abs", "compat", "combos"];

// ---------- Пакет 3: компания сейчас ----------
export type Stat = { value: number; decimals?: number; suffix: string; label: string; facts: string[] };

export const stats: Stat[] = [
  { value: 83.5, decimals: 1, suffix: " млрд DKK", label: "выручка за 2025 год, +12%", facts: ["revenue-2025"] },
  { value: 22.0, decimals: 1, suffix: " млрд DKK", label: "операционная прибыль, +18%", facts: ["op-profit-2025"] },
  { value: 33801, suffix: "", label: "сотрудников на конец 2025 года", facts: ["headcount"] },
  { value: 52, suffix: "%", label: "возобновляемого и переработанного сырья (33% годом ранее)", facts: ["materials"] },
  { value: 36, suffix: " млрд", label: "деталей в год — около 1140 в секунду", facts: ["bricks-per-year"] },
  { value: 11, suffix: "", label: "парков Legoland в мире", facts: ["legoland-11"] },
];

// Revenue in DKK billion, from DKK million in the 2025 Financial Highlights.
// growth = revenue growth "as reported" by LEGO Group, % vs the previous year.
export const revenue = [
  { year: "2021", value: 55.294, growth: 27 },
  { year: "2022", value: 64.647, growth: 17 },
  { year: "2023", value: 65.914, growth: 2 },
  { year: "2024", value: 74.325, growth: 13 },
  { year: "2025", value: 83.53, growth: 12 },
];
export const revenueFacts = ["revenue-series", "revenue-growth", "net-profit-2025", "market", "largest-toy"];

export const factories = {
  facts: ["factories", "vietnam", "virginia"],
  moulding: ["Дания", "Венгрия", "Мексика", "Китай", "Вьетнам", "США"],
  note: "Кирпичики отливают в шести странах; украшение и упаковка — ещё и в Чехии. Завод во Вьетнаме (2025, $1 млрд) рассчитан на работу только на чистой энергии, в Вирджинии строится фабрика с распределительным центром.",
};

export const nowCards = [
  { title: "LEGO Fortnite", text: "Игра вместе с Epic Games вышла 7 декабря 2023 года. В LEGO Fortnite Odyssey наиграли больше миллиарда часов.", facts: ["fortnite-date", "fortnite"] },
  { title: "Formula 1", text: "Первые наборы по партнёрству с F1 вышли в 2025 году.", facts: ["f1"] },
  { title: "Discovery Centres", text: "В феврале 2026 года LEGO выкупила у Merlin 29 крытых центров в девяти странах.", facts: ["discovery"] },
  { title: "860+ продуктов", text: "Самый большой ассортимент в истории: около половины наборов 2025 года — новые.", facts: ["products"] },
];

// ---------- Пакет 4: современные работы ----------
// imageNote: visible caption when the photo shows a related build rather than the official set itself.
export type BentoItem = { name: string; text: string; image?: ImageKey; imageAlt?: string; imageNote?: string; badge?: string; stat?: string; span: "wide" | "tall" | "full" | "normal"; facts: string[] };

export const bento: BentoItem[] = [
  { name: "Sagrada Família", stat: "12 060 деталей", span: "wide", badge: "Рекорд", image: "sagrada-store", imageAlt: "Скульптура собора Саграда Фамилия из кирпичиков в магазине LEGO в Барселоне", imageNote: "На фото — скульптура в магазине LEGO в Барселоне, не сам набор 21065.", facts: ["sagrada", "sagrada-date", "worldmap"],
    text: "Самый большой набор LEGO по числу деталей (Architecture 21065) выходит 1 ноября 2026. Прежний рекордсмен — World Map, 11 695 деталей." },
  { name: "Натан Савая", span: "tall", image: "sawaya-dinosaur", imageAlt: "Скелет тираннозавра из кирпичиков LEGO на выставке The Art of the Brick", badge: "Художник", facts: ["sawaya-lawyer", "sawaya-lcp", "sawaya-show"],
    text: "Юрист, который в 2004 году ушёл в искусство. Официальный LEGO Certified Professional, но не сотрудник компании. Его выставка «The Art of the Brick» целиком сделана из LEGO." },
  { name: "Збигнев Либера: «LEGO. Концлагерь»", stat: "1996", span: "full", badge: "Художник", facts: ["libera-1996", "libera-1997", "libera-venice", "libera-shown", "libera-msn", "libera-msn-date", "libera-important"],
    text: "Самая спорная работа из кирпичиков LEGO: модели нацистского концлагеря, которые компания публично осудила. Куратор польского павильона Венецианской биеннале попросил не включать её в экспозицию, но работу показывали в галереях по всему миру, в том числе в Еврейском музее Нью-Йорка. В январе 2012 года Музей современного искусства в Варшаве купил её за £45 000 и назвал «одной из важнейших работ современного польского искусства». Фотографии работы защищены авторским правом, поэтому здесь их нет." },
  { name: "LEGO Ideas", span: "normal", image: "ideas-treehouse", imageAlt: "Набор LEGO Ideas Tree House: дом на дереве с тремя хижинами", badge: "Фан-проект", facts: ["ideas", "ideas-10000", "treehouse", "treehouse-pieces"],
    text: "Фанаты предлагают модели; 10 000 голосов — и проект идёт на рассмотрение, автор получает 1% роялти. Tree House (2019) — 3036 деталей." },
  { name: "Saturn V", stat: "1969", span: "normal", badge: "Фан-проект", image: "saturn-v", imageAlt: "Собранная ракета Saturn V из набора LEGO Ideas рядом с коробкой и инструкцией", facts: ["saturn", "saturn-pieces"],
    text: "Ракета NASA Apollo из LEGO Ideas (2017), 1969 деталей." },
  { name: "Icons", span: "normal", image: "icons-moto", imageAlt: "Мотоцикл Harley-Davidson, собранный из LEGO", facts: ["icons"],
    text: "Сложные модели для взрослых, включая модульные здания." },
  { name: "Star Wars UCS", stat: "37 моделей", span: "wide", image: "falcon", imageAlt: "Модель звездолёта Millennium Falcon из LEGO", facts: ["ucs"],
    text: "Ultimate Collector Series: 37 больших коллекционных моделей с 2000 года, начиная с X-Wing и TIE Interceptor." },
  { name: "Botanicals", stat: "756", span: "normal", image: "bonsai", imageAlt: "Бонсай с белой кроной из кирпичиков LEGO", imageNote: "На фото — бонсай из LEGO, собранный фанатом.", facts: ["botanicals", "botanicals-pieces"],
    text: "Цветы и растения из кирпичиков для взрослых — с 2021 года. Flower Bouquet — 756 деталей." },
  { name: "LEGO Art", stat: "1×1", span: "wide", image: "art-mosaic", imageAlt: "Фрагмент мозаики из кирпичиков LEGO: глаз инопланетянина", imageNote: "На фото — фан-мозаика «The Gray Alien», не набор LEGO Art.", facts: ["art-2020", "art-mosaic"],
    text: "Мозаики-картины из круглых деталей 1×1 — с 2020 года." },
];

export type GalleryItem = { image: ImageKey; alt: string; caption: string };

export const gallery: GalleryItem[] = [
  { image: "sawaya-moai", alt: "Статуя моаи с острова Пасхи, собранная Натаном Саваей из кирпичиков LEGO", caption: "Моаи, Натан Савая" },
  { image: "sawaya-dinosaur", alt: "Скелет тираннозавра из кирпичиков LEGO в тёмном зале с подсветкой", caption: "Тираннозавр, «The Art of the Brick»" },
  { image: "ideas-treehouse", alt: "Модель дома на дереве из набора LEGO Ideas 21318", caption: "Tree House, LEGO Ideas" },
  { image: "lego-house", alt: "Ступенчатая крыша здания LEGO House в Биллунне в виде гигантских кирпичей", caption: "LEGO House, Биллунн" },
  { image: "legoland-1977", alt: "Миниатюрный город в Legoland Биллунн, цветное фото 1977 года", caption: "Legoland Биллунн, 1977" },
  { image: "town-space", alt: "Наборы Town и Space конца 1970-х", caption: "Town и Space, ранние наборы" },
];
