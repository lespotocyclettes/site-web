/*
 * Copie le plugin dans le WordPress local (celui de WP-Local), puis recopie à chaque
 * modification. Lancé par `npm run rsync`, et par `npm run dev` à côté du build.
 *
 * Remplace rsync-watch, qui collait les chemins dans une commande shell sans guillemets :
 * un dossier comme « Local Sites » était coupé en deux à l'espace, et l'erreur de rsync
 * n'était jamais affichée. Ici rsync reçoit ses arguments un par un, sans passer par le
 * shell, et ses erreurs s'affichent dans le terminal.
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync, watch } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";

const PLUGIN_ROOT = fileURLToPath(new URL("..", import.meta.url));

/**
 * Ce qui ne part pas dans le WordPress local : les sources, les outils, les secrets.
 * Reprend les exclusions du déploiement FTP (.github/workflows/main.yml), plus ce qui
 * n'existe que sur la machine du développeur.
 */
const EXCLUDED = [
	"src",
	"node_modules",
	"scripts",
	"package.json",
	"jsconfig.json",
	".env",
	".env.example",
	".editorconfig",
	".gitignore",
	"README.md",
	".claude",
	"backups",
];

// Attente avant de copier : un enregistrement déclenche souvent plusieurs évènements d'affilée.
const DEBOUNCE_MS = 200;

dotenv.config({ path: join(PLUGIN_ROOT, ".env") });

const wpContent = process.env.DEV_WP_CONTENT_FOLDER;
if (!wpContent) {
	fail(
		"DEV_WP_CONTENT_FOLDER n'est pas défini : ajoutez-le à votre fichier .env",
	);
}
if (!existsSync(join(wpContent, "plugins"))) {
	fail(
		`Pas de dossier plugins dans ${wpContent} : vérifiez DEV_WP_CONTENT_FOLDER dans .env`,
	);
}

const destination = join(wpContent, "plugins/lespotocyclettes/");

let timer;
let running = false;
let pending = false;

sync();
watchPlugin(scheduleSync);

function scheduleSync() {
	clearTimeout(timer);
	timer = setTimeout(sync, DEBOUNCE_MS);
}

function sync() {
	if (running) {
		pending = true;
		return;
	}
	running = true;

	// rsync ne recopie que ce qui a changé ; --delete retire de la copie ce qui a disparu ici.
	const rsync = spawn(
		"rsync",
		[
			"--archive",
			"--delete",
			"--out-format=  %n",
			...EXCLUDED.flatMap((name) => ["--exclude", `/${name}`]),
			PLUGIN_ROOT,
			destination,
		],
		{ stdio: "inherit" },
	);

	rsync.on("error", (error) => {
		if (error.code === "ENOENT") {
			fail("rsync est introuvable : installez-le (sous Windows, dans WSL)");
		}
		fail(`rsync n'a pas pu démarrer : ${error.message}`);
	});

	rsync.on("close", (code) => {
		running = false;
		if (code === 0) {
			console.log(`Plugin à jour dans ${destination}`);
		} else {
			console.error(`La copie a échoué (rsync a rendu le code ${code})`);
		}
		if (pending) {
			pending = false;
			sync();
		}
	});
}

/**
 * Surveille le dossier du plugin, sauf ce qui est exclu de la copie. Surveiller la racine
 * d'un bloc, node_modules compris, poserait des dizaines de milliers d'observateurs.
 */
function watchPlugin(onChange) {
	const watchers = new Map();

	// Les dossiers apparaissent et disparaissent en cours de route : build/ n'existe pas
	// encore quand `npm run dev` démarre sur un dépôt tout juste cloné.
	const watchDirectories = () => {
		for (const [name, watcher] of watchers) {
			if (!existsSync(join(PLUGIN_ROOT, name))) {
				watcher.close();
				watchers.delete(name);
			}
		}
		for (const entry of readdirSync(PLUGIN_ROOT, { withFileTypes: true })) {
			if (
				entry.isDirectory() &&
				!EXCLUDED.includes(entry.name) &&
				!watchers.has(entry.name)
			) {
				watchDirectory(entry.name);
			}
		}
	};

	// Le build vide puis recrée ses sous-dossiers. L'observateur de Node peut alors tomber
	// sur un dossier déjà disparu, et une erreur non écoutée arrêterait le script : on
	// remplace l'observateur par un neuf, une fois le build calmé, et on recopie.
	const retry = () => {
		setTimeout(watchDirectories, DEBOUNCE_MS);
		onChange();
	};

	const watchDirectory = (name) => {
		let watcher;
		try {
			watcher = watch(join(PLUGIN_ROOT, name), { recursive: true }, onChange);
		} catch {
			retry();
			return;
		}
		watcher.on("error", () => {
			watcher.close();
			watchers.delete(name);
			retry();
		});
		watchers.set(name, watcher);
	};

	watchDirectories();
	watch(PLUGIN_ROOT, () => {
		watchDirectories();
		onChange();
	});
}

function fail(message) {
	console.error(message);
	process.exit(1);
}
