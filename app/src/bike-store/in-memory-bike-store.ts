import type { Bike } from "../bike/bike";
import type { IsoDate } from "../bike/iso-date";
import {
	formatReference,
	getReferenceParts,
	type Reference,
} from "../bike/reference";
import { isTransitionAllowed } from "../bike/status";
import {
	type BikeStore,
	ReferenceTakenError,
	TransitionRefusedError,
} from "./bike-store";

/*
 * Un faux relais qui garde les vélos en mémoire, le temps d'une page ouverte. Il imite les
 * règles du vrai : génération des références, refus des doublons et des retours en arrière.
 * Il sert à développer les écrans avant que le relais PHP existe, et aux tests.
 */
export function createInMemoryBikeStore({
	bikes,
	getToday,
}: {
	bikes: readonly Bike[];
	getToday: () => IsoDate;
}): BikeStore {
	const bikesByReference = new Map(
		bikes.map((bike) => {
			return [bike.reference, bike];
		}),
	);

	function getBike(reference: Reference): Bike {
		const bike = bikesByReference.get(reference);
		if (!bike) throw new Error(`le vélo ${reference} n'existe pas`);
		return bike;
	}

	return {
		async search({ text, statuses }) {
			const needle = text.trim().toLowerCase();
			return [...bikesByReference.values()].filter((bike) => {
				const haystack = [bike.reference, bike.brand, bike.model]
					.join(" ")
					.toLowerCase();
				const matchesText = haystack.includes(needle);
				const matchesStatus =
					statuses.length === 0 || statuses.includes(bike.status);
				return matchesText && matchesStatus;
			});
		},

		async get(reference) {
			return getBike(reference);
		},

		async register({ description, paperReference }) {
			const reference =
				paperReference ??
				getNextReference([...bikesByReference.keys()], getToday());
			if (bikesByReference.has(reference)) {
				throw new ReferenceTakenError(reference);
			}

			bikesByReference.set(reference, {
				...description,
				reference,
				photos: [],
				status: "à traiter",
			});
			return { reference };
		},

		async changeStatus(reference, transition) {
			const bike = getBike(reference);
			if (!isTransitionAllowed(bike.status, transition.to)) {
				throw new TransitionRefusedError(bike.status, transition.to);
			}

			const changed: Bike =
				transition.to === "sorti"
					? {
							...bike,
							status: "sorti",
							exit: transition.exit,
							exitDate: getToday(),
						}
					: { ...bike, status: transition.to };
			bikesByReference.set(reference, changed);
			return changed;
		},

		async uploadPhoto(reference, photo) {
			const bike = getBike(reference);
			const url = URL.createObjectURL(photo);
			bikesByReference.set(reference, {
				...bike,
				photos: [...bike.photos, { url }],
			});
		},

		async getSuggestions() {
			const all = [...bikesByReference.values()];
			return {
				brands: getDistinct(all.map((bike) => bike.brand)),
				models: getDistinct(all.map((bike) => bike.model)),
				colors: getDistinct(all.flatMap((bike) => bike.colors)),
				features: getDistinct(all.flatMap((bike) => bike.features)),
			};
		},

		/* Le faux relais n'a pas d'inférence : c'est le cas « coupée », que l'app doit tenir. */
		async infer() {
			return null;
		},
	};
}

/** La règle du relais : le plus grand compteur du jour plus un, références papier comprises. */
function getNextReference(
	references: readonly Reference[],
	today: IsoDate,
): Reference {
	const countersOfToday = references
		.map(getReferenceParts)
		.filter((parts) => parts.entryDate === today)
		.map((parts) => parts.dayCounter);
	const dayCounter = Math.max(0, ...countersOfToday) + 1;
	return formatReference({ entryDate: today, dayCounter });
}

function getDistinct(values: readonly (string | null)[]): readonly string[] {
	const filled = values.filter((value) => value !== null);
	return [...new Set(filled)].toSorted();
}
