/**
 * Une date sans heure, écrite `AAAA-MM-JJ` (par exemple `2026-07-07`). C'est la forme que
 * Teable et le JSON transportent ; on la garde telle quelle plutôt que de la convertir en
 * objet `Date`, qui porte une heure et un fuseau dont on n'a pas besoin.
 */
export type IsoDate = string;

/** La date du jour à l'heure de l'atelier, pas à celle de Greenwich comme `toISOString`. */
export function getTodayIsoDate(): IsoDate {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}
