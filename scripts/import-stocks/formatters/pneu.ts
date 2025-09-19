import type { Structure } from "../types.ts";

export function pneuFormatter(
	value: string | number | undefined,
): Structure["pneu"] | undefined {
	if (!value) return undefined;

	const valueAsString = String(value)
		.toLocaleLowerCase()
		.replaceAll(",", ".")
		.replaceAll("’’", '"')
		.replaceAll("''", '"')
		.replaceAll(' "', '"');

	switch (valueAsString) {
		case "sans":
		case "manque":
			return undefined;
	}

	const [diametre, largeur] = valueAsString.split("x");

	return {
		diametre: diametre || undefined,
		largeur: largeur || undefined,
	};
}
