import type { ReactNode } from "react";
import type { Bike } from "../../bike/bike";
import { ContentCard } from "../content-card/content-card";

/*
 * Ce qui identifie le vélo, dans le même ordre sur la carte de recherche et sur la fiche :
 * la référence, puis marque · modèle, puis type · public, et le statut en petit. Une ligne
 * dont aucun champ n'est rempli n'est pas affichée.
 *
 * Se place dans une ContentCard.Root, sous la photo. Sur la fiche, la référence est le titre
 * de l'écran (titleAs="h1"), et les actions s'alignent à sa droite.
 */
export function BikeIdentity({
	bike,
	titleAs,
	actions,
}: {
	bike: Bike;
	titleAs?: "span" | "h1";
	actions?: ReactNode;
}) {
	const brandAndModel = joinFilled([bike.brand, bike.model]);
	const kindAndAudience = joinFilled([bike.kind, bike.audience]);

	return (
		<>
			<ContentCard.Title as={titleAs} actions={actions}>
				<span className="bike-reference">{bike.reference}</span>
			</ContentCard.Title>
			{brandAndModel !== "" && <span>{brandAndModel}</span>}
			{kindAndAudience !== "" && <span>{kindAndAudience}</span>}
			<ContentCard.Meta>{bike.status}</ContentCard.Meta>
		</>
	);
}

/** Les champs remplis, séparés par un point médian : « mistral · montreux ». */
function joinFilled(values: readonly (string | null)[]): string {
	return values.filter((value) => value !== null).join(" · ");
}
