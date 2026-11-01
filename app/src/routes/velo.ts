import { BikeSheet } from "../bike-sheet/bike-sheet";
import { referenceCodec } from "../bike-sheet/bike-sheet-params";
import { defineRoute } from "../navigation/define-route";

export const bikeSheetRoute = defineRoute({
	name: "velo",
	params: referenceCodec,
	Screen: BikeSheet,
});
