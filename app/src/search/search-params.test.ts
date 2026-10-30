import { expect, test } from "vitest";
import type { BikeSearch } from "../bike/search";
import { formatSearchParams, parseSearchParams } from "./search-params";

function roundTrip(search: BikeSearch): BikeSearch {
	return parseSearchParams(new URLSearchParams(formatSearchParams(search)));
}

test.each<BikeSearch>([
	{ text: "", statuses: [], audiences: [] },
	{
		text: "vélo à 3 vitesses & panier",
		statuses: ["à traiter", "prêt à la vente"],
		audiences: ["enfant"],
	},
])("écrire puis relire l'adresse redonne la même recherche", (search) => {
	expect(roundTrip(search)).toEqual(search);
});

test("une valeur inconnue dans l'adresse est ignorée", () => {
	const params = new URLSearchParams(
		"statut=volé&statut=sorti&public=chien&public=enfant",
	);

	expect(parseSearchParams(params)).toEqual({
		text: "",
		statuses: ["sorti"],
		audiences: ["enfant"],
	});
});

test("l'ordre des chips dans l'adresse ne change pas la recherche", () => {
	expect(
		parseSearchParams(new URLSearchParams("statut=sorti&statut=à+traiter")),
	).toEqual(
		parseSearchParams(new URLSearchParams("statut=à+traiter&statut=sorti")),
	);
});
