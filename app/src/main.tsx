import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createApi } from "./api/api";
import { ApiProvider } from "./api/api-context";
import { App } from "./app";
import { getTodayIsoDate } from "./bike/iso-date";
import { createInMemoryBikeStore } from "./bike-store/in-memory-bike-store";
import { SAMPLE_BIKES } from "./bike-store/sample-bikes";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("should not happen : index.html declares #root");

/* Le faux relais tant que le relais PHP n'existe pas : c'est ici qu'on branchera le vrai. */
const store = createInMemoryBikeStore({
	bikes: SAMPLE_BIKES,
	getToday: getTodayIsoDate,
});

createRoot(root).render(
	<StrictMode>
		<QueryClientProvider client={new QueryClient()}>
			<ApiProvider api={createApi(store)}>
				<App />
			</ApiProvider>
		</QueryClientProvider>
	</StrictMode>,
);
