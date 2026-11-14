import type { Bike } from "../../bike/bike";
import { bikeSheetRoute } from "../../routes/velo";
import { BikeIdentity } from "../bike-identity/bike-identity";
import { ContentCard } from "../content-card/content-card";

/*
 * Un vélo dans la grille de la recherche : sa photo, de quoi le reconnaître, et un lien vers
 * sa fiche. La photo n'a pas de texte alternatif : la référence et la marque, écrites juste
 * dessous, disent déjà de quel vélo il s'agit.
 */
export function BikeCard({ bike }: { bike: Bike }) {
	const [photo] = bike.photos;

	return (
		<ContentCard.Root href={bikeSheetRoute.href(bike.reference)}>
			<ContentCard.Media ratio="4 / 3">
				{photo ? <img src={photo.url} alt="" /> : "Pas de photo"}
			</ContentCard.Media>
			<BikeIdentity bike={bike} />
		</ContentCard.Root>
	);
}
