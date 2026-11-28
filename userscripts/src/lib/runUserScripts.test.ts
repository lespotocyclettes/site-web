import { afterEach, describe, expect, it, vi } from "vitest";
import { defineUserScript, runUserScripts } from "./runUserScripts.ts";

// L'adresse de la page de test est fixée dans vitest.config.ts : /nous-rejoindre/.
const onMembershipPage = (url: URL) => url.pathname === "/nous-rejoindre/";
const elsewhere = (url: URL) => url.pathname === "/ailleurs/";

afterEach(() => {
	document.head.innerHTML = "";
	vi.restoreAllMocks();
});

describe("runUserScripts", () => {
	it("lance seulement les scripts qui concernent la page", async () => {
		const run = vi.fn();
		const skipped = vi.fn();

		await runUserScripts([
			defineUserScript({ name: "ici", match: onMembershipPage, run }),
			defineUserScript({ name: "ailleurs", match: elsewhere, run: skipped }),
		]);

		expect(run).toHaveBeenCalledOnce();
		expect(skipped).not.toHaveBeenCalled();
	});

	it("ajoute à la page les styles des seuls scripts lancés", async () => {
		await runUserScripts([
			defineUserScript({
				name: "ici",
				match: onMembershipPage,
				styles: "body { color: red }",
			}),
			defineUserScript({
				name: "ailleurs",
				match: elsewhere,
				styles: "body { color: blue }",
			}),
		]);

		const styles = document.getElementById(
			"poto-userscripts-styles",
		)?.textContent;
		expect(styles).toContain("color: red");
		expect(styles).not.toContain("color: blue");
	});

	it("un script qui plante n'empêche pas les autres de tourner", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		const run = vi.fn();

		await runUserScripts([
			defineUserScript({
				name: "en panne",
				match: onMembershipPage,
				run() {
					throw new Error("crevaison");
				},
			}),
			defineUserScript({ name: "en forme", match: onMembershipPage, run }),
		]);

		expect(run).toHaveBeenCalledOnce();
		expect(console.error).toHaveBeenCalledWith(
			"[poto] en panne a planté :",
			expect.any(Error),
		);
	});
});
