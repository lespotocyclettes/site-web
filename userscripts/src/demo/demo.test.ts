import { afterEach, expect, it, vi } from "vitest";
import caritasHiberne from "./caritas-hiberne.ts";
import tarifsEnChambresAAir from "./tarifs-en-chambres-a-air.ts";

// Extraits du vrai site, relevés en novembre 2026 : si le site change, ces tests ne le verront pas.
afterEach(() => {
	document.body.innerHTML = "";
	vi.useRealTimers();
});

it("tarifs-en-chambres-a-air : convertit un tarif en pièces d'atelier", async () => {
	document.body.innerHTML =
		"<p><strong>15€</strong></p><p><strong>entre 10€ et 20€</strong></p>";

	await tarifsEnChambresAAir.run?.();
	const buttons = document.querySelectorAll("button");
	buttons[0]?.click();

	expect(buttons).toHaveLength(1);
	await vi.waitFor(() =>
		expect(document.body.textContent).toContain(
			"≈ 3 chambres à air, ou 30 rustines.",
		),
	);
});

it("caritas-hiberne : tourne l'hiver seulement, et se pose sous les horaires du mercredi", async () => {
	vi.useFakeTimers({ toFake: ["Date"] });
	vi.setSystemTime(new Date("2026-07-14"));
	expect(caritasHiberne.match(new URL(window.location.href))).toBe(false);
	vi.setSystemTime(new Date("2026-11-28"));
	expect(caritasHiberne.match(new URL(window.location.href))).toBe(true);

	document.body.innerHTML =
		"<footer><p>Ateliers : les mercredis de 17h30 à 19h30</p></footer>";
	await caritasHiberne.run?.();

	expect(document.querySelector(".poto-hibernation")?.textContent).toContain(
		"Caritas hiberne",
	);
});
