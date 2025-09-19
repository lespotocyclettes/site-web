export type StockName = string;
export type TypeTransmission = string;
export type TypeVelo = string;
export type Marque = string;
export type Couleur = string;
export type DiametrePneu = string;
export type LargeurPneu = string;
export type Etat = "Garder" | "Prêt à rouler" | "à réparer" | "à démonter";

export type Structure = {
	reference: string; // 000000.01
	fiche_velo: boolean;
	stock?: StockName;
	type_transmission_caractere?: TypeTransmission;
	type_velo: TypeVelo[];
	marque?: Marque;
	nom?: string;
	couleur: Couleur[];
	pneu?: {
		diametre: DiametrePneu | undefined;
		largeur: LargeurPneu | undefined;
	};
	donateur?: string;
	acheteur?: string;
	date_sortie?: string;
	etat?: Etat;
	vendu: boolean;
};
