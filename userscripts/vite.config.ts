/*
 * Compile le bundle : le fichier `.user.js` que les postes installent.
 *
 * Règle d'or : aucune clé d'API, aucun mot de passe dans un userscript. Le fichier est servi
 * publiquement par le site de l'association, n'importe qui peut le lire. Et il n'en a pas
 * besoin : il tourne dans l'onglet de la personne connectée, avec ses droits à elle.
 */
import { styleText } from "node:util";
import { defineConfig, type Plugin } from "vite";
import livePreview from "vite-live-preview";

const NAME = "potocyclettes";
const PUBLISHED_URL = `https://www.lespotocyclettes.com/wp-content/plugins/lespotocyclettes/userscripts/${NAME}.user.js`;

// Les adresses où le gestionnaire de userscripts active le bundle.
const MATCHES = [
	"https://potocyclettes.paheko.cloud/*",
	"https://potocyclettes-preprod.paheko.cloud/*",
	// Pour la démo, qui ne tourne qu'en développement.
	"https://www.lespotocyclettes.com/*",
	"https://lespotocyclettes.com/*",
];
const MATCH_LINES = MATCHES.map((match) => `// @match        ${match}`).join(
	"\n",
);

export default defineConfig(({ mode }) => {
	const isDev = mode === "development";

	return {
		// En développement, public/ fournit le client de rechargement automatique.
		publicDir: isDev ? "public" : false,
		plugins: isDev
			? [
					devLoader(),
					livePreview({
						reload: true,
						// Le serveur de vite-live-preview ne reprend pas les extensions ci-dessus :
						// celle du message lui est passée ici.
						config: { plugins: [installMessage()] },
					}),
				]
			: [],
		build: {
			outDir: isDev ? "dist" : "../wp-plugin/userscripts",
			emptyOutDir: true,
			minify: false,
			// L'iPad de l'accueil n'a pas forcément le dernier Safari.
			target: ["es2020", "safari14"],
			rolldownOptions: {
				input: "src/index.ts",
				output: {
					// IIFE : un fichier unique qui démarre tout seul, la forme qu'attend un
					// gestionnaire de userscripts.
					format: "iife",
					entryFileNames: `${NAME}.user.js`,
					banner: isDev ? undefined : header(),
				},
			},
		},
	};
});

/*
 * L'en-tête que lit le gestionnaire de userscripts. Un poste ne se met à jour que si
 * @version augmente : la date et l'heure de compilation (2026-11-28T14:32 donne
 * 2026.1128.1432) augmentent à chaque déploiement.
 */
function header() {
	const now = new Date().toISOString();
	const version = `${now.slice(0, 4)}.${now.slice(5, 7)}${now.slice(8, 10)}.${now.slice(11, 13)}${now.slice(14, 16)}`;

	return `// ==UserScript==
// @name         Poto'Cyclettes
// @namespace    https://lespotocyclettes.com
// @description  Les retouches de Paheko par l'association.
// @version      ${version}
${MATCH_LINES}
// @updateURL    ${PUBLISHED_URL}
// @downloadURL  ${PUBLISHED_URL}
// @grant        none
// ==/UserScript==`;
}

/*
 * Le chargeur de développement : un second userscript, à installer une fois sur son propre
 * navigateur. Sur les mêmes adresses que le bundle, il charge la copie que sert
 * `npm run dev`, et le client qui recharge la page à chaque modification. Il n'existe pas
 * sur le disque : Vite le fabrique à chaque compilation de développement.
 */
function devLoader(): Plugin {
	return {
		name: "poto-dev-loader",

		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "dev-loader.user.js",
				source: `// ==UserScript==
// @name         Poto'Cyclettes · chargeur de développement
// @namespace    https://lespotocyclettes.com
// @description  Charge le bundle que sert npm run dev.
// @version      1
${MATCH_LINES}
// @grant        none
// ==/UserScript==

const DEV_SERVER = "http://localhost:4173/";
window.__POTO_DEV_SERVER__ = DEV_SERVER;

const client = document.createElement("script");
client.src = DEV_SERVER + "live-preview-client.js";
document.body.append(client);

// src/lib/devMode.ts reconnaît cette balise : la copie installée laisse alors la place.
const devScript = document.createElement("script");
devScript.id = "poto-dev-script";
devScript.src = DEV_SERVER + "${NAME}.user.js";
devScript.onload = () => { devScript.dataset.loadingState = "success"; };
devScript.onerror = () => { devScript.dataset.loadingState = "error"; };
document.body.append(devScript);
`,
			});
		},
	};
}

function installMessage(): Plugin {
	return {
		name: "poto-install-message",

		configurePreviewServer(server) {
			const { port } = server.config.preview;
			const rule = styleText(["bold", "yellow"], "====");
			const url = styleText(
				["bold", "cyan", "underline"],
				`http://localhost:${port}/dev-loader.user.js`,
			);
			console.info(`${rule}
${styleText("bold", "Installez le chargeur de développement en ouvrant cette adresse,")}
${styleText("bold", "avec votre gestionnaire de userscripts :")}
${url}

${styleText("dim", "(et désactivez, sur ce navigateur, la copie installée depuis le site)")}
${rule}`);
		},
	};
}
