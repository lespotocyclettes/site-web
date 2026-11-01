import type { Bike } from "../../bike/bike";
import { bikeSheetRoute } from "../../routes/velo";
import { ContentCard } from "../content-card/content-card";

/*
 * Un vélo dans la grille de la recherche : sa photo, de quoi le reconnaître, et un lien vers
 * sa fiche. La photo n'a pas de texte alternatif : la référence et la marque, écrites juste
 * dessous, disent déjà de quel vélo il s'agit.
 */
export function BikeCard({ bike }: { bike: Bike }) {
	const [photo] = bike.photos;
	const description = [bike.brand, bike.model]
		.filter((part) => part !== null)
		.join(" · ");

	return (
		<ContentCard href={bikeSheetRoute.href(bike.reference)}>
			<div className="media">
				{photo ? (
					<img className="image" src={photo.url} alt="" />
				) : (
					"Pas de photo"
				)}
			</div>
			<span className="title">{bike.reference}</span>
			{description !== "" && <span>{description}</span>}
			<span className="meta">{bike.status}</span>
		</ContentCard>
	);
}
