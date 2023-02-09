export function mtof(m:number) {
  return Math.pow(2, (m - 69) / 12) * 440;
}