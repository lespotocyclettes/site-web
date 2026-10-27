import type { BikeDescription } from "../bike/bike";
import type { Inference } from "../bike-store/bike-store";

/*
 * Le formulaire d'enregistrement garde deux jeux de valeurs séparés : ce que l'inférence a
 * deviné, et ce que le bénévole a saisi. Ce qui s'affiche, c'est la saisie posée par-dessus
 * l'inférence. Reprendre la photo remplace l'inférence et ne touche jamais la saisie.
 */

export type InferenceValues = Partial<Inference>;

/**
 * Une clé présente gagne toujours sur l'inférence, même à `null` : c'est ainsi que le
 * bénévole efface une valeur devinée.
 */
export type UserInputValues = Partial<BikeDescription>;

export function overlay(
	inference: InferenceValues,
	userInput: UserInputValues,
): Partial<BikeDescription> {
	return { ...inference, ...userInput };
}

/** Une valeur devinée s'affiche autrement, jusqu'au submit qui la confirme. */
export function isGuessed(
	name: keyof BikeDescription,
	inference: InferenceValues,
	userInput: UserInputValues,
): boolean {
	const isTypedByUser = name in userInput;
	const isFilledByInference = name in inference;
	return isFilledByInference && !isTypedByUser;
}
