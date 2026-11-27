import { getBackLinkProps } from "../navigation/back-link";
import { IN_STOCK_HREF } from "../routes/recherche";
import { ChildScreen } from "../screen/screen-layout";
import { RegistrationSequencer } from "./sequencer/registration-sequencer";

export function RegistrationFlow() {
	return (
		<ChildScreen
			title="Enregistrer un vélo"
			back={getBackLinkProps(IN_STOCK_HREF, window.history)}
		>
			<RegistrationSequencer />
		</ChildScreen>
	);
}
