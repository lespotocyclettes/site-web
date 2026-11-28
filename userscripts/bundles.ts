/*
 * La liste des bundles. Un bundle, c'est un fichier `.user.js` compilé pour un site : on
 * l'installe sur les postes qui travaillent sur ce site. Son code part de `src/<name>/index.ts`.
 *
 * Règle d'or : aucune clé d'API, aucun mot de passe dans un userscript. Le fichier est servi
 * publiquement par le site de l'association, n'importe qui peut le lire. Et il n'en a pas
 * besoin : il tourne dans l'onglet de la personne connectée, avec ses droits à elle.
 */

export type Bundle = Readonly<{
	name: string;
	description: string;
	/** Les adresses où le gestionnaire de userscripts active le bundle (`@match`). */
	matches: readonly string[];
}>;

export const bundles = [
	{
		name: "demo",
		description:
			"Démonstration : trois retouches pour rire sur le site de l'association.",
		matches: ["https://lespotocyclettes.com/*"],
	},
	{
		name: "paheko",
		description:
			"Retouches de Paheko, la gestion des adhérents et de la caisse.",
		matches: [
			"https://potocyclettes.paheko.cloud/*",
			"https://potocyclettes-preprod.paheko.cloud/*",
		],
	},
] as const satisfies readonly Bundle[];
