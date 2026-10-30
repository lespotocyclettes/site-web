/**
 * Les valeurs restent en français : elles s'affichent et s'exportent telles quelles. Une
 * liste plutôt qu'un simple type : une adresse tapée à la main se vérifie contre elle.
 */
export const STATUSES = [
	"à traiter",
	"prêt à la vente",
	"sorti",
	"démonté",
] as const;

export type Status = (typeof STATUSES)[number];

/** Un vélo à traiter peut sortir en l'état, ou partir au démontage sans être réparé. */
const NEXT_STATUSES = {
	"à traiter": ["prêt à la vente", "sorti", "démonté"],
	"prêt à la vente": ["sorti", "démonté"],
	sorti: [],
	démonté: [],
} as const satisfies Record<Status, readonly Status[]>;

export function getNextStatuses(status: Status): readonly Status[] {
	return NEXT_STATUSES[status];
}

export function isTransitionAllowed(from: Status, to: Status): boolean {
	return getNextStatuses(from).includes(to);
}

/** « En stock » n'est pas un statut : c'est tout vélo encore chez nous. */
export function isInStock(
	status: Status,
): status is "à traiter" | "prêt à la vente" {
	return status === "à traiter" || status === "prêt à la vente";
}
