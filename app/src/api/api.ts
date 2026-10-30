import type { Transition } from "../bike/bike";
import type { Reference } from "../bike/reference";
import type { BikeSearch } from "../bike/search";
import type { BikeStore, RegisterInput } from "../bike-store/bike-store";
import { defineMutation, defineQuery } from "./define-query";

/** Tout changement sur un vélo rafraîchit la recherche comme la fiche. */
const ALL_BIKE_QUERIES = [["bikes"]];

export function createApi(store: BikeStore) {
	return {
		bikes: {
			search: defineQuery(["bikes", "search"], (input: BikeSearch, options) => {
				return store.search(input, options);
			}),
			get: defineQuery(["bikes", "get"], (reference: Reference, options) => {
				return store.get(reference, options);
			}),
			register: defineMutation(
				(input: RegisterInput) => {
					return store.register(input);
				},
				{ invalidates: ALL_BIKE_QUERIES },
			),
			changeStatus: defineMutation(
				({
					reference,
					transition,
				}: {
					reference: Reference;
					transition: Transition;
				}) => {
					return store.changeStatus(reference, transition);
				},
				{ invalidates: ALL_BIKE_QUERIES },
			),
		},
	};
}

export type Api = ReturnType<typeof createApi>;
