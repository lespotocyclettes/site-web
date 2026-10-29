import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { ActionButton } from "./action-button";

test("une action en cours ne peut pas repartir, et le bouton revient à sa fin", async () => {
	let resolve = () => {};
	const promise = new Promise<void>((resolvePromise) => {
		resolve = resolvePromise;
	});
	const action = vi.fn(() => promise);
	render(<ActionButton onClick={action}>Prêt à la vente</ActionButton>);
	const button = screen.getByRole("button", { name: "Prêt à la vente" });

	fireEvent.click(button);
	fireEvent.click(button);

	expect(action).toHaveBeenCalledTimes(1);
	expect(button).toHaveProperty("disabled", true);
	expect(button.getAttribute("aria-busy")).toBe("true");

	await act(async () => {
		resolve();
	});

	expect(button).toHaveProperty("disabled", false);
	expect(button.getAttribute("aria-busy")).toBe("false");
});
