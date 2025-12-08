export type StockName = string;
export type TypeTransmission = string;
export type TypeVelo = string;
export type Marque = string;
export type Couleur = string;
export type DiametrePneu = string;
export type LargeurPneu = string;
export type Etat = "garder" | "prêt à rouler" | "à réparer" | "à démonter";

export type Structure = {
	reference: string; // 000000.01
	fiche_velo: boolean;
	stock: StockName | undefined;
	type_transmission_caractere: TypeTransmission | undefined;
	type_velo: TypeVelo[];
	marque: Marque | undefined;
	nom: string | undefined;
	couleur: Couleur[];
	pneu:
		| undefined
		| {
				diametre: DiametrePneu | undefined;
				indicateurDiametreInterne?: "a" | "b" | "c" | undefined; // norme française
				largeur: LargeurPneu | undefined;
		  };
	donateur: undefined | string;
	acheteur: undefined | string;
	date_entree: undefined | string;
	date_sortie: undefined | string;
	etat: undefined | Etat;
	vendu: boolean;
};
