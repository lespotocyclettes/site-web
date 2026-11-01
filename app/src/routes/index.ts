import { IN_STOCK_SEARCH } from "../bike/search";
import type { ScreenRoute } from "../navigation/define-route";
import { registrationRoute } from "./enregistrement";
import { searchRoute } from "./recherche";
import { bikeSheetRoute } from "./velo";

/*
 * Toutes les adresses de l'app, une par fichier de ce dossier. Un écran ajouté ici devient
 * atteignable ; oublié, son adresse ouvre l'écran par défaut.
 */
export const ROUTES: readonly ScreenRoute[] = [
	searchRoute,
	bikeSheetRoute,
	registrationRoute,
];

/** Là où arrive le bénévole : le lien du menu, une adresse vide ou mal tapée. */
export const IN_STOCK_HREF = searchRoute.href(IN_STOCK_SEARCH);
