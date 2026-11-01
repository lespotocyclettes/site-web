import { defineRoute, NO_PARAMS } from "../navigation/define-route";
import { RegistrationFlow } from "../registration/registration-flow";

export const registrationRoute = defineRoute({
	name: "enregistrement",
	params: NO_PARAMS,
	Screen: RegistrationFlow,
});
