import { expect, test } from "vitest";
import { formatReference } from "../bike/reference";
import { IN_STOCK_SEARCH } from "../bike/search";
import { matchScreen } from "../navigation/define-route";
import { registrationRoute } from "./enregistrement";
import { IN_STOCK_HREF, ROUTES } from "./index";
import { searchRoute } from "./recherche";
import { bikeSheetRoute } from "./velo";

/* Les paramètres que l'écran reçoit quand on ouvre cette adresse. */
function openParams(href: string): unknown {
	return matchScreen(ROUTES, href)?.props;
}

test.each([
	["la recherche en stock", searchRoute.href(IN_STOCK_SEARCH), IN_STOCK_SEARCH],
	[
		"une recherche filtrée",
		searchRoute.href({
			text: "peugeot",
			statuses: ["sorti"],
			audiences: ["enfant"],
		}),
		{ text: "peugeot", statuses: ["sorti"], audiences: ["enfant"] },
	],
	[
		"une fiche",
		bikeSheetRoute.href(
			formatReference({ entryDate: "2026-10-27", dayCounter: 1 }),
		),
		formatReference({ entryDate: "2026-10-27", dayCounter: 1 }),
	],
	["l'enregistrement", registrationRoute.href(), undefined],
])(
	"ouvrir l'adresse de %s redonne ses paramètres à l'écran",
	(_, href, params) => {
		expect(openParams(href)).toEqual({ params });
	},
);

test.each([
	["une référence mal tapée", "#velo/261027"],
	["un écran inconnu", "#atelier"],
	["une adresse vide", ""],
])("%s ne mène à aucun écran", (_, hash) => {
	expect(matchScreen(ROUTES, hash)).toBeNull();
});

/* useScreen ouvre cette adresse quand les autres ne mènent nulle part : elle doit mener quelque part. */
test("l'adresse par défaut mène à un écran", () => {
	expect(matchScreen(ROUTES, IN_STOCK_HREF)).not.toBeNull();
});
