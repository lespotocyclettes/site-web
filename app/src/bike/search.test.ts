import { describe, expect, test } from "vitest";
import { type Bike, EMPTY_BIKE_DESCRIPTION } from "./bike";
import { formatReference } from "./reference";
import { type BikeSearch, IN_STOCK_SEARCH, matchesSearch } from "./search";

const ANY_BIKE: Bike = {
	...EMPTY_BIKE_DESCRIPTION,
	reference: formatReference({ entryDate: "2026-10-27", dayCounter: 1 }),
	photos: [],
	status: "à traiter",
};

const EVERYTHING: BikeSearch = { text: "", statuses: [], audiences: [] };

describe("le texte", () => {
	test.each([
		["la référence", "261027", ANY_BIKE],
		["la marque", "peugeot", { ...ANY_BIKE, brand: "Peugeot" }],
		["le modèle", "montreux", { ...ANY_BIKE, model: "Montreux" }],
	])(
		"est cherché dans %s, sans tenir compte des majuscules",
		(_, text, bike) => {
			expect(matchesSearch(bike, { ...EVERYTHING, text })).toBe(true);
		},
	);
});

test("aucune chip cochée laisse passer tous les vélos", () => {
	const sold: Bike = {
		...ANY_BIKE,
		status: "sorti",
		exit: { exitKind: "don", buyer: "une famille" },
		exitDate: "2026-10-28",
	};

	expect(matchesSearch(sold, EVERYTHING)).toBe(true);
});

describe("« un vélo enfant en stock ? »", () => {
	const childrenInStock: BikeSearch = {
		...IN_STOCK_SEARCH,
		audiences: ["enfant"],
	};

	test("trouve un vélo enfant prêt à la vente", () => {
		const bike: Bike = {
			...ANY_BIKE,
			audience: "enfant",
			status: "prêt à la vente",
		};

		expect(matchesSearch(bike, childrenInStock)).toBe(true);
	});

	test("écarte un vélo enfant déjà sorti", () => {
		const bike: Bike = {
			...ANY_BIKE,
			audience: "enfant",
			status: "sorti",
			exit: { exitKind: "don", buyer: "une famille" },
			exitDate: "2026-10-28",
		};

		expect(matchesSearch(bike, childrenInStock)).toBe(false);
	});

	test("écarte un vélo dont le public n'est pas renseigné", () => {
		expect(matchesSearch(ANY_BIKE, childrenInStock)).toBe(false);
	});
});
