#!/usr/bin/env -S npx tsx

import fs from "node:fs/promises";
import path from "node:path";
import { fail } from "node:assert";

import XLSX from "./xlsx.ts";
import type { Structure } from "./types.ts";
import { logImportDiagnostics } from "./log-diagnostics.ts";
import { colorFormatter } from "./formatters/color.ts";
import { placeFormatter } from "./formatters/place.ts";
import { typeVeloFormatter } from "./formatters/type_velo.ts";
import { marqueFormatter } from "./formatters/marque.ts";
import { pneuFormatter } from "./formatters/pneu.ts";

const example = "./run.ts input/Stocks.xlsx output/stocks.xlsx";
const input =
	process.argv[2] ?? fail(`"input" is required. Example: "${example}"`);
const output =
	process.argv[3] ?? fail(`"output" is required. Example: "${example}"`);

const workBook = XLSX.readFile(input);
const workSheet =
	workBook.Sheets[workBook.SheetNames[0] ?? fail("file is empty")] ??
	fail("file is empty");

const rawContent = XLSX.utils
	.sheet_to_json(workSheet, { raw: true, header: 1, rawNumbers: true })
	.slice(1) as (string | number)[][];

const content: Structure[] = rawContent
	.map((values) => {
		if (!values[0]) return;

		return {
			reference: String(values[0] ?? fail("reference is required")),
			fiche_velo: Boolean(values[1]),
			stock: placeFormatter(values[2]),
			type_transmission_caractere: values[3]
				? String(values[3]).toLocaleLowerCase()
				: undefined,
			type_velo: typeVeloFormatter(values[4]),
			marque: marqueFormatter(values[5]),
			nom: values[6] ? String(values[6]).toLocaleLowerCase() : undefined,
			couleur: colorFormatter(values[7]),
			pneu: pneuFormatter(values[8]),
			donateur: values[9],
			acheteur: values[10],
			date_sortie: values[11],
			etat: values[12],
			vendu: Boolean(values[13]),
		} satisfies Structure;
	})
	.filter((val) => val != null);

logImportDiagnostics(content);

// console.log(content)

await fs.mkdir(path.dirname(output), { recursive: true });

function normalizeData(data: Structure[]) {
	return data.map(
		(item): Record<string, number | string | boolean | undefined> => {
			const { couleur, type_velo, pneu, ...rest } = item;
			return {
				...rest,
				couleur: couleur.join(", "),
				type_velo: type_velo.join(", "),
				pneu_diametre: pneu?.diametre,
				pneu_largeur: pneu?.largeur,
			};
		},
	);
}

const normalizedContent = normalizeData(content);

XLSX.writeFile(
	{
		Sheets: { data: XLSX.utils.json_to_sheet(normalizedContent) },
		SheetNames: ["data"],
	},
	output,
);
