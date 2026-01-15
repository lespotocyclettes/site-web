#!/usr/bin/env -S npx tsx

/**
 *
 * Importe tous les extraits de compte au format ".csv" dans le dossier "./input"
 * et calcule les valeurs.
 *
 */

import { fail } from "assert";
import XLSX from "../xlsx.ts";
import { glob } from "fs/promises";
import path from "path";
import { getWeek } from "date-fns";
import asciichart from "asciichart";

type Structure = {
	date: Date;
	effective_date: Date;
	operation: string;
	movement: number;
};

const csvs = await glob(path.join(import.meta.dirname, "./input/*.csv"));

const all: Structure[] = [];
for await (const csv of csvs) {
	const workBook = XLSX.readFile(csv, { raw: true });
	const workSheet =
		workBook.Sheets[workBook.SheetNames[0] ?? fail("file is empty")] ??
		fail("file is empty");

	const rawContent = XLSX.utils
		.sheet_to_json(workSheet, { raw: true, header: 1, rawNumbers: true })
		.slice(1) as (string | undefined)[][];

	const content: Structure[] = rawContent
		.map((values) => {
			if (!values[0]) return;

			const result = {
				date: fromFrenchDateNotation(String(values[0])),
				effective_date: fromFrenchDateNotation(String(values[1])),
				operation: String(values[2]),
				movement: toMovementNumber(values[3], values[4]),
			} satisfies Structure;

			return result;
		})
		.filter((val) => val != null);

	all.push(...content);
}

const sorted = all.sort((a, b) => a.date.getTime() - b.date.getTime());

const initial = 14_000;
const byYear = Object.groupBy(sorted, (x) => x.date.getFullYear());

let accumulated = initial;

const weeklyResults: Record<string, number[]> = {};
for (const [year, operations] of Object.entries(byYear)) {
	if (!operations) continue;
	const atStart = accumulated;
	const result = process(operations);
	accumulated += result.current;

	const toPlot = result.resultByWeek.map((x) => Math.round(x + atStart));
	weeklyResults[year] = toPlot;
	console.log(`

// ${year} //

${numFmt(atStart)} -> ${numFmt(accumulated)} (${numFmt(result.current)})

Tréso min: ${numFmt(atStart + result.lowest)}
Tréso max: ${numFmt(atStart + result.highest)}

${asciichart.plot([toPlot], { height: 10, colors: [result.current > 0 ? asciichart.green : asciichart.red] })}
`);
}

const toPlot: number[][] = [];
let currOffset = 0;
let last = 0;
for (const week of Object.values(weeklyResults)) {
	toPlot.push([...Array.from({ length: currOffset }, () => last), ...week]);
	currOffset += week.length;
	last = toPlot.at(-1)?.at(-1) ?? 0;
}

console.log(`
// TOTAL //

${asciichart.plot(toPlot.reverse(), {
	height: 30,
	colors: [
		asciichart.blue,
		asciichart.green,
		asciichart.blue,
		asciichart.green,
		asciichart.blue,
		asciichart.green,
	],
})}
`);

function process(operations: Structure[]) {
	let lowest = 0;
	let highest = 0;
	let current = 0;

	const chunkedByWeek = Object.groupBy(operations, (x) => getWeek(x.date));
	const resultByWeek: number[] = [];

	for (const week of Object.values(chunkedByWeek)) {
		if (!week) continue;
		for (const operation of week) {
			current += operation.movement;
		}
		lowest = Math.min(lowest, current);
		highest = Math.max(highest, current);
		resultByWeek.push(current);
	}

	return {
		current,
		lowest,
		highest,
		resultByWeek,
	};
}

function numFmt(num: number) {
	const val = num.toLocaleString("fr-FR", {
		style: "currency",
		currency: "EUR",
	});
	if (num > 0) return `+${val}`;
	return val;
}

// UTILS //
function fromFrenchDateNotation(date: string) {
	let result = new Date(date.split("/").reverse().join("-"));
	if (Number.isNaN(result.getTime())) {
		if (date.includes(".")) {
			result = new Date(date.split(".").reverse().join("-"));
		}
	}
	if (Number.isNaN(result.getTime())) {
		throw new Error(`Invalid date: ${date}`);
	}
	return result;
}

function toMovementNumber(
	debit: number | string | undefined,
	credit: number | string | undefined,
) {
	if (debit && credit)
		throw new Error("Invalid movement data. Both debit and credit are defined");
	if (debit) return -fromFrenchNumberNotation(String(debit));
	if (credit) return fromFrenchNumberNotation(String(credit));
	return 0;
}

function fromFrenchNumberNotation(number: string) {
	return Number.parseFloat(number.replace(" ", "").replace(",", "."));
}
