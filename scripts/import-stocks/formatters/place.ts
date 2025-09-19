import type { StockName } from "../types.ts";

export function placeFormatter(
	place: string | number | undefined,
): StockName | undefined {
	if (!place) return undefined;
	return String(place ?? "") as StockName;
}
