export function toPrecision(num: number, places: number): number {
    const factor = 10 ** places;

    return Math.round(num * factor) / factor;
}
