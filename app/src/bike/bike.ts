import type { IsoDate } from "./iso-date";
import type { Reference } from "./reference";
import type { Status } from "./status";

// Les valeurs viennent du glossaire métier, en français pour qu'un export se lise sans traduire.

export type Kind =
	| "vtt"
	| "vtc"
	| "ville"
	| "route"
	| "course"
	| "demi-course"
	| "randonneur"
	| "pliant"
	| "bmx";

export const AUDIENCES = ["adulte", "enfant"] as const;

export type Audience = (typeof AUDIENCES)[number];

export type FrameShape = "haut" | "bas" | "mixte";

export type GearShift = "sans" | "sur le cadre" | "manettes au guidon";

export type Triage = "à vendre" | "à réparer" | "à démonter";

type Euros = number;

/** Ce que le bénévole décrit. Rien n'est obligatoire : `null` veut dire « pas renseigné ». */
export type BikeDescription = {
	kind: Kind | null;
	audience: Audience | null;
	frameShape: FrameShape | null;
	gearShift: GearShift | null;
	triage: Triage | null;
	brand: string | null;
	model: string | null;
	colors: readonly string[];
	features: readonly string[];
	donor: string | null;
};

export const EMPTY_BIKE_DESCRIPTION: BikeDescription = {
	kind: null,
	audience: null,
	frameShape: null,
	gearShift: null,
	triage: null,
	brand: null,
	model: null,
	colors: [],
	features: [],
	donor: null,
};

/** Un don n'a pas de prix : le type ne laisse pas en écrire un. */
export type Exit =
	| { exitKind: "vente"; buyer: string; price: Euros }
	| { exitKind: "don"; buyer: string };

export type Photo = {
	url: string;
};

/** Seul un vélo sorti porte une sortie. */
type Journey =
	| { status: Exclude<Status, "sorti"> }
	| { status: "sorti"; exit: Exit; exitDate: IsoDate };

export type Bike = BikeDescription &
	Journey & {
		reference: Reference;
		photos: readonly Photo[];
	};

/** Ce qu'on envoie au relais pour changer de statut. La sortie porte ses informations. */
export type Transition =
	| { to: "prêt à la vente" }
	| { to: "démonté" }
	| { to: "sorti"; exit: Exit };
