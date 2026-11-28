import { defineUserScript } from "../lib/runUserScripts.ts";
import { isAssociationSite } from "./isAssociationSite.ts";

// La brique montrée : `styles`. Du CSS seul, pas une ligne de JavaScript.
const WRENCH_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="26" font-size="26">🔧</text></svg>',
)}") 4 4, auto`;

export default defineUserScript({
	name: "mode-cambouis",
	match: isAssociationSite,
	styles: `
		/* Trois taches de graisse : l'atelier a déjà servi. */
		body {
			background-image:
				radial-gradient(circle at 12% 18%, rgb(30 20 10 / 0.18) 0 3rem, transparent 3.2rem),
				radial-gradient(circle at 85% 40%, rgb(30 20 10 / 0.12) 0 5rem, transparent 5.3rem),
				radial-gradient(circle at 40% 85%, rgb(30 20 10 / 0.15) 0 2rem, transparent 2.2rem);
			background-attachment: fixed;
		}

		/* Ici, on visse. */
		body, a, button {
			cursor: ${WRENCH_CURSOR};
		}
	`,
});
