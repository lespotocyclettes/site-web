# House Style — composing

**Read this when you write code in the house style.** `SKILL.md` carries what a review can
find; this file carries what only shows when you are the one holding the pen.

Nothing here ever produces a review finding. That is the line that put it in this file.

---

## Work in layers, the way a human does — `ds-006`

The one about *how you work*, and the one that outranks everything else.

Write the obvious version. Then reread it as a critic: which abstraction is missing, which
earns nothing, where does it hurt, what can be deleted. Then reread it as the person who
will review it — think of your reviewer before delivering, every time.

**What this refuses by name:** an agent one-shots a piece of already-optimised code and
rarely comes back to it. The passes are the point.

**The rules were derived from second passes; they cannot replace one.** And "I already
cleaned that up" is not an answer: you reread your code with the assumptions that produced
it. Only a third party knows when to stop.

## Step back before every commit — `ds-023`

A final reread before committing asks one question `ds-006`'s per-pass critique does not:
*is a pattern emerging that the current plan does not name?* If yes, say so and propose
reopening the plan — even if that grows the scope — rather than finishing it as approved.
The house wants to be challenged; what it does not want is silence about it.

**Bounded: propose, then wait.** Challenging the plan is never a unilateral pivot — flag
the pattern and wait for confirmation before acting on it.

**And read the repetition, not just the code.** A hint repeated across turns is a signal,
even short of a direct instruction.

## Deliver what helps the next person, not only the code — `ds-015`

`ds-007` past the file boundary. The next reader inherits more than the source: the tests,
the command that starts the project, the workaround an environment needed, what the tests
do **not** cover.

**The signal is checkable, and it is in your own report.** Any sentence of the form *"I
verified with a throwaway script"* is an admission — the means of verification existed and
was not handed over. If the work produced a way to check something, that way is part of
the work. Deleting it to keep the repo tidy is hoarding the project's only safety net.

**Two bounds, and neither is optional.** It governs what sits *outside* the
source file; **inside** the code, documentation still waits to be asked for — the JSDoc law
in `SKILL.md` is untouched. *Dedans sur demande, dehors d'office*, and *dedans* includes
debt comments. And it stays silent when you read someone else's diff.

Two consequences for a suite you wrote: **a test you wrote ships**, and **say what the
tests do not cover** — rendering, DOM wiring, anything checked by hand. The next reader
needs the boundary of the safety net as much as the net.

---

## Tendencies

They live in `SKILL.md`, because their job in review is **negative**: they say what not to
ask of a colleague (`ds-031`). Composing, read them as what the house writes when nothing else
decides — never as a shape to force onto code that already works.

---

## Done when

The code forces no move. The test: on a piece of code with no idiomatic occasion, it stays
plain — **do not pastiche**, a move reached for without its occasion makes the code worse,
not merely less recognisable.

Before you hand it over, do the second pass `ds-006` asks for — the first draft is not the
deliverable — and hand over what `ds-015` asks for: the tests you wrote, and what someone
needs to run the thing.
