import { useSuspenseQuery } from "@tanstack/react-query";
import { useApi } from "../api/api-context";
import type { QueryOptionsOf } from "../api/define-query";
import type { Bike } from "../bike/bike";
import { formatRoute } from "../navigation/route";
import { ScreenLayout } from "../screen/screen-layout";

/** Pour l'instant, la liste de tous les vélos. Le champ et les chips viennent ensuite. */
export function SearchScreen() {
	const api = useApi();

	return (
		<ScreenLayout title="Recherche">
			<SearchResults
				bikesQuery={api.bikes.search.queryOptions({
					input: { text: "", statuses: [], audiences: [] },
				})}
			/>
		</ScreenLayout>
	);
}

function SearchResults({
	bikesQuery,
}: {
	bikesQuery: QueryOptionsOf<readonly Bike[]>;
}) {
	const { data: bikes } = useSuspenseQuery(bikesQuery);

	return (
		<ul>
			{bikes.map((bike) => {
				return (
					<li key={bike.reference}>
						<a
							href={formatRoute({ screen: "velo", reference: bike.reference })}
						>
							{bike.reference} {bike.brand}
						</a>
					</li>
				);
			})}
		</ul>
	);
}
