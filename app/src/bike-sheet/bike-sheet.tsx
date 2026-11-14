import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { useApi } from "../api/api-context";
import type { QueryOptionsOf } from "../api/define-query";
import type { Bike } from "../bike/bike";
import type { Reference } from "../bike/reference";
import { ActionButton } from "../components/action-button/action-button";
import { ContentCard } from "../components/content-card/content-card";
import { Cluster, Stack } from "../components/layout/layout";
import { ScreenLayout } from "../screen/screen-layout";
import { BikeActions } from "./bike-actions";
import { getBikeDetails } from "./bike-details";

/** Le recto de la fiche vélo, qui identifie le vélo, puis ses actions. */
export function BikeSheet({ params: reference }: { params: Reference }) {
	const api = useApi();

	return (
		<Stack gap="var(--size-2)">
			<BackButton />
			<ScreenLayout title={`Vélo ${reference}`}>
				<BikeDetails
					bikeQuery={api.bikes.get.queryOptions({ input: reference })}
				/>
			</ScreenLayout>
		</Stack>
	);
}

/*
 * Revient à l'écran précédent, le plus souvent la recherche, avec ses filtres. Ouverte
 * depuis un lien partagé, la fiche n'a pas d'écran précédent dans l'app : le retour quitte
 * alors l'app.
 *
 * Retour intelligent, à faire : un vrai lien vers la recherche, qui se comporte comme
 * history.back() quand l'entrée précédente de l'historique est cette même recherche, aux
 * paramètres de requête près. On garderait les filtres, sans jamais sortir de l'app.
 */
function BackButton() {
	return (
		<Cluster>
			<ActionButton
				variant="secondary"
				size="small"
				onClick={() => window.history.back()}
			>
				← Retour
			</ActionButton>
		</Cluster>
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
		<Stack>
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
			<BikeActions bike={bike} />
		</Stack>
	);
}
