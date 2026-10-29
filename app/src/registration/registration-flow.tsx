import { ScreenLayout } from "../screen/screen-layout";
import { RegistrationSequencer } from "./sequencer/registration-sequencer";

export function RegistrationFlow() {
	return (
		<ScreenLayout title="Enregistrer un vélo">
			<RegistrationSequencer />
		</ScreenLayout>
	);
}
