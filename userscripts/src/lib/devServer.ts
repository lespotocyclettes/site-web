/*
 * Partagé entre le navigateur (src/lib/devMode.ts) et la compilation (scripts/), qui écrit
 * le chargeur de développement : ce fichier ne touche donc pas à la page.
 */

/** Le serveur que lance `npm run dev`, d'où le navigateur charge la copie en cours d'écriture. */
export const DEV_SERVER_ORIGIN = "http://localhost:4173";

/** L'identifiant de la balise `<script>` qui charge la copie de développement dans la page. */
export const DEV_SCRIPT_ID = "poto-dev-script";
