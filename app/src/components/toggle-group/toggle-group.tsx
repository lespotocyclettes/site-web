import type { ChangeEventHandler } from "react";

/**
 * Des cases à cocher par défaut : plusieurs chips cochées à la fois. En `radio`, une seule ;
 * le choix est alors obligatoire, le formulaire ne part pas sans lui.
 */
type Selection<T extends string> =
	| { type?: "checkbox"; checked: readonly T[] }
	| { type: "radio"; checked: T | null };

type ToggleGroupProps<T extends string> = Selection<T> & {
	legend: string;
	/** Le nom des cases dans le formulaire : chaque chip cochée y envoie `name=option`. */
	name: string;
	options: readonly T[];
	onChange: ChangeEventHandler<HTMLInputElement>;
};

/*
 * Des chips qu'on coche, habillées par toggle-group.css. Ce sont de vraies cases à cocher
 * (ou de vrais boutons radio) dans un <fieldset> : le lecteur d'écran annonce le groupe par
 * sa légende et dit de chaque chip si elle est cochée, et le formulaire qui les contient
 * les lit sans code de plus.
 */
export function ToggleGroup<T extends string>(props: ToggleGroupProps<T>) {
	const { legend, name, options, onChange } = props;
	const isRadio = props.type === "radio";

	function isChecked(option: T): boolean {
		if (props.type === "radio") return props.checked === option;

		return props.checked.includes(option);
	}

	return (
		<fieldset className="toggle-group">
			<legend className="legend">{legend}</legend>
			<div className="options">
				{options.map((option) => {
					return (
						<label key={option} className="option">
							<input
								className="input"
								type={isRadio ? "radio" : "checkbox"}
								name={name}
								value={option}
								checked={isChecked(option)}
								required={isRadio}
								onChange={onChange}
							/>
							{option}
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}
