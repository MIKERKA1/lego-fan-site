// Isometric LEGO bricks in plain SVG. Units: 1 = one stud pitch (8 mm); a brick is 1.2 tall (9.6 mm).
const S = 22; // px per stud
const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;

export const BRICK_H = 1.2;

export function project(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS * S, (x + y) * SIN * S - z * S];
}

const pts = (...p: [number, number, number][]) => p.map((q) => project(...q).map((n) => n.toFixed(1)).join(",")).join(" ");

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k));
  return `rgb(${c.join(" ")})`;
}

export type IsoBrickProps = { x: number; y: number; z: number; w: number; d: number; h?: number; color: string; studs?: boolean };

/** A w×d brick whose bottom-back corner sits at (x, y, z). Visible faces: top, +x (right), +y (left). */
export function IsoBrick({ x, y, z, w, d, h = BRICK_H, color, studs = true }: IsoBrickProps) {
  const t = z + h;
  const stroke = shade(color, 0.55);
  const studList: [number, number][] = [];
  if (studs) for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) studList.push([x + i + 0.5, y + j + 0.5]);
  return (
    <>
      <polygon points={pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t])} fill={shade(color, 0.72)} stroke={stroke} strokeWidth={1} strokeLinejoin="round" />
      <polygon points={pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t])} fill={shade(color, 0.86)} stroke={stroke} strokeWidth={1} strokeLinejoin="round" />
      <polygon points={pts([x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t])} fill={color} stroke={stroke} strokeWidth={1} strokeLinejoin="round" />
      {studList.map(([sx, sy]) => {
        const [bx, by] = project(sx, sy, t);
        const [, ty] = project(sx, sy, t + 0.2);
        const rx = 0.3 * Math.SQRT2 * COS * S;
        const ry = 0.3 * Math.SQRT2 * SIN * S;
        return (
          <g key={`${sx}-${sy}`}>
            <ellipse cx={bx} cy={by} rx={rx} ry={ry} fill={shade(color, 0.72)} stroke={stroke} strokeWidth={1} />
            <rect x={bx - rx} y={ty} width={rx * 2} height={by - ty} fill={shade(color, 0.8)} />
            <ellipse cx={bx} cy={ty} rx={rx} ry={ry} fill={color} stroke={stroke} strokeWidth={1} />
          </g>
        );
      })}
    </>
  );
}

/** A circle drawn on the plane y = const (the left-facing side), e.g. a wheel or an eye. */
export function IsoDisc({ x, y, z, r, fill, stroke }: { x: number; y: number; z: number; r: number; fill: string; stroke?: string }) {
  const [cx, cy] = project(x, y, z);
  // Map the unit circle onto the plane spanned by the x axis (COS, SIN) and the z axis (0, -1).
  const m = `matrix(${COS * S} ${SIN * S} 0 ${-S} ${cx} ${cy})`;
  return <circle r={r} transform={m} fill={fill} stroke={stroke} strokeWidth={stroke ? 2 / S : 0} />;
}

const RED = "#C91A09", YELLOW = "#F2CD37", BLUE = "#0055BF", BLACK = "#05131D";
const B = 0.5; // chassis sits on wheels
const L1 = B + BRICK_H, L2 = L1 + BRICK_H, L3 = L2 + BRICK_H, L4 = L3 + BRICK_H;

/** The 1935 pull-along duck rebuilt in bricks. `data-step` groups are the hero's three assembly steps. */
export function DuckBricks({ partClassName }: { partClassName?: string }) {
  return (
    <>
      <g data-step="1" className={partClassName}><IsoBrick x={0} y={0} z={B} w={6} d={2} color={BLUE} /></g>
      <g data-step="1" className={partClassName}>
        <IsoDisc x={1.2} y={2} z={0.45} r={0.45} fill={BLACK} stroke="#555555" />
        <IsoDisc x={4.8} y={2} z={0.45} r={0.45} fill={BLACK} stroke="#555555" />
      </g>
      <g data-step="2" className={partClassName}><IsoBrick x={0} y={0} z={L1} w={5} d={2} color={YELLOW} /></g>
      <g data-step="2" className={partClassName}><IsoBrick x={0} y={0} z={L2} w={5} d={2} color={YELLOW} /></g>
      <g data-step="2" className={partClassName}><IsoBrick x={0} y={0} z={L3} w={1} d={2} color={YELLOW} /></g>
      <g data-step="3" className={partClassName}><IsoBrick x={3} y={0} z={L3} w={2} d={2} color={YELLOW} /></g>
      <g data-step="3" className={partClassName}><IsoBrick x={3} y={0} z={L4} w={2} d={2} color={YELLOW} /></g>
      <g data-step="3" className={partClassName}><IsoBrick x={5} y={0} z={L3 + 0.6} w={1} d={2} h={0.8} color={RED} studs={false} /></g>
      <g data-step="3" className={partClassName}><IsoDisc x={4.3} y={2} z={L4 + 0.55} r={0.2} fill={BLACK} /></g>
    </>
  );
}

export const DUCK_VIEWBOX = "-55 -140 185 245";
