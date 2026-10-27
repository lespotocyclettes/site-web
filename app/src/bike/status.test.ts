import { expect, test } from "vitest";
import { isTransitionAllowed, type Status } from "./status";

test.each<[Status, Status]>([
	["prêt à la vente", "à traiter"],
	["sorti", "à traiter"],
	["sorti", "prêt à la vente"],
	["démonté", "sorti"],
])("on ne revient pas en arrière : %s → %s est refusé", (from, to) => {
	expect(isTransitionAllowed(from, to)).toBe(false);
});
