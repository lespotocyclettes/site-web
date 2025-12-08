import type { Etat } from "../types.ts";

export function etatFormateur(
	etat: string | number | undefined,
): Etat | undefined {
	if (!etat) return undefined;
	const etatAsString = String(etat ?? "")
		.toLocaleLowerCase()
		.trim();
	if (
		!["garder", "prêt à rouler", "à réparer", "à démonter"].includes(
			etatAsString,
		)
	) {
		throw new Error(`Unknown etat: ${etatAsString}`);
	}
	return etatAsString as Etat;
}
