#!/usr/bin/env -S npx tsx

import fs from 'node:fs/promises'
import path from 'node:path'
import XLSX from './xlsx.ts';

const input = process.argv[2] ?? fail('input is required')
const output = process.argv[3] ?? fail('output is required')

const workBook = XLSX.readFile(input)
const workSheet = workBook.Sheets[workBook.SheetNames[0] ?? fail('file is empty')]!

const rawContent = XLSX.utils.sheet_to_json(workSheet, { raw: true, header: 1, rawNumbers: true }).slice(1) as (string | number)[][]

type StockName = string
type TypeTransmission = string
type TypeVelo = string
type Marque = string
type Couleur = string
type DiametrePneu = string
type LargeurPneu = string
type Etat = 'Garder' | 'Prêt à rouler' | 'à réparer' | 'à démonter'

type Structure = {
  reference: string // 000000.01
  fiche_velo: boolean
  stock?: StockName
  type_transmission_caractere?: TypeTransmission
  type_velo: TypeVelo[]
  marque?: Marque
  nom?: string
  couleur: Couleur[]
  pneu: {
    diametre: DiametrePneu
    largeur: LargeurPneu
  }
  donateur?: string
  acheteur?: string
  date_sortie?: string
  etat?: Etat
  vendu: boolean
}
const content: Structure[] = rawContent.map((values) => {

  if(!values[0]) return

  return {
    reference: values[0] ?? fail('reference is required'),
    fiche_velo: Boolean(values[1]),
    stock: values[2],
    type_transmission_caractere: values[3],
    type_velo: [values[4]],
    marque: values[5],
    nom: values[6],
    couleur: formatColor(values[7]),
    pneu: {
      diametre: values[8],
      largeur: values[8],
    },
    donateur: values[9],
    acheteur: values[10],
    date_sortie: values[11],
    etat: values[12],
    vendu: Boolean(values[13]),
  } as Structure
}).filter(val => val != null)

const accumulatedValues = {
  stock: new Map<StockName, number>(),
  type_transmission_caractere: new Map<TypeTransmission, number>(),
  type_velo: new Map<TypeVelo, number>(),
  marque: new Map<Marque, number>(),
  couleur: new Map<Couleur, number>(),
  pneu: {
    diametre: new Map<DiametrePneu, number>(),
    largeur: new Map<LargeurPneu, number>(),
  }
}

content.forEach((value) => {
  addValues(accumulatedValues.stock, value.stock)
  addValues(accumulatedValues.type_transmission_caractere, value.type_transmission_caractere)
  addValues(accumulatedValues.type_velo, ...value.type_velo)
  addValues(accumulatedValues.marque, value.marque)
  addValues(accumulatedValues.couleur, ...value.couleur)
  addValues(accumulatedValues.pneu.diametre, value.pneu.diametre)
  addValues(accumulatedValues.pneu.largeur, value.pneu.largeur)
})

console.log(accumulatedValues)
// console.log(content)


await fs.mkdir(path.dirname(output), { recursive: true })

XLSX.writeFile({ Sheets: { 'data': XLSX.utils.json_to_sheet(content) }, SheetNames: ['data'] }, output)

// === utilities ===
function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

function addValues<T>(map: Map<T, number>, ...values: T[]) {
  values.forEach(value => addValue(map, value))
}

function addValue<T>(map: Map<T, number>, value: T) {
  const count = map.get(value) ?? 0
  map.set(value, count + 1)
}

function formatColor(color: string | number | undefined): Couleur[] {
  const replacements: Record<string, Couleur | Couleur[]> = {
    'bleu turquoise': ['bleu', 'turquoise'],
    'turquoise': ['bleu', 'turquoise'],
    'gris métal': ['gris', 'gris métal'],
    'rose fluo': ['rose', 'rose fluo'],
    'gris bleu': ['gris', 'gris bleu'],
    'rouge framboise': ['rouge', 'rouge framboise'],
    'rouge (repeint)': ['rouge', 'repeint'],
    'vieux rose': ['rose', 'vieux rose'],
    'pain brulé': ['brun', 'pain brulé'],
    'gris  foncé': ['gris', 'gris foncé'],
    'bleu clair': ['bleu', 'bleu clair'],
    'camouflage': ['vert', 'camouflage'],
    'vert fluo': ['vert', 'vert fluo'],
    'vert bleu': ['vert', 'vert bleu'],
    'gris argent': ['gris', 'gris argent'],
    'alu': ['gris', 'alu'],
    'bleu nuit': ['bleu', 'bleu nuit'],
  }

  return String(color ?? '')
    .split(/ et |\+/)
    .map(c => c.trim().toLocaleLowerCase())
    .flatMap(c => replacements[c] ?? c)
    .filter(c => c)
}
