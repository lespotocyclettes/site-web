// Une extension qui retarde les scripts peut nous lancer après le chargement de la page :
// l'événement DOMContentLoaded est alors déjà passé, et l'attendre bloquerait pour toujours.
function main() {
	addPinnedClass("header.wp-block-template-part");
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => main(), { once: true });
} else {
	main();
}

// inspiré de https://davidwalsh.name/detect-sticky
// Va de pair avec `top: -1px` dans style.scss : collé en haut, l'en-tête dépasse d'un
// pixel et n'est plus visible en entier, d'où le ratio sous 1.
function addPinnedClass(selectors) {
	const headers = document.querySelectorAll(selectors);
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				const isPinned = entry.intersectionRatio < 1;
				entry.target.classList.toggle("is-pinned", isPinned);
			}
		},
		{ threshold: [1] },
	);

	for (const header of headers) {
		observer.observe(header);
	}
}
