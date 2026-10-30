import type { Bike } from "../../bike/bike";
import { formatRoute } from "../../navigation/route";

/*
 * Un vélo dans la grille de la recherche, habillé par bike-thumbnail.css : sa photo, de
 * quoi le reconnaître, et un lien vers sa fiche. La photo n'a pas de texte alternatif : la
 * référence et la marque, écrites juste dessous, disent déjà de quel vélo il s'agit.
 */
export function BikeThumbnail({ bike }: { bike: Bike }) {
	const [photo] = bike.photos;
	const description = [bike.brand, bike.model]
		.filter((part) => part !== null)
		.join(" · ");

	return (
		<a
			className="bike-thumbnail"
			href={formatRoute({ screen: "velo", reference: bike.reference })}
		>
			{photo ? (
				<img className="photo" src={photo.url} alt="" />
			) : (
				<span className="placeholder">Pas de photo</span>
			)}
			<span className="reference">{bike.reference}</span>
			{description !== "" && <span className="description">{description}</span>}
			<span className="status">{bike.status}</span>
		</a>
	);
}
