import type { TypeVelo } from "../types.ts";

export function typeVeloFormatter(
	type_velo: string | number | undefined,
): TypeVelo[] {
	if (!type_velo) return [];

	let valueAsString = String(type_velo).toLocaleLowerCase();
	const result: TypeVelo[] = [];
	function extract(word: string, ...values: string[]) {
		if (valueAsString.includes(word)) {
			result.push(...values);
			valueAsString = valueAsString.replace(word, "");
		}
	}

	extract("velo pliant", "pliant");
	extract("1/2 course", "demi-course");
	extract("pliable", "pliant");
	extract("mixte", "homme", "femme", "mixte");
	extract("electrique", "électrique");
	extract("home trainer", "home trainer");
	extract("velo");
	extract("fille", "femme");
	extract("dame", "femme");

	const words = valueAsString
		.split(" ")
		.map((x) => x.trim())
		.filter((x) => x)
		.map((word) => {
			switch (word) {
				case "":
					return word;
				default:
					return word;
			}
		});

	return [...result, ...words];
}
