import { describe, expect, test } from "vitest";
import { isGuessed, overlay } from "./form-values";

describe("le formulaire affiche la saisie par-dessus l'inférence", () => {
	test("une valeur saisie gagne sur la valeur devinée", () => {
		const shown = overlay({ brand: "peugeot" }, { brand: "Peugeot" });

		expect(shown.brand).toBe("Peugeot");
	});

	test("une valeur effacée par le bénévole cache la valeur devinée", () => {
		const shown = overlay({ brand: "peugeot" }, { brand: null });

		expect(shown.brand).toBeNull();
	});

	test("une valeur devinée reste devinée tant que le bénévole n'y touche pas", () => {
		const inference = { brand: "peugeot", colors: ["bleu"] };
		const userInput = { brand: null };

		expect(isGuessed("colors", inference, userInput)).toBe(true);
		expect(isGuessed("brand", inference, userInput)).toBe(false);
	});
});
