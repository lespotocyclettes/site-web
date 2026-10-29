import { useSuspenseQuery } from "@tanstack/react-query";
import { useApi } from "../api/api-context";
import type { QueryOptionsOf } from "../api/define-query";
import type { Bike } from "../bike/bike";
import type { Reference } from "../bike/reference";
import { ScreenLayout } from "../screen/screen-layout";

/** Pour l'instant, le statut. Les champs et les actions viennent ensuite. */
export function BikeSheet({ reference }: { reference: Reference }) {
	const api = useApi();

	return (
		<ScreenLayout title={`Vélo ${reference}`}>
			<BikeDetails
				bikeQuery={api.bikes.get.queryOptions({ input: reference })}
			/>
		</ScreenLayout>
	);
}

function BikeDetails({ bikeQuery }: { bikeQuery: QueryOptionsOf<Bike> }) {
	const { data: bike } = useSuspenseQuery(bikeQuery);

	return <p>Statut : {bike.status}</p>;
}
