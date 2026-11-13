import { expect, test } from "vitest";
import { type Bike, EMPTY_BIKE_DESCRIPTION, type Exit } from "../bike/bike";
import { formatReference } from "../bike/reference";
import { type DetailRow, getBikeDetails } from "./bike-details";

const BIKE: Bike = {
	...EMPTY_BIKE_DESCRIPTION,
	reference: formatReference({ entryDate: "2018-11-21", dayCounter: 3 }),
	brand: "mistral",
	photos: [],
	status: "prêt à la vente",
};

test("un champ non renseigné reste sur la fiche, avec un tiret", () => {
	const rows = getBikeDetails(BIKE);

	expect(getValue(rows, "Modèle")).toBe("—");
	expect(getValue(rows, "Couleurs")).toBe("—");
	expect(getValue(rows, "Marque")).toBe("mistral");
});

test("la date d'entrée se lit dans la référence", () => {
	expect(getValue(getBikeDetails(BIKE), "Entré le")).toBe("21/11/2018");
});

test("un vélo sorti montre sa sortie, et seule une vente a un prix", () => {
	const donation = getBikeDetails(exited({ exitKind: "don", buyer: "Léa" }));
	const sale = getBikeDetails(
		exited({ exitKind: "vente", buyer: "Léa", price: 120 }),
	);

	expect(getValue(donation, "Acheteur")).toBe("Léa");
	expect(getValue(donation, "Prix")).toBeUndefined();
	expect(getValue(sale, "Prix")).toMatch(/^120,00\s€$/);
});

function exited(exit: Exit): Bike {
	return { ...BIKE, status: "sorti", exit, exitDate: "2026-11-13" };
}

function getValue(
	rows: readonly DetailRow[],
	label: string,
): string | undefined {
	return rows.find((row) => row.label === label)?.value;
}
