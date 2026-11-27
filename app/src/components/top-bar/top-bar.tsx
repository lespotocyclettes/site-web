import type { BackLinkProps } from "../../navigation/back-link";
import { ActionButton } from "../action-button/action-button";

/*
 * La barre du haut d'un écran enfant : le retour, puis le titre de l'écran. Sans titre
 * (`null`), l'écran place son h1 ailleurs : la fiche vélo, dont le h1 est la référence,
 * dans la carte.
 */
export function TopBar({
	back,
	title,
}: {
	back: BackLinkProps;
	title: string | null;
}) {
	return (
		<div className="top-bar">
			<ActionButton variant="secondary" size="small" {...back}>
				← Retour
			</ActionButton>
			{title !== null && <h1 className="title">{title}</h1>}
		</div>
	);
}
