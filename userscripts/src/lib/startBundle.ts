import { isReplacedByDevCopy } from "./devMode.ts";
import { runUserScripts, type UserScript } from "./runUserScripts.ts";

/** Le point de départ d'un bundle : lance ses scripts, sauf si une copie de développement le remplace. */
export async function startBundle(
	userScripts: readonly UserScript[],
): Promise<void> {
	if (await isReplacedByDevCopy()) {
		console.info(
			"[poto] Copie de développement détectée : la copie installée lui laisse la place.",
		);
		return;
	}

	await runUserScripts(userScripts);
}
