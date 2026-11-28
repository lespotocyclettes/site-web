import { debounceIdle } from "./idle.ts";

type Root = Document | Element;
type Unsubscribe = () => void;
type Subscribe<T> = (listener: (value: T) => void) => Unsubscribe;

/**
 * Appelle `callback` pour chaque élément qui correspond au sélecteur CSS : ceux déjà là, puis
 * ceux qui apparaîtront. Les sites modernes construisent leur page petit à petit, un élément
 * peut donc arriver bien après le chargement.
 *
 * Renvoie la fonction qui arrête la surveillance.
 */
export function watchSelector<T extends Element = Element>(
	root: Root,
	selector: string,
	callback: (element: T) => void,
): Unsubscribe {
	const subscribe = getSelectorWatcher(root, selector) as Subscribe<T>;

	root.querySelectorAll<T>(selector).forEach(callback);
	return subscribe(callback);
}

/** Attend le premier élément qui correspond au sélecteur, ou `null` passé le délai. */
export function waitQuerySelector<T extends Element = Element>(
	root: Root,
	selector: string,
	{ timeout = 10_000 }: { timeout?: number } = {},
): Promise<T | null> {
	const existing = root.querySelector<T>(selector);
	if (existing) return Promise.resolve(existing);

	return new Promise((resolve) => {
		const stopWatching = watchSelector<T>(root, selector, settle);
		const timeoutId = setTimeout(() => settle(null), timeout);

		function settle(element: T | null) {
			clearTimeout(timeoutId);
			stopWatching();
			resolve(element);
		}
	});
}

/*
 * Un seul MutationObserver (l'outil du navigateur qui signale les changements de la page)
 * pour toute la page, et un seul guetteur par couple racine + sélecteur, quel que soit le
 * nombre de scripts qui s'y abonnent. Chacun s'arrête quand son dernier abonné part.
 */
const subscribeToMutations = refCounted<void>(function observeBody(emit) {
	const observer = new MutationObserver(() => emit());
	observer.observe(document.body, { childList: true, subtree: true });
	return () => observer.disconnect();
});

const watchersByRoot = new WeakMap<Root, Map<string, Subscribe<Element>>>();

function getSelectorWatcher(root: Root, selector: string): Subscribe<Element> {
	const watchers = watchersByRoot.get(root) ?? new Map();
	watchersByRoot.set(root, watchers);

	const existing = watchers.get(selector);
	if (existing) return existing;

	const watcher = refCounted<Element>(function watchNewElements(emit) {
		let known = new Set(root.querySelectorAll(selector));

		return subscribeToMutations(
			debounceIdle(function emitNewElements() {
				const current = new Set(root.querySelectorAll(selector));
				for (const element of current) {
					if (!known.has(element)) emit(element);
				}
				known = current;
			}),
		);
	});
	watchers.set(selector, watcher);
	return watcher;
}

/** Démarre une source au premier abonné, l'arrête au départ du dernier. */
function refCounted<T>(
	start: (emit: (value: T) => void) => Unsubscribe,
): Subscribe<T> {
	const listeners = new Set<(value: T) => void>();
	let stop: Unsubscribe | undefined;

	return function subscribe(listener) {
		listeners.add(listener);
		stop ??= start(function emit(value) {
			for (const each of listeners) each(value);
		});

		return function unsubscribe() {
			listeners.delete(listener);
			if (listeners.size > 0) return;

			stop?.();
			stop = undefined;
		};
	};
}
