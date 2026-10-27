import {
	createFromLocalStorage,
	defineUiStep,
	defineWorkflow,
	WorkflowClient,
} from "@unreel/core";
import { UnreelProvider, useWorkflow, WorkflowRenderer } from "@unreel/react";
import { useState } from "react";
import { PlaceholderStep } from "../steps/placeholder-step";

/*
 * Le seul fichier de la mini-app qui importe unreel (voir la fiche 0002). unreel enchaîne
 * les étapes de l'enregistrement et s'en souvient si la page se recharge. Pour s'en passer,
 * on remplace ce fichier ; les étapes, dans ../steps/, ne changent pas.
 *
 * Pour l'instant une seule étape factice, qui prouve que le lien vers unreel fonctionne.
 */
const registrationWorkflow = defineWorkflow({
	key: ["registration"],
	initialStatus: "idle",
	steps: {
		LinkCheck: defineUiStep<void, void>(),
	},
	async run({ steps }) {
		await steps.LinkCheck.run();
	},
});

export function RegistrationSequencer() {
	const [client] = useState(() => {
		return new WorkflowClient({
			defaultWfOptions: { persistence: createFromLocalStorage(localStorage) },
		});
	});

	return (
		<UnreelProvider client={client}>
			<RegistrationSteps />
		</UnreelProvider>
	);
}

function RegistrationSteps() {
	const { actions } = useWorkflow(registrationWorkflow);

	return (
		<WorkflowRenderer
			workflow={registrationWorkflow}
			renderers={{
				"~idle": () => {
					return (
						<PlaceholderStep
							text="L'enregistrement n'est pas encore construit."
							actionLabel="Essayer l'enchaînement des étapes"
							onAction={() => actions.start()}
						/>
					);
				},
				LinkCheck: (_params, step) => {
					return (
						<PlaceholderStep
							text="Étape factice : unreel l'a affichée."
							actionLabel="Continuer"
							onAction={() => step.resolve()}
						/>
					);
				},
				"~completed": () => {
					return (
						<PlaceholderStep
							text="Le lien vers unreel fonctionne."
							actionLabel="Recommencer"
							onAction={() => actions.start()}
						/>
					);
				},
			}}
		/>
	);
}
