import { parseReference, type Reference } from "../bike/reference";
import type { ParamsCodec } from "../navigation/define-route";

/** La fiche s'écrit `#velo/261027.01`. Une référence mal tapée ne mène à aucune fiche. */
export const referenceCodec = {
	encode(reference: Reference) {
		return `/${reference}`;
	},
	decode(rest) {
		if (!rest.startsWith("/")) {
			return null;
		}

		return parseReference(rest.slice("/".length)) ?? null;
	},
} satisfies ParamsCodec<Reference>;
