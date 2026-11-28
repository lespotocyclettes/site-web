import { afterEach, expect, it, vi } from "vitest";
import { debounceIdle } from "./idle.ts";

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

it("sans requestIdleCallback (Safari), regroupe une rafale d'appels en un seul", () => {
	vi.stubGlobal("requestIdleCallback", undefined);
	vi.useFakeTimers();
	const callback = vi.fn();
	const schedule = debounceIdle(callback);

	schedule();
	schedule();
	schedule();
	vi.advanceTimersByTime(100);

	expect(callback).toHaveBeenCalledOnce();
});
