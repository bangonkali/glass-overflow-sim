export function fmtNum(num: number): string {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 3 }).format(
    num
  );
}
