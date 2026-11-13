import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { useApi } from "../api/api-context";
import type { QueryOptionsOf } from "../api/define-query";
import type { Bike } from "../bike/bike";
import type { Reference } from "../bike/reference";
import { ContentCard } from "../components/content-card/content-card";
import { ScreenLayout } from "../screen/screen-layout";
import { getBikeDetails } from "./bike-details";

/** Le recto de la fiche vélo : de quoi identifier le vélo. */
export function BikeSheet({ params: reference }: { params: Reference }) {
	const api = useApi();

	return (
		<ScreenLayout title={`Vélo ${reference}`}>
			<BikeDetails
				bikeQuery={api.bikes.get.queryOptions({ input: reference })}
			/>
		</ScreenLayout>
	);
}

/*
 * La photo n'a pas de texte alternatif : le titre de l'écran et les champs, juste dessous,
 * disent déjà de quel vélo il s'agit.
 */
function BikeDetails({ bikeQuery }: { bikeQuery: QueryOptionsOf<Bike> }) {
	const { data: bike } = useSuspenseQuery(bikeQuery);
	const [photo] = bike.photos;

	return (
		<ContentCard.Root>
			<ContentCard.Media ratio="4 / 3">
				{photo ? <img src={photo.url} alt="" /> : "Pas de photo"}
			</ContentCard.Media>
			<dl className="detail-list">
				{getBikeDetails(bike).map(({ label, value }) => {
					return (
						<Fragment key={label}>
							<dt className="term">{label}</dt>
							<dd className="value">{value}</dd>
						</Fragment>
					);
				})}
			</dl>
		</ContentCard.Root>
	);
}
