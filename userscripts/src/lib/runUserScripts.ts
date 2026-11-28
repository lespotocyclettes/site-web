import { appendStyle } from "./appendStyle.ts";

export type UserScript = Readonly<{
	name: string;
	/**
	 * Dit si le script concerne la page dont on lui donne l'adresse. Une fonction plutôt
	 * qu'un motif : les écrans de Paheko se distinguent souvent par un paramètre d'adresse
	 * (`?id=…`), qu'un motif décrit mal. `URLPattern`, l'outil du navigateur qui compare une
	 * adresse à un motif, ferait l'affaire le jour où l'iPad le connaîtra : il est arrivé
	 * tard dans Safari, sa compatibilité reste à vérifier.
	 */
	match: (url: URL) => boolean;
	/** Du CSS ajouté à la page, avant `run`. */
	styles?: string;
	run?: () => void | Promise<void>;
}>;

/** Ne fait rien : il donne seulement son type au script, pour que l'éditeur aide à l'écrire. */
export function defineUserScript(userScript: UserScript): UserScript {
	return userScript;
}

/**
 * Lance chaque script qui concerne la page courante. Un script qui plante n'empêche pas les
 * autres de tourner, et laisse la page telle quelle.
 */
export async function runUserScripts(
	userScripts: readonly UserScript[],
): Promise<void> {
	await whenDocumentReady();

	const url = new URL(window.location.href);
	const matching = userScripts.filter((userScript) => userScript.match(url));
	if (matching.length === 0) return;

	console.info(
		`[poto] Scripts lancés : ${matching.map((userScript) => userScript.name).join(", ")}`,
	);

	const styles = matching
		.filter((userScript) => userScript.styles)
		.map(
			(userScript) => `/* === ${userScript.name} === */\n${userScript.styles}`,
		)
		.join("\n\n");
	if (styles) appendStyle(styles, "poto-userscripts-styles");

	await Promise.all(matching.map(runSafely));
}

/*
 * Un userscript ajoute un confort, il ne porte rien d'indispensable : s'il plante, la page
 * doit rester utilisable comme sans lui. L'erreur va donc dans la console du navigateur,
 * où le développeur la retrouve, sans rien afficher aux bénévoles.
 */
async function runSafely(userScript: UserScript) {
	try {
		await userScript.run?.();
	} catch (error) {
		console.error(`[poto] ${userScript.name} a planté :`, error);
	}
}

function whenDocumentReady(): Promise<void> {
	if (document.readyState !== "loading") return Promise.resolve();

	return new Promise((resolve) => {
		document.addEventListener("DOMContentLoaded", () => resolve(), {
			once: true,
		});
	});
}
