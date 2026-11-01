import { expect, test } from "vitest";
import type { BikeSearch } from "../bike/search";
import { searchCodec } from "./search-params";

test.each<BikeSearch>([
	{ text: "", statuses: [], audiences: [] },
	{
		text: "vélo à 3 vitesses & panier",
		statuses: ["à traiter", "prêt à la vente"],
		audiences: ["enfant"],
	},
])("écrire puis relire l'adresse redonne la même recherche", (search) => {
	expect(searchCodec.decode(searchCodec.encode(search))).toEqual(search);
});

test("une valeur inconnue dans l'adresse est ignorée", () => {
	expect(
		searchCodec.decode("?statut=volé&statut=sorti&public=chien&public=enfant"),
	).toEqual({ text: "", statuses: ["sorti"], audiences: ["enfant"] });
});

test("l'ordre des chips dans l'adresse ne change pas la recherche", () => {
	expect(searchCodec.decode("?statut=sorti&statut=à+traiter")).toEqual(
		searchCodec.decode("?statut=à+traiter&statut=sorti"),
	);
});
