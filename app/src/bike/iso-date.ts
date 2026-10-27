/**
 * Une date sans heure, écrite `AAAA-MM-JJ` (par exemple `2026-07-07`). C'est la forme que
 * Teable et le JSON transportent ; on la garde telle quelle plutôt que de la convertir en
 * objet `Date`, qui porte une heure et un fuseau dont on n'a pas besoin.
 */
export type IsoDate = string;
