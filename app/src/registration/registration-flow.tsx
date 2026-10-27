import { Stack } from "../components/layout/layout";
import { RegistrationSequencer } from "./sequencer/registration-sequencer";

export function RegistrationFlow() {
	return (
		<Stack gap="var(--size-4)">
			<h1>Enregistrer un vélo</h1>
			<RegistrationSequencer />
		</Stack>
	);
}
