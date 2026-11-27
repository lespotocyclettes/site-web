import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BottomBar } from "./bottom-bar";

test("retoucher l'onglet Recherche, déjà actif, n'ouvre aucune adresse et appelle onReselect", () => {
	const onReselect = vi.fn();
	render(<BottomBar onReselect={onReselect} />);

	/* fireEvent renvoie false quand le clic a été annulé : le lien n'a rien ouvert. */
	const isFollowed = fireEvent.click(
		screen.getByRole("link", { name: "Recherche" }),
	);

	expect(isFollowed).toBe(false);
	expect(onReselect).toHaveBeenCalledOnce();
});
