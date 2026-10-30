import type { Audience, Bike } from "./bike";
import { isInStock, STATUSES, type Status } from "./status";

/*
 * Ce que le bénévole cherche. Une liste vide ne filtre rien : aucune chip cochée, c'est
 * tous les vélos.
 */
export type BikeSearch = {
	/** Cherché dans la référence, la marque et le modèle. */
	text: string;
	statuses: readonly Status[];
	audiences: readonly Audience[];
};

/** La vue d'arrivée : les vélos encore chez nous, quel que soit leur public. */
export const IN_STOCK_SEARCH: BikeSearch = {
	text: "",
	statuses: STATUSES.filter(isInStock),
	audiences: [],
};

/*
 * La règle de la recherche. Le faux relais l'applique telle quelle ; le relais PHP devra
 * donner les mêmes réponses.
 */
export function matchesSearch(bike: Bike, search: BikeSearch): boolean {
	return (
		matchesText(bike, search.text) &&
		isAmongChecked(search.statuses, bike.status) &&
		isAmongChecked(search.audiences, bike.audience)
	);
}

function matchesText(bike: Bike, text: string): boolean {
	const needle = text.trim().toLowerCase();
	const haystack = [bike.reference, bike.brand, bike.model]
		.join(" ")
		.toLowerCase();
	return haystack.includes(needle);
}

/** Un vélo dont le public n'est pas renseigné ne sort que si aucun public n'est coché. */
function isAmongChecked<T>(checked: readonly T[], value: T | null): boolean {
	if (checked.length === 0) {
		return true;
	}

	return value !== null && checked.includes(value);
}
