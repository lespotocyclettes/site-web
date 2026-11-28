import { fileURLToPath } from "node:url";
import type { InlineConfig, Plugin } from "vite";
import livePreview from "vite-live-preview";
import type { Bundle } from "../bundles.ts";
import { DEV_SCRIPT_ID, DEV_SERVER_ORIGIN } from "../src/lib/devServer.ts";

export type Mode = "production" | "development";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLISHED_FOLDER = "../wp-plugin/userscripts";
const PUBLISHED_URL =
	"https://lespotocyclettes.com/wp-content/plugins/lespotocyclettes/userscripts";
const DEV_SERVER_PORT = Number(new URL(DEV_SERVER_ORIGIN).port);

/**
 * La configuration Vite d'un bundle. Une compilation par bundle : le format IIFE (un fichier
 * unique qui s'exécute tout seul, ce qu'attend un gestionnaire de userscripts) n'accepte
 * qu'un seul point d'entrée.
 */
export function createBundleConfig(bundle: Bundle, mode: Mode): InlineConfig {
	const isDev = mode === "development";

	return {
		configFile: false,
		root: ROOT,
		mode,
		// En développement, `public/` fournit le client de rechargement automatique.
		publicDir: isDev ? "public" : false,
		preview: { port: DEV_SERVER_PORT, strictPort: true },
		plugins: isDev ? [livePreview({ reload: true }), devLoader(bundle)] : [],
		build: {
			outDir: isDev ? "dist" : PUBLISHED_FOLDER,
			emptyOutDir: false,
			minify: false,
			// L'iPad de l'accueil n'a pas forcément le dernier Safari.
			target: ["es2020", "safari14"],
			watch: isDev ? {} : null,
			rolldownOptions: {
				input: `src/${bundle.name}/index.ts`,
				output: {
					format: "iife",
					entryFileNames: `${bundle.name}.user.js`,
					banner: isDev ? undefined : createHeader(bundle),
				},
			},
		},
	};
}

/*
 * L'en-tête que lit le gestionnaire de userscripts (Tampermonkey, Violentmonkey, l'app
 * Userscripts). Un poste ne se met à jour que si `@version` augmente : la date et l'heure
 * de compilation garantissent qu'elle augmente à chaque déploiement, sans y penser.
 */
function createHeader(bundle: Bundle): string {
	const url = `${PUBLISHED_URL}/${bundle.name}.user.js`;

	return formatHeader([
		["name", `Poto'Cyclettes · ${bundle.name}`],
		["namespace", "https://lespotocyclettes.com"],
		["description", bundle.description],
		["version", toVersion(new Date())],
		...bundle.matches.map((match) => ["match", match] as const),
		["updateURL", url],
		["downloadURL", url],
		["grant", "none"],
	]);
}

/*
 * Le chargeur de développement : un second userscript, à installer une fois sur son propre
 * navigateur. Sur les mêmes adresses que le bundle, il charge la copie que sert
 * `npm run dev`, et le client qui recharge la page à chaque modification.
 */
function devLoader(bundle: Bundle): Plugin {
	return {
		name: "poto-dev-loader",
		generateBundle() {
			const header = formatHeader([
				["name", `Poto'Cyclettes · ${bundle.name} (développement)`],
				["namespace", "https://lespotocyclettes.com"],
				[
					"description",
					"Charge la copie de développement servie par npm run dev.",
				],
				["version", "1"],
				...bundle.matches.map((match) => ["match", match] as const),
				["grant", "none"],
			]);

			this.emitFile({
				type: "asset",
				fileName: `${bundle.name}.dev.user.js`,
				source: `${header}

window.__POTO_DEV_SERVER__ = ${JSON.stringify(`${DEV_SERVER_ORIGIN}/`)};

const client = document.createElement("script");
client.src = ${JSON.stringify(`${DEV_SERVER_ORIGIN}/live-preview-client.js`)};
document.body.append(client);

const devScript = document.createElement("script");
devScript.id = ${JSON.stringify(DEV_SCRIPT_ID)};
devScript.src = ${JSON.stringify(`${DEV_SERVER_ORIGIN}/${bundle.name}.user.js`)};
devScript.onload = () => { devScript.dataset.loadingState = "success"; };
devScript.onerror = () => { devScript.dataset.loadingState = "error"; };
document.body.append(devScript);
`,
			});
		},
	};
}

function formatHeader(entries: readonly (readonly [string, string])[]): string {
	const lines = entries.map(([key, value]) => `// @${key.padEnd(12)} ${value}`);
	return ["// ==UserScript==", ...lines, "// ==/UserScript=="].join("\n");
}

/** `2026.1128.1432` : l'année, puis mois et jour, puis heure et minute, en temps universel. */
function toVersion(date: Date): string {
	const pad = (value: number) => String(value).padStart(2, "0");
	const monthAndDay = `${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
	const time = `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}`;
	return `${date.getUTCFullYear()}.${monthAndDay}.${time}`;
}
