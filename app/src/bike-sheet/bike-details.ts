import type { Bike, Exit } from "../bike/bike";
import { formatFrenchDate, type IsoDate } from "../bike/iso-date";
import { getReferenceParts } from "../bike/reference";

export type DetailRow = { label: string; value: string };

/** Un champ vide reste visible : on voit d'un coup d'œil ce qui reste à compléter. */
const NOT_FILLED = "—";

/**
 * Le recto de la fiche, ligne par ligne, sauf ce que BikeIdentity affiche déjà en tête
 * (statut, type, public, marque, modèle). Un vélo sorti y ajoute sa sortie.
 */
export function getBikeDetails(bike: Bike): readonly DetailRow[] {
	const { entryDate } = getReferenceParts(bike.reference);
	const rows: readonly DetailRow[] = [
		{ label: "Entré le", value: formatFrenchDate(entryDate) },
		{ label: "Forme du cadre", value: bike.frameShape ?? NOT_FILLED },
		{ label: "Changement de vitesses", value: bike.gearShift ?? NOT_FILLED },
		{ label: "Triage", value: bike.triage ?? NOT_FILLED },
		{ label: "Couleurs", value: formatList(bike.colors) },
		{ label: "Caractéristiques", value: formatList(bike.features) },
		{ label: "Donateur", value: bike.donor ?? NOT_FILLED },
	];
	if (bike.status !== "sorti") return rows;

	return [...rows, ...getExitDetails(bike.exit, bike.exitDate)];
}

function getExitDetails(exit: Exit, exitDate: IsoDate): readonly DetailRow[] {
	const rows: readonly DetailRow[] = [
		{ label: "Sorti le", value: formatFrenchDate(exitDate) },
		{ label: "Type de sortie", value: exit.exitKind },
		{ label: "Acheteur", value: exit.buyer },
	];
	if (exit.exitKind === "don") return rows;

	return [...rows, { label: "Prix", value: formatEuros(exit.price) }];
}

function formatList(values: readonly string[]): string {
	if (values.length === 0) return NOT_FILLED;

	return values.join(", ");
}

function formatEuros(price: number): string {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price);
}
