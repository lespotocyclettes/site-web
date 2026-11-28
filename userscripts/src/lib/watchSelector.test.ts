import { afterEach, describe, expect, it, vi } from "vitest";
import { waitQuerySelector, watchSelector } from "./watchSelector.ts";

afterEach(() => {
	document.body.innerHTML = "";
});

function addTyre(name: string) {
	const tyre = document.createElement("p");
	tyre.className = "pneu";
	tyre.textContent = name;
	document.body.append(tyre);
	return tyre;
}

describe("watchSelector", () => {
	it("signale les éléments déjà là, puis ceux qui arrivent", async () => {
		const front = addTyre("avant");
		const seen: Element[] = [];

		const stop = watchSelector(document, ".pneu", (element) =>
			seen.push(element),
		);
		const rear = addTyre("arrière");

		await vi.waitFor(() => expect(seen).toEqual([front, rear]));
		stop();
	});

	it("se tait une fois arrêté", async () => {
		const seen: Element[] = [];

		const stop = watchSelector(document, ".pneu", (element) =>
			seen.push(element),
		);
		stop();
		addTyre("de secours");

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(seen).toEqual([]);
	});
});

describe("waitQuerySelector", () => {
	it("renvoie l'élément dès qu'il apparaît", async () => {
		const found = waitQuerySelector(document, ".pneu");
		const tyre = addTyre("neuf");

		await expect(found).resolves.toBe(tyre);
	});

	it("renvoie null passé le délai", async () => {
		await expect(
			waitQuerySelector(document, ".pneu", { timeout: 20 }),
		).resolves.toBeNull();
	});
});
