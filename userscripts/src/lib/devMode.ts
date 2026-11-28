const DEV_SERVER_ORIGIN = "http://localhost:4173";
const DEV_SCRIPT_ID = "poto-dev-script";

/*
 * Sur le poste du développeur, deux copies d'un bundle peuvent cohabiter : celle installée
 * depuis le site, et celle que `npm run dev` sert depuis sa machine. Sans arbitre, chaque
 * script tournerait deux fois. La copie de développement gagne, si elle arrive à se charger.
 *
 * `document.currentScript` ne se lit qu'à l'exécution immédiate du fichier : d'où cette
 * constante, calculée au chargement et pas dans la fonction.
 */
const currentScript = document.currentScript;
const isDevCopy =
	currentScript instanceof HTMLScriptElement &&
	currentScript.src.startsWith(DEV_SERVER_ORIGIN);

/** Vrai si cette copie est l'installée, et qu'une copie de développement prend sa place. */
export async function isReplacedByDevCopy(): Promise<boolean> {
	if (isDevCopy) return false;

	// Laisse au chargeur de développement, lancé juste après nous, le temps d'ajouter sa balise.
	await Promise.resolve();

	const devScript = document.getElementById(DEV_SCRIPT_ID);
	if (!(devScript instanceof HTMLScriptElement)) return false;

	return hasLoaded(devScript);
}

function hasLoaded(script: HTMLScriptElement): Promise<boolean> {
	const { loadingState } = script.dataset;
	if (loadingState) return Promise.resolve(loadingState === "success");

	return new Promise((resolve) => {
		script.addEventListener("load", () => resolve(true), { once: true });
		script.addEventListener("error", () => resolve(false), { once: true });
	});
}
