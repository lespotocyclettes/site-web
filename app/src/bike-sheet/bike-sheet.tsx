import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/api-context";
import type { Reference } from "../bike/reference";
import { Stack } from "../components/layout/layout";

/** Pour l'instant, la référence et le statut. Les champs et les actions viennent ensuite. */
export function BikeSheet({ reference }: { reference: Reference }) {
	const api = useApi();
	const bike = useQuery(api.bikes.get.queryOptions({ input: reference }));

	return (
		<Stack gap="var(--size-4)">
			<h1>Vélo {reference}</h1>
			{bike.isPending && <p>Chargement…</p>}
			{bike.isError && (
				<div className="notice-block" data-variant="danger" role="alert">
					<p className="title">Impossible d'afficher ce vélo</p>
					<p>{bike.error.message}</p>
				</div>
			)}
			{bike.isSuccess && <p>Statut : {bike.data.status}</p>}
		</Stack>
	);
}
