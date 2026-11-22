/*
 * Le navigateur ne dit jamais quelle adresse précède l'entrée courante de l'historique.
 * Chaque entrée la note donc elle-même, à son arrivée, dans son `history.state` : l'état
 * qu'une entrée garde quand on la quitte et qu'on y revient.
 */

/** Ce que retient une entrée de l'historique : l'adresse d'où l'on est arrivé. */
type EntryState = { previousHash: string };

/**
 * Inscrit l'origine de chaque nouvelle entrée. Une entrée qui a déjà la sienne la garde :
 * en reculant puis en avançant, `hashchange` se déclenche aussi, avec une autre ancienne
 * adresse, qui n'est pas son origine.
 *
 * À installer avant le premier rendu : l'écouteur passe alors avant celui de l'écran, qui
 * lit l'origine pour se dessiner.
 */
export function listenToEntryOrigins(
	target: Pick<Window, "addEventListener" | "removeEventListener"> & {
		history: Pick<History, "state" | "replaceState">;
	},
): () => void {
	function recordOrigin(event: HashChangeEvent) {
		const isRecorded = isEntryState(target.history.state);
		/* navigate(…, { replace }) émet un hashchange sans ancienne adresse : ce n'est pas une arrivée. */
		const isArrival = event.oldURL !== "";
		if (isRecorded || !isArrival) return;

		const state: EntryState = { previousHash: new URL(event.oldURL).hash };
		target.history.replaceState(state, "");
	}

	target.addEventListener("hashchange", recordOrigin);
	return () => {
		target.removeEventListener("hashchange", recordOrigin);
	};
}

/**
 * L'adresse d'où l'on est arrivé, ou `null` pour un lien ouvert directement. Recharger la
 * page ne l'efface pas : le navigateur garde l'état de l'entrée.
 */
export function getPreviousHash(history: Pick<History, "state">): string | null {
	const state: unknown = history.state;
	return isEntryState(state) ? state.previousHash : null;
}

function isEntryState(state: unknown): state is EntryState {
	return (
		typeof state === "object" &&
		state !== null &&
		"previousHash" in state &&
		typeof state.previousHash === "string"
	);
}
