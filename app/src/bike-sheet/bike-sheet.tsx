import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { useApi } from "../api/api-context";
import type { QueryOptionsOf } from "../api/define-query";
import type { Bike } from "../bike/bike";
import type { Reference } from "../bike/reference";
import { BikeIdentity } from "../components/bike-identity/bike-identity";
import { ContentCard } from "../components/content-card/content-card";
import { Stack } from "../components/layout/layout";
import { getBackLinkProps } from "../navigation/back-link";
import { IN_STOCK_HREF } from "../routes/recherche";
import { Boundary } from "../screen/boundary";
import { ChildScreen, PageTitle } from "../screen/screen-layout";
import { BikeActions } from "./bike-actions";
import { getBikeDetails } from "./bike-details";

/** Le recto de la fiche vélo, qui identifie le vélo, puis ses actions. */
export function BikeSheet({ params: reference }: { params: Reference }) {
	const api = useApi();

	/*
	 * Pas de titre dans la barre : le h1 est la référence, dans la carte, comme sur la carte
	 * de recherche. Il arrive donc avec le vélo, après le chargement.
	 *
	 * Le retour mène à la recherche d'où l'on vient, ou à la recherche en stock (voir
	 * back-link.ts). L'origine se lit au rendu : la fiche se redessine à chaque changement
	 * d'adresse, et l'origine d'une entrée ne change plus une fois notée.
	 */
	return (
		<ChildScreen
			title={null}
			back={getBackLinkProps(IN_STOCK_HREF, window.history)}
		>
			<PageTitle title={reference} />
			<Boundary>
				<BikeDetails
					bikeQuery={api.bikes.get.queryOptions({ input: reference })}
				/>
			</Boundary>
		</ChildScreen>
	);
}

/*
 * Deux cartes, séparées par l'espace du Stack : la première est la carte de recherche en
 * grand (BikeIdentity), la seconde porte les autres champs. La photo n'a pas de texte
 * alternatif : la référence et la marque, juste dessous, disent déjà de quel vélo il s'agit.
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
				<BikeIdentity
					bike={bike}
					titleAs="h1"
					actions={<BikeActions bike={bike} />}
				/>
			</ContentCard.Root>
			<ContentCard.Root>
				<ContentCard.Meta>Détails</ContentCard.Meta>
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
		</Stack>
	);
}
