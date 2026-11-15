import { useMutation } from "@tanstack/react-query";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import { useApi } from "../api/api-context";
import { type Bike, EXIT_KINDS, type Exit, type ExitKind } from "../bike/bike";
import { getNextStatuses, type NextStatus } from "../bike/status";
import { TransitionRefusedError } from "../bike-store/bike-store";
import { ActionButton } from "../components/action-button/action-button";
import { Cluster } from "../components/layout/layout";
import { ModalDialog } from "../components/modal-dialog/modal-dialog";
import { ToggleGroup } from "../components/toggle-group/toggle-group";

/* Un verbe à l'infinitif, ce qu'on fait au vélo : un nom de statut ferait croire à une chip. */
const ACTION_LABELS = {
	"prêt à la vente": "Mettre en vente",
	sorti: "Sortir du stock",
	démonté: "Démonter",
} as const satisfies Record<NextStatus, string>;

const ACTION_ICONS = {
	"prêt à la vente": "🏷️",
	sorti: "📤",
	démonté: "🔧",
} as const satisfies Record<NextStatus, string>;

/*
 * Les actions qui font avancer le vélo dans son parcours. Un tap ne change rien : il ouvre
 * une fenêtre modale, qui demande confirmation ou, pour la sortie, son formulaire. Un vélo
 * sorti ou démonté n'a plus d'action.
 */
export function BikeActions({ bike }: { bike: Bike }) {
	const api = useApi();
	const changeStatus = useMutation(api.bikes.changeStatus.mutationOptions());
	const [openedAction, setOpenedAction] = useState<NextStatus | null>(null);
	const nextStatuses = getNextStatuses(bike.status);
	if (nextStatuses.length === 0) return null;

	function open(status: NextStatus) {
		changeStatus.reset();
		setOpenedAction(status);
	}

	function close() {
		setOpenedAction(null);
	}

	const error = changeStatus.error && (
		<ChangeStatusError error={changeStatus.error} />
	);

	return (
		<>
			<Cluster>
				{nextStatuses.map((status) => {
					return (
						<ActionButton
							key={status}
							variant={status === "démonté" ? "danger" : "secondary"}
							size="small"
							icon={ACTION_ICONS[status]}
							aria-haspopup="dialog"
							onClick={() => open(status)}
						>
							{ACTION_LABELS[status]}
						</ActionButton>
					);
				})}
			</Cluster>

			{openedAction === "sorti" && (
				<ExitDialog
					isPending={changeStatus.isPending}
					error={error}
					onSubmit={(exit) => {
						changeStatus.mutate(
							{ reference: bike.reference, transition: { to: "sorti", exit } },
							{ onSuccess: close },
						);
					}}
					onClose={close}
				/>
			)}

			{openedAction !== null && openedAction !== "sorti" && (
				<ModalDialog
					title={ACTION_LABELS[openedAction]}
					onClose={close}
					actions={
						<>
							<ActionButton variant="secondary" onClick={close}>
								Annuler
							</ActionButton>
							<ActionButton
								variant="primary"
								onClick={async () => {
									await changeStatus.mutateAsync({
										reference: bike.reference,
										transition: { to: openedAction },
									});
									close();
								}}
							>
								Confirmer
							</ActionButton>
						</>
					}
				>
					<p>Passer ce vélo « {openedAction} » ?</p>
					{error}
				</ModalDialog>
			)}
		</>
	);
}

/** Le miroir légal de la fiche don : l'acheteur est requis, et le prix pour une vente. */
function ExitDialog({
	isPending,
	error,
	onSubmit,
	onClose,
}: {
	isPending: boolean;
	error: ReactNode;
	onSubmit: (exit: Exit) => void;
	onClose: () => void;
}) {
	const [exitKind, setExitKind] = useState<ExitKind | null>(null);
	const formId = useId();
	const buyerId = useId();
	const priceId = useId();

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit(parseExitForm(new FormData(event.currentTarget)));
	}

	return (
		<ModalDialog
			title="Sortie de stock"
			onClose={onClose}
			actions={
				<>
					<ActionButton variant="secondary" onClick={onClose}>
						Annuler
					</ActionButton>
					<ActionButton
						type="submit"
						form={formId}
						variant="primary"
						disabled={isPending}
					>
						Confirmer la sortie
					</ActionButton>
				</>
			}
		>
			<form id={formId} className="layout-stack" onSubmit={submit}>
				<ToggleGroup
					type="radio"
					legend="Type de sortie"
					name="exitKind"
					options={EXIT_KINDS}
					checked={exitKind}
					onChange={(event) => {
						const value = event.target.value;
						setExitKind(EXIT_KINDS.find((kind) => kind === value) ?? null);
					}}
				/>
				<div className="form-field">
					<label className="label" htmlFor={buyerId}>
						Acheteur
					</label>
					<input id={buyerId} name="buyer" type="text" required />
				</div>
				{exitKind === "vente" && (
					<div className="form-field">
						<label className="label" htmlFor={priceId}>
							Prix, en euros
						</label>
						<input
							id={priceId}
							name="price"
							type="number"
							inputMode="decimal"
							min="0"
							/* Sans step, le pas vaut 1 et le navigateur refuse un prix comme 12,50. */
							step="any"
							required
						/>
					</div>
				)}
			</form>
			{error}
		</ModalDialog>
	);
}

function ChangeStatusError({ error }: { error: Error }) {
	const isRefused = error instanceof TransitionRefusedError;

	return (
		<div className="notice-block" data-variant="danger" role="alert">
			<p className="title">Le statut n'a pas changé</p>
			<p>
				{isRefused
					? `${error.message}. La fiche a peut-être changé entre-temps : rechargez-la.`
					: "Vérifiez la connexion, puis réessayez."}
			</p>
		</div>
	);
}

/** Le navigateur a déjà vérifié les champs requis : un champ absent veut dire un formulaire cassé. */
function parseExitForm(form: FormData): Exit {
	const exitKind = form.get("exitKind");
	const buyer = form.get("buyer");
	if (typeof buyer !== "string") throw new Error(`field "buyer" is missing`);

	if (exitKind === "don") return { exitKind, buyer };
	if (exitKind === "vente") {
		return { exitKind, buyer, price: Number(form.get("price")) };
	}
	throw new Error(`field "exitKind" holds ${exitKind}, expected vente or don`);
}
