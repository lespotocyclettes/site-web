import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { useApi } from "../api/api-context";
import type { QueryOptionsOf } from "../api/define-query";
import type { Bike } from "../bike/bike";
import type { Reference } from "../bike/reference";
import { ActionButton } from "../components/action-button/action-button";
import { BikeIdentity } from "../components/bike-identity/bike-identity";
import { ContentCard } from "../components/content-card/content-card";
import { Cluster, Stack } from "../components/layout/layout";
import { Boundary } from "../screen/boundary";
import { PageTitle } from "../screen/screen-layout";
import { BikeActions } from "./bike-actions";
import { getBikeDetails } from "./bike-details";

/** Le recto de la fiche vélo, qui identifie le vélo, puis ses actions. */
export function BikeSheet({ params: reference }: { params: Reference }) {
	const api = useApi();

	/*
	 * Pas de ScreenLayout : le h1 est la référence, dans la carte, comme sur la carte de
	 * recherche. Il arrive donc avec le vélo, après le chargement.
	 */
	return (
		<Stack gap="var(--size-2)">
			<PageTitle title={reference} />
			<BackButton />
			<Boundary>
				<BikeDetails
					bikeQuery={api.bikes.get.queryOptions({ input: reference })}
				/>
			</Boundary>
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
 * La même tête que la carte de recherche (BikeIdentity), puis les autres champs. La photo
 * n'a pas de texte alternatif : la référence et la marque, juste dessous, disent déjà de
 * quel vélo il s'agit.
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
				<BikeIdentity bike={bike} titleAs="h1" />
				<dl className="detail-list">
					{/*
					 * Un champ non renseigné reste visible, avec un tiret : on voit ce qui reste
					 * à compléter. Il est atténué, pour que l'œil trouve vite les champs remplis.
					 */}
					{getBikeDetails(bike).map(({ label, value }) => {
						const variant = value === null ? "empty" : undefined;

						return (
							<Fragment key={label}>
								<dt className="term" data-variant={variant}>
									{label}
								</dt>
								<dd className="value" data-variant={variant}>
									{value ?? "—"}
								</dd>
							</Fragment>
						);
					})}
				</dl>
			</ContentCard.Root>
			<BikeActions bike={bike} />
		</Stack>
	);
}
