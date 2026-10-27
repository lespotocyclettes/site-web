import { useSyncExternalStore } from "react";
import { parseRoute, type Route } from "./route";

/** Redessine le composant à chaque changement du `#` de l'adresse. */
export function useRoute(): Route {
	const hash = useSyncExternalStore(subscribeToHash, getHash);
	return parseRoute(hash);
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
