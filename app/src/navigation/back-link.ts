import type { MouseEvent } from "react";
import { getPreviousHash } from "./entry-origin";

/** Ce que fait un retour : remonter l'historique, ou ouvrir une adresse comme un lien. */
export type BackLink =
	| { kind: "history-back"; href: string }
	| { kind: "navigate"; href: string };

/**
 * Où mène un retour vers `target`. Arrivé du même écran que `target`, quels que soient ses
 * paramètres après le `?`, on remonte l'historique : l'écran revient tel qu'on l'avait
 * laissé, filtres et défilement compris. Sinon (lien ouvert directement, arrivée d'un autre
 * écran), on ouvre `target`, sans jamais quitter l'app.
 *
 * `href` sert dans les deux cas : c'est la cible du lien, qu'un clic du milieu ouvre dans
 * un nouvel onglet.
 */
export function getBackLink(
	target: string,
	locationState: { previousHash?: string | null },
): BackLink {
	const { previousHash } = locationState;
	const isFromTarget =
		typeof previousHash === "string" &&
		getScreenPath(previousHash) === getScreenPath(target);
	if (isFromTarget) return { kind: "history-back", href: previousHash };

	return { kind: "navigate", href: target };
}

/** De quoi faire d'un lien un retour vers `target` : `<ActionButton {...getBackLinkProps(…)}>`. */
export function getBackLinkProps(
	target: string,
	history: Pick<History, "state" | "back">,
) {
	const backLink = getBackLink(target, {
		previousHash: getPreviousHash(history),
	});

	return {
		href: backLink.href,
		onClick(event: MouseEvent<HTMLAnchorElement>) {
			/* Ctrl ou Cmd + clic ouvre un nouvel onglet : le navigateur s'en charge. */
			const isPlainClick =
				event.button === 0 &&
				!event.ctrlKey &&
				!event.metaKey &&
				!event.shiftKey &&
				!event.altKey;

			if (backLink.kind === "history-back" && isPlainClick) {
				event.preventDefault();
				history.back();
			}
		},
	};
}

/** `#recherche?q=peugeot` → `#recherche` : l'écran, sans ses paramètres. */
function getScreenPath(hash: string): string {
	const [path = ""] = hash.split("?", 1);
	return path;
}
