import { createButton } from "../lib/createButton.ts";
import { defineUserScript } from "../lib/runUserScripts.ts";
import { watchSelector } from "../lib/watchSelector.ts";
import { isAssociationSite } from "./isAssociationSite.ts";

/*
 * Les briques montrées : `watchSelector`, qui trouve chaque élément voulu, et
 * `createButton`, qui ajoute un bouton à côté.
 */
const INNER_TUBE_PRICE = 5;
const PATCH_PRICE = 0.5;
const PAGES_WITH_PRICES = ["/", "/nous-rejoindre/"];
const PRICE = /^\s*(\d+)\s*€\s*$/;

export default defineUserScript({
	name: "tarifs-en-chambres-a-air",
	match: (url) =>
		isAssociationSite(url) && PAGES_WITH_PRICES.includes(url.pathname),
	run() {
		watchSelector(document, "strong", function addConverter(price) {
			const euros = Number(price.textContent?.match(PRICE)?.[1]);
			if (!euros) return;

			const answer = document.createElement("small");
			const button = createButton({
				label: "🚲 En pièces ?",
				title: "Convertir en monnaie d'atelier",
				onClick() {
					const innerTubes = euros / INNER_TUBE_PRICE;
					const patches = euros / PATCH_PRICE;
					answer.textContent = ` ≈ ${innerTubes} chambres à air, ou ${patches} rustines.`;
				},
			});
			price.after(" ", button, answer);
		});
	},
});
