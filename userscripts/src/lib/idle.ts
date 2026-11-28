/*
 * Une page en pleine construction déclenche des centaines de changements à la suite. Plutôt
 * que de réagir à chacun, on attend que le navigateur souffle : c'est le rôle de
 * `requestIdleCallback`. Safari (donc l'iPad) ne la connaît pas : on s'y rabat sur un court
 * minuteur, qui regroupe aussi les changements d'une même rafale.
 */
const MAX_WAIT_MS = 1000;
const FALLBACK_DELAY_MS = 50;

type Cancel = () => void;

/** Appelle `callback` une seule fois, quand les appels cessent et que la page est au repos. */
export function debounceIdle(callback: () => void): () => void {
	let cancelPrevious: Cancel = noop;

	return function scheduleCallback() {
		cancelPrevious();
		cancelPrevious = requestIdle(callback);
	};
}

function requestIdle(callback: () => void): Cancel {
	const isIdleCallbackSupported =
		typeof window.requestIdleCallback === "function";
	if (!isIdleCallbackSupported) {
		const timeoutId = setTimeout(callback, FALLBACK_DELAY_MS);
		return () => clearTimeout(timeoutId);
	}

	const idleId = window.requestIdleCallback(callback, { timeout: MAX_WAIT_MS });
	return () => window.cancelIdleCallback(idleId);
}

function noop() {}
