import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		/*
		 * unreel est branché par un lien vers son propre dépôt. Sans cette ligne, il chargerait
		 * le React rangé là-bas : deux React dans une même page ne partagent pas leur état, et
		 * les hooks d'unreel cassent.
		 */
		dedupe: ["react", "react-dom"],
	},
	test: {
		environment: "happy-dom",
	},
});
