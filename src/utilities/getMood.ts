import { scaleLinear } from 'd3-scale';

const valueDomain = [20, 40, 60, 100, 500];
const baseRGB = [[0, 121, 107], [249, 168, 37], [230, 81, 0], [221, 44, 0], [150, 0, 132]];

const scaleCache = new Map<number, (v: number) => string | undefined>();

function getScale(opacity: number) {
  if (!scaleCache.has(opacity)) {
    const colors = baseRGB.map(([r, g, b]) => `rgba(${r}, ${g}, ${b}, ${opacity})`);
    scaleCache.set(opacity, scaleLinear<string>().domain(valueDomain).range(colors).clamp(true));
  }
  return scaleCache.get(opacity)!;
}

export default function getMood(value: number, opacity: number): string {
  const scale = getScale(opacity);
  return scale(parseInt(String(value), 10)) ?? `rgba(0, 121, 107, ${opacity})`;
}
