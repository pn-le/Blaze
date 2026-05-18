const LAPSE_RATE = 0.0065; // °C per meter

export function tempAtElevation(
  surfaceTempC: number,
  surfaceElevM: number,
  targetElevM: number
): number {
  return surfaceTempC - LAPSE_RATE * (targetElevM - surfaceElevM);
}

export function windAtElevation(
  surfaceWindKmh: number,
  surfaceElevM: number,
  targetElevM: number
): number {
  const ratio = Math.pow(
    Math.max(targetElevM, 100) / Math.max(surfaceElevM, 100),
    0.14
  );
  return surfaceWindKmh * Math.min(ratio, 2.5);
}

export function ftToM(ft: number): number {
  return ft * 0.3048;
}

export function mToFt(m: number): number {
  return m / 0.3048;
}

export function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}
