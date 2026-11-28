import { defineUserScript } from "../lib/runUserScripts.ts";

/*
 * La préprod (l'environnement d'essai) ressemble trait pour trait à la vraie Paheko. Ce
 * bandeau évite d'y saisir un vrai adhérent, ou de tester sur la vraie en croyant être à
 * l'essai.
 */
export default defineUserScript({
	name: "bandeau-preprod",
	match: (url) => url.hostname === "potocyclettes-preprod.paheko.cloud",
	styles: `
		body::before {
			content: "PRÉPROD · environnement d'essai, rien n'est réel ici";
			position: sticky;
			top: 0;
			z-index: 9999;
			display: block;
			padding: 0.4em;
			background: repeating-linear-gradient(-45deg, #ffd400 0 1em, #1a1a1a 1em 2em);
			color: #fff;
			font-weight: bold;
			text-align: center;
			text-shadow: 0 0 3px #000, 0 0 3px #000;
		}
	`,
});
