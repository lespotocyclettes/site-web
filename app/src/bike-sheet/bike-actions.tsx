import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { useApi } from "../api/api-context";
import { type Bike, EXIT_KINDS, type Exit, type ExitKind } from "../bike/bike";
import { getNextStatuses, type NextStatus } from "../bike/status";
import { TransitionRefusedError } from "../bike-store/bike-store";
import { ActionButton } from "../components/action-button/action-button";
import { Cluster, Stack } from "../components/layout/layout";
import { ToggleGroup } from "../components/toggle-group/toggle-group";

const ACTION_LABELS = {
	"prêt à la vente": "Prêt à la vente",
	sorti: "Sortie de stock",
	démonté: "Démonté",
} as const satisfies Record<NextStatus, string>;

/*
 * Les actions qui font avancer le vélo dans son parcours. Un tap ne change rien : il déplie
 * sur place la confirmation, ou le formulaire de sortie, sous la rangée de boutons. Un vélo
 * sorti ou démonté n'a plus d'action.
 */
export function BikeActions({ bike }: { bike: Bike }) {
	const api = useApi();
	const changeStatus = useMutation(api.bikes.changeStatus.mutationOptions());
	const [unfolded, setUnfolded] = useState<NextStatus | null>(null);
	const nextStatuses = getNextStatuses(bike.status);
	if (nextStatuses.length === 0) return null;

	function unfold(status: NextStatus) {
		changeStatus.reset();
		setUnfolded(status);
	}

	function fold() {
		setUnfolded(null);
	}

	return (
		<Stack>
			<Cluster>
				{nextStatuses.map((status) => {
					return (
						<ActionButton
							key={status}
							variant={status === "démonté" ? "danger" : "secondary"}
							aria-expanded={unfolded === status}
							onClick={() => unfold(status)}
						>
							{ACTION_LABELS[status]}
						</ActionButton>
					);
				})}
			</Cluster>

			{unfolded === "sorti" && (
				<ExitForm
					isPending={changeStatus.isPending}
					onSubmit={(exit) => {
						changeStatus.mutate(
							{ reference: bike.reference, transition: { to: "sorti", exit } },
							{ onSuccess: fold },
						);
					}}
					onCancel={fold}
				/>
			)}

			{unfolded !== null && unfolded !== "sorti" && (
				<Stack gap="var(--size-2)">
					<p>Passer ce vélo « {unfolded} » ?</p>
					<Cluster>
						<ActionButton
							variant="primary"
							onClick={async () => {
								await changeStatus.mutateAsync({
									reference: bike.reference,
									transition: { to: unfolded },
								});
								fold();
							}}
						>
							Confirmer
						</ActionButton>
						<ActionButton variant="secondary" onClick={fold}>
							Annuler
						</ActionButton>
					</Cluster>
				</Stack>
			)}

			{changeStatus.error && <ChangeStatusError error={changeStatus.error} />}
		</Stack>
	);
}

/** Le miroir légal de la fiche don : l'acheteur est requis, et le prix pour une vente. */
function ExitForm({
	isPending,
	onSubmit,
	onCancel,
}: {
	isPending: boolean;
	onSubmit: (exit: Exit) => void;
	onCancel: () => void;
}) {
	const [exitKind, setExitKind] = useState<ExitKind | null>(null);
	const buyerId = useId();
	const priceId = useId();

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit(parseExitForm(new FormData(event.currentTarget)));
	}

	return (
		<form className="layout-stack" onSubmit={submit}>
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
			<Cluster>
				<ActionButton type="submit" variant="primary" disabled={isPending}>
					Confirmer la sortie
				</ActionButton>
				<ActionButton variant="secondary" onClick={onCancel}>
					Annuler
				</ActionButton>
			</Cluster>
		</form>
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
