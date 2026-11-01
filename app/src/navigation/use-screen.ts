import { type ReactElement, useMemo, useSyncExternalStore } from "react";
import { matchScreen, type ScreenRoute } from "./define-route";

/**
 * L'écran que désigne l'adresse, redessiné à chaque changement du `#`. Une adresse inconnue
 * ou mal tapée ouvre `fallback` plutôt qu'une page vide.
 *
 * L'écran n'est recalculé que si l'adresse a changé : même adresse, mêmes paramètres, ce
 * qu'attend useDeferredValue pour ne pas relancer l'écran pour rien.
 */
export function useScreen(
	routes: readonly ScreenRoute[],
	fallback: string,
): ReactElement {
	const hash = useSyncExternalStore(subscribeToHash, getHash);
	return useMemo(() => {
		const screen = matchScreen(routes, hash) ?? matchScreen(routes, fallback);
		if (!screen) {
			throw new Error(`l'adresse par défaut ${fallback} ne mène à aucun écran`);
		}

		return screen;
	}, [routes, fallback, hash]);
}

function subscribeToHash(onChange: () => void) {
	window.addEventListener("hashchange", onChange);
	return () => {
		window.removeEventListener("hashchange", onChange);
	};
}

function getHash() {
	return window.location.hash;
}
