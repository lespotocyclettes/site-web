import type { ChangeEventHandler } from "react";

type ToggleGroupProps<T extends string> = {
	legend: string;
	/** Le nom des cases dans le formulaire : chaque chip cochée y envoie `name=option`. */
	name: string;
	options: readonly T[];
	checked: readonly T[];
	onChange: ChangeEventHandler<HTMLInputElement>;
};

/*
 * Des chips qu'on coche, habillées par toggle-group.css. Ce sont de vraies cases à cocher
 * dans un <fieldset> : le lecteur d'écran annonce le groupe par sa légende et dit de chaque
 * chip si elle est cochée, et le formulaire qui les contient les lit sans code de plus.
 */
export function ToggleGroup<T extends string>({
	legend,
	name,
	options,
	checked,
	onChange,
}: ToggleGroupProps<T>) {
	return (
		<fieldset className="toggle-group">
			<legend className="legend">{legend}</legend>
			<div className="options">
				{options.map((option) => {
					return (
						<label key={option} className="option">
							<input
								className="input"
								type="checkbox"
								name={name}
								value={option}
								checked={checked.includes(option)}
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
