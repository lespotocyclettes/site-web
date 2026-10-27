import { describe, expect, test } from "vitest";
import { EMPTY_BIKE_DESCRIPTION } from "../bike/bike";
import { parseReference, type Reference } from "../bike/reference";
import { ReferenceTakenError } from "./bike-store";
import { createInMemoryBikeStore } from "./in-memory-bike-store";

function toReference(text: string): Reference {
	const reference = parseReference(text);
	if (!reference) throw new Error(`${text} should be a valid reference`);
	return reference;
}

function createStoreOn(today: string) {
	return createInMemoryBikeStore({ bikes: [], getToday: () => today });
}

describe("génération des références", () => {
	test("le premier vélo du jour reçoit le compteur 01", async () => {
		const store = createStoreOn("2026-10-27");

		const { reference } = await store.register({
			description: EMPTY_BIKE_DESCRIPTION,
		});

		expect(reference).toBe("261027.01");
	});

	test("une référence papier compte dans le maximum du jour", async () => {
		const store = createStoreOn("2026-10-27");
		await store.register({
			description: EMPTY_BIKE_DESCRIPTION,
			paperReference: toReference("261027.05"),
		});

		const { reference } = await store.register({
			description: EMPTY_BIKE_DESCRIPTION,
		});

		expect(reference).toBe("261027.06");
	});

	test("une référence papier déjà prise est refusée", async () => {
		const store = createStoreOn("2026-10-27");
		const paperReference = toReference("260707.03");
		await store.register({
			description: EMPTY_BIKE_DESCRIPTION,
			paperReference,
		});

		const second = store.register({
			description: EMPTY_BIKE_DESCRIPTION,
			paperReference,
		});

		await expect(second).rejects.toBeInstanceOf(ReferenceTakenError);
	});
});
