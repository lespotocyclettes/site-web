import { type Bike, EMPTY_BIKE_DESCRIPTION } from "../bike/bike";
import { formatReference } from "../bike/reference";

/* De quoi remplir le faux relais en développement, pour que les écrans aient à afficher. */

export const SAMPLE_BIKES: readonly Bike[] = [
	{
		...EMPTY_BIKE_DESCRIPTION,
		reference: formatReference({ entryDate: "2015-06-01", dayCounter: 1 }),
		kind: "pliant",
		brand: "peugeot",
		colors: ["bleu"],
		features: ["vintage"],
		photos: [],
		status: "à traiter",
	},
	{
		...EMPTY_BIKE_DESCRIPTION,
		reference: formatReference({ entryDate: "2018-11-21", dayCounter: 3 }),
		kind: "vtc",
		audience: "adulte",
		brand: "mistral",
		model: "montreux",
		colors: ["bleu"],
		photos: [],
		status: "prêt à la vente",
	},
	{
		...EMPTY_BIKE_DESCRIPTION,
		reference: formatReference({ entryDate: "2016-03-17", dayCounter: 1 }),
		kind: "vtt",
		audience: "enfant",
		model: "blackstone",
		colors: ["noir"],
		photos: [],
		status: "sorti",
		exit: { exitKind: "don", buyer: "non renseigné" },
		exitDate: "2023-06-13",
	},
];
