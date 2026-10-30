import { useMemo, useSyncExternalStore } from "react";
import { parseRoute, type Route } from "./route";

/**
 * Redessine le composant à chaque changement du `#` de l'adresse. La route n'est relue que
 * si l'adresse a changé : même adresse, même objet, ce qu'attend useDeferredValue pour ne
 * pas recalculer l'écran pour rien.
 */
export function useRoute(): Route {
	const hash = useSyncExternalStore(subscribeToHash, getHash);
	return useMemo(() => parseRoute(hash), [hash]);
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
