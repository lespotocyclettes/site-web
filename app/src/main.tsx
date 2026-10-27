import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("should not happen : index.html declares #root");

createRoot(root).render(
	<StrictMode>
		<p>Mini-app vélos</p>
	</StrictMode>,
);
