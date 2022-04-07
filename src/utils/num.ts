export function fmtNum(num: number): String {
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(num);
}