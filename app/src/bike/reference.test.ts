import { describe, expect, test } from "vitest";
import {
	formatReference,
	getReferenceParts,
	parseReference,
} from "./reference";

describe("référence", () => {
	test("la date d'entrée et le compteur du jour se lisent dans la référence", () => {
		const reference = parseReference("260707.03");
		if (!reference) throw new Error("260707.03 should be a valid reference");

		expect(getReferenceParts(reference)).toEqual({
			entryDate: "2026-07-07",
			dayCounter: 3,
		});
	});

	test("écrire puis relire une référence redonne les mêmes parties", () => {
		const parts = { entryDate: "2015-06-01", dayCounter: 12 };

		expect(getReferenceParts(formatReference(parts))).toEqual(parts);
	});

	test.each([
		["260707.3", "un compteur à un chiffre"],
		["260707.00", "un compteur à zéro"],
		["261307.01", "un mois qui n'existe pas"],
		["260230.01", "un 30 février"],
		["TEST-20260713", "autre chose qu'une référence"],
	])("refuse %s : %s", (text) => {
		expect(parseReference(text)).toBeUndefined();
	});

	test("refuse d'écrire un centième vélo dans la journée", () => {
		expect(() =>
			formatReference({ entryDate: "2026-07-07", dayCounter: 100 }),
		).toThrow();
	});
});
