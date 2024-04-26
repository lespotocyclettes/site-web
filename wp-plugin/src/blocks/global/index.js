document.addEventListener(
	"DOMContentLoaded",
	() => {
		addPinnedClass("header.wp-block-template-part");
	},
	{ once: true },
);

// inspiration from https://davidwalsh.name/detect-sticky
function addPinnedClass(selectors) {
	const elements = document.querySelectorAll(selectors);
	const observer = new IntersectionObserver(
		([element]) =>
			element.target.classList.toggle(
				"is-pinned",
				element.intersectionRatio < 1,
			),
		{ threshold: [1] },
	);

	for (const element of elements) {
		observer.observe(element);
	}
}
