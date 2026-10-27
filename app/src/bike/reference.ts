import type { IsoDate } from "./iso-date";

declare const referenceBrand: unique symbol;

/**
 * Une référence au format `AAMMJJ.NN` (voir le glossaire métier). La marque `referenceBrand`
 * n'existe que pour TypeScript : une chaîne quelconque ne peut pas se faire passer pour une
 * référence, il faut passer par `parseReference` ou `formatReference`.
 */
export type Reference = string & { readonly [referenceBrand]: true };

export type ReferenceParts = {
	entryDate: IsoDate;
	/** 3 pour le troisième vélo enregistré ce jour-là. */
	dayCounter: number;
};

const REFERENCE_PATTERN = /^(\d{2})(\d{2})(\d{2})\.(\d{2})$/;

/** Deux chiffres dans la référence : au-delà de 99 vélos par jour, elle ne s'écrit plus. */
const MAX_DAY_COUNTER = 99;

export function parseReference(text: string): Reference | undefined {
	const match = REFERENCE_PATTERN.exec(text.trim());
	if (!match) return undefined;

	const [, year, month, day, counter] = match;
	const isDateValid = isExistingDate(`20${year}-${month}-${day}`);
	const isCounterValid = Number(counter) >= 1;
	if (!isDateValid || !isCounterValid) return undefined;

	return match[0] as Reference;
}

export function formatReference({
	entryDate,
	dayCounter,
}: ReferenceParts): Reference {
	const isCounterInRange = dayCounter >= 1 && dayCounter <= MAX_DAY_COUNTER;
	if (!isCounterInRange) {
		throw new Error(`day counter out of range : ${dayCounter}`);
	}

	const yymmdd = entryDate.slice(2).replaceAll("-", "");
	const counter = String(dayCounter).padStart(2, "0");
	return `${yymmdd}.${counter}` as Reference;
}

/** La date d'entrée ne se saisit jamais : elle se lit dans la référence. */
export function getReferenceParts(reference: Reference): ReferenceParts {
	const year = reference.slice(0, 2);
	const month = reference.slice(2, 4);
	const day = reference.slice(4, 6);
	return {
		entryDate: `20${year}-${month}-${day}`,
		dayCounter: Number(reference.slice(7)),
	};
}

/** Écarte les dates qui ont la bonne forme mais n'existent pas, comme le 30 février. */
function isExistingDate(isoDate: IsoDate): boolean {
	const date = new Date(`${isoDate}T00:00:00Z`);
	const isParsed = !Number.isNaN(date.getTime());
	return isParsed && date.toISOString().startsWith(isoDate);
}
