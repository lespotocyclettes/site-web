import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { CallOptions } from "../bike-store/bike-store";

/*
 * Le motif d'oRPC (https://orpc.unnoq.com), écrit à la main parce que notre relais est en
 * PHP. Chaque appel expose des options toutes prêtes, que l'écran passe à useQuery,
 * useSuspenseQuery ou prefetchQuery selon son besoin :
 *
 *     useQuery(api.bikes.search.queryOptions({ input: { text, statuses } }))
 */

type QueryPath = readonly string[];

export function defineQuery<Input, Output>(
	path: QueryPath,
	fetch: (input: Input, options: CallOptions) => Promise<Output>,
) {
	return {
		queryOptions({ input }: { input: Input }) {
			return queryOptions({
				queryKey: [...path, input],
				queryFn({ signal }) {
					return fetch(input, { signal });
				},
			});
		},
	};
}

/** `invalidates` liste les familles de requêtes à rafraîchir quand l'action réussit. */
export function defineMutation<Input, Output>(
	mutate: (input: Input) => Promise<Output>,
	{ invalidates }: { invalidates: readonly QueryPath[] },
) {
	return {
		mutationOptions() {
			return mutationOptions({
				mutationFn: mutate,
				async onSuccess(_output, _input, _onMutateResult, { client }) {
					await Promise.all(
						invalidates.map((queryKey) => {
							return client.invalidateQueries({ queryKey });
						}),
					);
				},
			});
		},
	};
}
