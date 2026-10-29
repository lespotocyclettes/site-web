import { expectTypeOf, test } from "vitest";
import type { Bike } from "../bike/bike";
import { defineQuery, type QueryOptionsOf } from "./define-query";

/* Ce test est vérifié par tsc (npm run typecheck) : il ne fait rien à l'exécution. */

const bikesQuery = defineQuery(["bikes"], async (_input: string) => {
	return [] as readonly Bike[];
});

test("un composant reçoit des options qui rapportent sa donnée", () => {
	expectTypeOf(bikesQuery.queryOptions({ input: "" })).toExtend<
		QueryOptionsOf<readonly Bike[]>
	>();
});

test("un select change ce que rapportent les options, pas leur forme", () => {
	const countQuery = {
		...bikesQuery.queryOptions({ input: "" }),
		select(bikes: readonly Bike[]) {
			return bikes.length;
		},
	};

	expectTypeOf(countQuery).toExtend<QueryOptionsOf<number>>();
	expectTypeOf(countQuery).not.toExtend<QueryOptionsOf<string>>();
});
