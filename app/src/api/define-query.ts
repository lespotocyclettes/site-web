import {
	mutationOptions,
	queryOptions,
	type UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import type { CallOptions } from "../bike-store/bike-store";

/*
 * Le motif d'oRPC (https://orpc.unnoq.com), écrit à la main pour s'épargner une dépendance
 * (voir la fiche 0002). Chaque appel expose des options toutes prêtes. L'écran les prépare,
 * et le composant qui affiche les données les reçoit et les passe à useSuspenseQuery :
 *
 *     <BikeDetails bikeQuery={api.bikes.get.queryOptions({ input: reference })} />
 */

type QueryPath = readonly string[];

/**
 * Des options de requête qui rapportent un `TData`. Un composant qui les reçoit dépend de la
 * donnée qu'il affiche, pas de l'endroit d'où elle vient.
 */
export type QueryOptionsOf<TData> = UseSuspenseQueryOptions<
	// biome-ignore lint/suspicious/noExplicitAny: ce qui est rangé en cache peut différer de `TData` (un `select` le transforme), et `select` le reçoit en paramètre : `unknown` refuserait toute option qui a un `select`.
	any,
	Error,
	TData,
	// biome-ignore lint/suspicious/noExplicitAny: même raison, `queryFn` reçoit la clé en paramètre : une clé précise ne se range pas dans `QueryKey`. Aucun des deux `any` ne fuit, le composant ne voit que `TData`.
	any
>;

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
