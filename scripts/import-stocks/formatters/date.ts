import { addDays, format } from "date-fns";

export function dateFormatter(
	date: string | number | undefined,
): string | undefined {
	if (!date) return undefined;
	const dateAsNumber = Number(date);
	if (Number.isNaN(dateAsNumber)) return undefined;

	// excel utilise un format de date spécial, qui correspond au nombre de jours écoulés depuis le premier janvier 1900
	const dateZero = new Date(1900, 0, 1);
	return format(addDays(dateZero, dateAsNumber), "yyyy-MM-dd");
}
