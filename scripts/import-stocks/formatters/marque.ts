import type { Marque } from "../types.ts";

export function marqueFormatter(
	marque: string | number | undefined,
): Marque | undefined {
	if (!marque) return undefined;

	const valueAsString = String(marque ?? "")
		.toLocaleLowerCase()
		.replace(/[«»]/g, "")
		.trim();

	switch (valueAsString) {
		case "vélo repeint":
		case "repeint":
			return "repeint";
		case "b twin":
		case "b'twin":
		case "btwin":
			return "b'twin";
		case "optimalp":
		case "optim'alp":
			return "optimalp";
		case "canyon bike":
			return "canyon";
		case "topbike":
			return "top bike";
		case "sans":
			return undefined;
		default:
			return valueAsString;
	}
}
