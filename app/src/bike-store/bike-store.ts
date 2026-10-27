import type { Bike, BikeDescription, Kind, Transition } from "../bike/bike";
import type { Reference } from "../bike/reference";
import type { Status } from "../bike/status";

/*
 * Le contrat entre la mini-app et le relais PHP : une méthode par route du plan. Les écrans
 * n'en savent rien, ils passent par app/src/api/. Deux adaptateurs le remplissent : le faux
 * relais en mémoire (développement, tests) et, plus tard, celui qui appelle /wp-json/.
 */
export type BikeStore = {
	search(input: SearchInput, options?: CallOptions): Promise<readonly Bike[]>;
	get(reference: Reference, options?: CallOptions): Promise<Bike>;
	register(input: RegisterInput): Promise<{ reference: Reference }>;
	changeStatus(reference: Reference, transition: Transition): Promise<Bike>;
	uploadPhoto(reference: Reference, photo: Blob): Promise<void>;
	getSuggestions(options?: CallOptions): Promise<Suggestions>;
	/** `null` quand l'inférence est coupée ou a échoué : le formulaire reste vide. */
	infer(photo: Blob, options?: CallOptions): Promise<Inference | null>;
};

/** Le `signal` permet d'abandonner une requête devenue inutile, une recherche périmée par exemple. */
export type CallOptions = { signal?: AbortSignal };

export type SearchInput = {
	/** Cherché dans la référence, la marque et le modèle. */
	text: string;
	/** Aucun statut coché : tous les statuts. */
	statuses: readonly Status[];
};

export type RegisterInput = {
	description: BikeDescription;
	/** Seulement en saisie à rebours. Sinon, c'est le relais qui génère la référence. */
	paperReference?: Reference;
};

/** Les valeurs déjà saisies, proposées dans les listes de suggestions. */
export type Suggestions = {
	brands: readonly string[];
	models: readonly string[];
	colors: readonly string[];
	features: readonly string[];
};

/** Ce que l'inférence devine d'une photo. Le contrat est celui du plan, phase 1. */
export type Inference = {
	kind: Kind | null;
	colors: readonly string[];
	brand: string | null;
	model: string | null;
};

export class ReferenceTakenError extends Error {
	constructor(readonly reference: Reference) {
		super(`${reference} existe déjà`);
	}
}

export class TransitionRefusedError extends Error {
	constructor(
		readonly from: Status,
		readonly to: Status,
	) {
		super(`un vélo « ${from} » ne peut pas passer « ${to} »`);
	}
}
