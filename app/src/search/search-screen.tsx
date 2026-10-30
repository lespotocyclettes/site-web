import { useSuspenseQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import { useApi } from "../api/api-context";
import type { QueryOptionsOf } from "../api/define-query";
import { AUDIENCES, type Bike } from "../bike/bike";
import type { BikeSearch } from "../bike/search";
import { STATUSES } from "../bike/status";
import { BikeThumbnail } from "../components/bike-thumbnail/bike-thumbnail";
import { Grid, Stack } from "../components/layout/layout";
import { ToggleGroup } from "../components/toggle-group/toggle-group";
import { navigate } from "../navigation/navigate";
import { Boundary } from "../screen/boundary";
import { ScreenLayout } from "../screen/screen-layout";
import { readSearch, SEARCH_FIELDS } from "./search-params";

/*
 * La recherche vit dans l'adresse, pas dans l'écran : le formulaire l'affiche, et chaque
 * changement la réécrit dans l'adresse, d'où elle revient par `search`.
 */
export function SearchScreen({ search }: { search: BikeSearch }) {
	const api = useApi();
	/*
	 * Pendant qu'une nouvelle recherche charge, la grille garde les résultats précédents
	 * plutôt que de repasser par le skeleton à chaque lettre tapée.
	 */
	const shownSearch = useDeferredValue(search);

	function updateSearch(
		form: HTMLFormElement | null,
		history: "push" | "replace",
	) {
		if (!form) {
			return;
		}

		navigate({ screen: "recherche", search: readSearch(form) }, { history });
	}

	return (
		<ScreenLayout title="Recherche">
			<Stack gap="var(--size-4)">
				{/* Sans ça, Entrée enverrait le formulaire et écrirait `?q=` hors du `#`. */}
				<form onSubmit={(event) => event.preventDefault()}>
					<Stack gap="var(--size-3)">
						<div className="form-field">
							<label className="label" htmlFor="search-text">
								Référence, marque ou modèle
							</label>
							<input
								id="search-text"
								type="search"
								name={SEARCH_FIELDS.text}
								value={search.text}
								onChange={(event) => {
									updateSearch(event.currentTarget.form, "replace");
								}}
							/>
						</div>
						<ToggleGroup
							legend="Statut"
							name={SEARCH_FIELDS.statuses}
							options={STATUSES}
							checked={search.statuses}
							onChange={(event) => {
								updateSearch(event.currentTarget.form, "push");
							}}
						/>
						<ToggleGroup
							legend="Public"
							name={SEARCH_FIELDS.audiences}
							options={AUDIENCES}
							checked={search.audiences}
							onChange={(event) => {
								updateSearch(event.currentTarget.form, "push");
							}}
						/>
					</Stack>
				</form>
				{/* Une boundary à part : le formulaire reste utilisable si la liste échoue. */}
				<Boundary>
					<SearchResults
						bikesQuery={api.bikes.search.queryOptions({ input: shownSearch })}
					/>
				</Boundary>
			</Stack>
		</ScreenLayout>
	);
}

function SearchResults({
	bikesQuery,
}: {
	bikesQuery: QueryOptionsOf<readonly Bike[]>;
}) {
	const { data: bikes } = useSuspenseQuery(bikesQuery);

	if (bikes.length === 0) {
		return <p>Aucun vélo ne correspond à cette recherche.</p>;
	}

	return (
		<Grid gap="var(--size-3)" min="9rem">
			{bikes.map((bike) => {
				return <BikeThumbnail key={bike.reference} bike={bike} />;
			})}
		</Grid>
	);
}
