import type { MouseEvent } from "react";

/**
 * Un clic gauche sans touche enfoncée. Avec Ctrl, Cmd, Maj ou Alt, ou au clic du milieu,
 * le navigateur ouvre le lien ailleurs (nouvel onglet, nouvelle fenêtre) : on le laisse
 * faire.
 */
export function isPlainClick(event: MouseEvent): boolean {
	return (
		event.button === 0 &&
		!event.ctrlKey &&
		!event.metaKey &&
		!event.shiftKey &&
		!event.altKey
	);
}
