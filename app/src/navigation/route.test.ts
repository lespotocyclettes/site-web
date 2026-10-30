import { expect, test } from "vitest";
import { formatReference } from "../bike/reference";
import { formatRoute, IN_STOCK_ROUTE, parseRoute, type Route } from "./route";

test.each<Route>([
	{ screen: "recherche", search: { text: "", statuses: [], audiences: [] } },
	{
		screen: "recherche",
		search: { text: "peugeot", statuses: ["sorti"], audiences: ["enfant"] },
	},
	{
		screen: "velo",
		reference: formatReference({ entryDate: "2026-10-27", dayCounter: 1 }),
	},
	{ screen: "enregistrement" },
])("écrire puis relire l'adresse de $screen redonne le même écran", (route) => {
	expect(parseRoute(formatRoute(route))).toEqual(route);
});

test.each([
	["une référence mal tapée", "#velo/261027"],
	["une adresse vide", ""],
])("%s ramène à la recherche en stock", (_, hash) => {
	expect(parseRoute(hash)).toEqual(IN_STOCK_ROUTE);
});
