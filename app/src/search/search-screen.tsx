import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/api-context";
import { Stack } from "../components/layout/layout";
import { formatRoute } from "../navigation/route";

/** Pour l'instant, la liste de tous les vélos. Le champ et les chips viennent ensuite. */
export function SearchScreen() {
	const api = useApi();
	const search = useQuery(
		api.bikes.search.queryOptions({ input: { text: "", statuses: [] } }),
	);

	return (
		<Stack gap="var(--size-4)">
			<h1>Recherche</h1>
			{search.isPending && <p>Chargement…</p>}
			{search.isError && (
				<div className="notice-block" data-variant="danger" role="alert">
					<p className="title">La recherche a échoué</p>
					<p>{search.error.message}</p>
				</div>
			)}
			{search.isSuccess && (
				<ul>
					{search.data.map((bike) => {
						return (
							<li key={bike.reference}>
								<a
									href={formatRoute({
										screen: "bike",
										reference: bike.reference,
									})}
								>
									{bike.reference} {bike.brand}
								</a>
							</li>
						);
					})}
				</ul>
			)}
		</Stack>
	);
}
