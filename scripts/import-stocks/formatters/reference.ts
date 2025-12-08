export function parseReference(reference: string | number | undefined) {
	if (!reference) throw new Error("reference is required");

	if (typeof reference !== "string")
		throw new Error("reference must be a string");

	if (!reference.match(/\d{6}\.\d{2}/))
		throw new Error(`Invalid reference fomat: ${reference}`);

	const year = reference.slice(0, 2);
	const month = reference.slice(2, 4);
	const day = reference.slice(4, 6);

	return {
		reference,
		date_entree: `20${year}-${month}-${day}`,
	};
}
