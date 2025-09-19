import type {
	Couleur,
	DiametrePneu,
	LargeurPneu,
	Marque,
	StockName,
	TypeTransmission,
	TypeVelo,
	Structure,
} from "./types.ts";

export function logImportDiagnostics(content: Structure[]) {
	const accumulatedValues = {
		stock: new Map<StockName, number>(),
		type_transmission_caractere: new Map<TypeTransmission, number>(),
		type_velo: new Map<TypeVelo, number>(),
		marque: new Map<Marque, number>(),
		nom: new Map<string, number>(),
		couleur: new Map<Couleur, number>(),
		pneu: {
			diametre: new Map<DiametrePneu, number>(),
			largeur: new Map<LargeurPneu, number>(),
		},
	};

	content.forEach((value) => {
		addValues(accumulatedValues.stock, value.stock);
		addValues(
			accumulatedValues.type_transmission_caractere,
			value.type_transmission_caractere,
		);
		addValues(accumulatedValues.type_velo, ...value.type_velo);
		addValues(accumulatedValues.marque, value.marque);
		addValues(accumulatedValues.nom, value.nom);
		addValues(accumulatedValues.couleur, ...value.couleur);
		addValues(accumulatedValues.pneu.diametre, value.pneu.diametre);
		addValues(accumulatedValues.pneu.largeur, value.pneu.largeur);
	});

	console.log(accumulatedValues.pneu.diametre, accumulatedValues.pneu.largeur);
}

function addValues<T>(map: Map<T, number>, ...values: T[]) {
	values.forEach((value) => addValue(map, value));
}

function addValue<T>(map: Map<T, number>, value: T) {
	const count = map.get(value) ?? 0;
	map.set(value, count + 1);
}
