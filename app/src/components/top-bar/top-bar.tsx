import type { ReactNode } from "react";
import type { BackLinkProps } from "../../navigation/back-link";
import { ActionButton } from "../action-button/action-button";

/* La barre du haut d'un écran enfant : le retour, puis le titre de l'écran, centré. */
export function TopBar({
	back,
	title,
}: {
	back: BackLinkProps;
	title: ReactNode;
}) {
	return (
		<div className="top-bar">
			<ActionButton variant="ghost" size="small" {...back}>
				← Retour
			</ActionButton>
			<h1 className="title">{title}</h1>
		</div>
	);
}
