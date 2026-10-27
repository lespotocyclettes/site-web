import { expect, test } from "vitest";
import { formatReference } from "../bike/reference";
import { formatRoute, parseRoute, type Route } from "./route";

test.each<Route>([
	{ screen: "search" },
	{
		screen: "bike",
		reference: formatReference({ entryDate: "2026-10-27", dayCounter: 1 }),
	},
	{ screen: "registration" },
])("écrire puis relire l'adresse de $screen redonne le même écran", (route) => {
	expect(parseRoute(formatRoute(route))).toEqual(route);
});

test("une référence mal tapée dans l'adresse ramène à la recherche", () => {
	expect(parseRoute("#velo/261027")).toEqual({ screen: "search" });
});
