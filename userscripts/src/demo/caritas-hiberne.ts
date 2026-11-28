import { defineUserScript } from "../lib/runUserScripts.ts";
import { waitQuerySelector } from "../lib/watchSelector.ts";
import { isAssociationSite } from "./isAssociationSite.ts";

/*
 * Les briques montrées : `match`, qui peut tester autre chose que l'adresse (ici, la
 * saison), et `waitQuerySelector`, qui attend un élément avant d'agir.
 */
const NOVEMBER = 10;
const MARCH = 2;

function isWinter(date: Date) {
	const month = date.getMonth();
	return month >= NOVEMBER || month <= MARCH;
}

export default defineUserScript({
	name: "caritas-hiberne",
	match: (url) => isAssociationSite(url) && isWinter(new Date()),
	styles: `
		.poto-hibernation {
			display: inline-block;
			padding: 0.25em 0.75em;
			border-radius: 1em;
			background: #dff1ff;
			color: #0b3a5c;
		}
	`,
	async run() {
		const footer = await waitQuerySelector(document, "footer");
		if (!footer) return;

		const wednesdayHours = [...footer.querySelectorAll("p")].filter(
			(paragraph) => paragraph.textContent?.includes("mercredis"),
		);
		for (const paragraph of wednesdayHours) {
			const notice = document.createElement("p");
			notice.className = "poto-hibernation";
			notice.textContent =
				"❄️ Caritas hiberne jusqu'en avril. Les vélos aussi, mais eux n'ont pas eu le choix.";
			paragraph.after(notice);
		}
	},
});
