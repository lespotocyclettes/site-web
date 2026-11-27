import type { MouseEvent } from "react";
import { getPreviousHash } from "./entry-origin";
import { isPlainClick } from "./plain-click";

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
			if (backLink.kind === "history-back" && isPlainClick(event)) {
				event.preventDefault();
				history.back();
			}
		},
	};
}

export type BackLinkProps = ReturnType<typeof getBackLinkProps>;

/** `#recherche?q=peugeot` → `#recherche` : l'écran, sans ses paramètres. */
function getScreenPath(hash: string): string {
	const [path = ""] = hash.split("?", 1);
	return path;
}
