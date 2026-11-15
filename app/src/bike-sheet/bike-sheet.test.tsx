import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { createApi } from "../api/api";
import { ApiProvider } from "../api/api-context";
import { type Bike, EMPTY_BIKE_DESCRIPTION } from "../bike/bike";
import { formatReference } from "../bike/reference";
import type { BikeStore } from "../bike-store/bike-store";
import { createInMemoryBikeStore } from "../bike-store/in-memory-bike-store";
import { BikeSheet } from "./bike-sheet";

const BIKE: Bike = {
	...EMPTY_BIKE_DESCRIPTION,
	reference: formatReference({ entryDate: "2018-11-21", dayCounter: 3 }),
	photos: [],
	status: "prêt à la vente",
};

test("un tap seul ne change pas le statut : il faut confirmer", async () => {
	const store = renderSheet();

	fireEvent.click(await screen.findByRole("button", { name: "Démonter" }));
	expect((await store.get(BIKE.reference)).status).toBe("prêt à la vente");

	fireEvent.click(screen.getByRole("button", { name: "Confirmer" }));

	expect(await screen.findByText("démonté")).toBeTruthy();
	expect(screen.queryByRole("button", { name: "Sortir du stock" })).toBeNull();
});

test("une vente enregistre l'acheteur et le prix", async () => {
	const store = renderSheet();

	fireEvent.click(
		await screen.findByRole("button", { name: "Sortir du stock" }),
	);
	fireEvent.click(screen.getByRole("radio", { name: "vente" }));
	fireEvent.change(screen.getByLabelText("Acheteur"), {
		target: { value: "Léa" },
	});
	fireEvent.change(screen.getByLabelText("Prix, en euros"), {
		target: { value: "120" },
	});
	fireEvent.click(screen.getByRole("button", { name: "Confirmer la sortie" }));

	expect(await screen.findByText("Léa")).toBeTruthy();
	const bike = await store.get(BIKE.reference);
	expect(bike.status === "sorti" && bike.exit).toEqual({
		exitKind: "vente",
		buyer: "Léa",
		price: 120,
	});
});

function renderSheet(): BikeStore {
	const store = createInMemoryBikeStore({
		bikes: [BIKE],
		getToday: () => "2026-11-14",
	});
	render(
		<QueryClientProvider client={new QueryClient()}>
			<ApiProvider api={createApi(store)}>
				<BikeSheet params={BIKE.reference} />
			</ApiProvider>
		</QueryClientProvider>,
	);
	return store;
}
