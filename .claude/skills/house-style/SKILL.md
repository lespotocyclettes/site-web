---
name: house-style
description: Write or review code in the house style.
disable-model-invocation: false
---

# House Style

> **The name is from publishing.** A *house style* is the set of conventions a house
> holds, from the comma to the structural rule. It says **particular**, never
> **correct**. Nothing below is a claim about good code in general; it is a claim about
> this code, in these repos.

> **If you are writing code, read `compose.md` first.** This file carries what a review can
> find. The dispositions that only bear on writing — working in layers, stepping back
> before a commit, delivering what helps the next person, the tendencies — live there.

**Do not pastiche.** These are recognition signals, not ingredients. Code that reaches for
a move it did not need is *worse* code, not merely less recognisable — a marker
over-applied is the failure mode this skill has already caused once, when an agent saw the
`important:` comment register and began spreading it. Apply what the situation brings;
leave the rest absent.

**And read before you write.** The strongest single rule in this document is that the
codebase you are in wins: match its conventions rather than importing your defaults or
the house's. See *Consistency*.

---

## The dispositions

**Lead with these. The rules below are their consequences**, and a rule handed over
without its reason gets applied past the point where it helps. The broadest sit here; the
rest are projected where they bite.

**Some of them are grouped under four idioms.** An idiom is a borrowed name: what binds is
the house's reading of it and its departures from it, not the textbook definition. Each
block reads idiom → the house's reading → departures → the rules underneath. **The fourth restrains the
other three** — read it last and let it bound them.

### Idiom — Functional core, imperative shell

**The house's reading: purity by default, and the effect pushed to the last moment** — `ds-004`

A unit takes what it acts on and returns a value: no ambient state, no fetching, no
module-level anything. The point is not elegance, it is that a pure unit can be read and
tested on its own, with no hooks in the way.

"By default" is doing work there. Impurity is pushed to the edge, made visible, and
**deferred as late as it can be**. A factory prepares the work rather than doing it;
losing `async` from the signature is the *consequence* — strip the keyword without moving
the work and you have made nothing better.

**What holds is the separation; deferring is one means**, and reading it the other way
round is too hard a line.

**At the scale of modules: architecture hexagonale / ports and adapters** — `ds-026`.
Stated, not yet bounded or traced. Its neighbours are `ds-018` (the concern it
separates) and SOLID's D. No scope is stated, and none should be invented: until it is
bounded, raise it as a question rather than apply it as a rule.

**Departures: none.** Read the idiom as it is.

**The rules underneath:**

- **Pass a unit what it needs.** No ambient access — `rewindAction(predicate,
  getStepDefinition)` rather than letting the module import the options, so it stays
  testable alone. **The same rule inside a class**: a private method takes what it acts on.
  `#abortAbortControllerByKey(key)` is callable on any key and reads as one thing.
  `law`
- **Defer the effect to the last moment.** A factory returns a thunk rather than doing the
  work; the constructor prepares, the call site runs. This is what lets a signature stay
  synchronous, and the order matters — move the work, then drop the `async`.
  `habit`
- **Separate the side effect from the computation.** Return raw data from the query;
  compute in a `useMemo`, or better in a hook-free business function. **When materialising
  the whole result costs too much**, the core takes the effect as a parameter —
  `forEachPermutation(input, visit)` — rather than performing it. `law`
- **A module-level mock is a decoupling you skipped.** `vi.mock('some-module')` in a new
  test → inject the dependency instead. It is fragile, it discourages decoupling, and it
  is the symptom of a shared global state: *à bannir*. It also descends from `ds-018`
  below — a module mock lets a fused infra/business unit pass its tests without ever being
  unbraided. `law`

### Idiom — Make illegal states unrepresentable

**The house's reading: make impossible states impossible** — `ds-005`

A rule that must be remembered will be forgotten; a state that cannot be represented never
occurs.

**Departures — where the house's reading goes past the idiom:**

1. **Construction, not only types.** Move the constraint from discipline to construction.
   The type system, a disabled attribute and a mandatory parameter are the three cheap
   places to put one.
2. **When correctness depends on a call having happened, carry the dependency in a value.**
   The call returns what the next step requires — a result, a handle, a receipt whose type
   proves it ran — and the order stops being something to remember. A lock hands back proof
   it is held, and the function that needs the lock takes that proof as a parameter: the
   comment *"must be locked before calling this"* becomes unnecessary. Where the wait is
   about timing rather than order, the same move gives the caller something to await —
   `whenQuiescent()` rather than a delay. Neither document the obligation nor warn on it.
   **The tell is the consequence: a line whose absence produces a wrong result with no
   error.** Every implementer must write it, it does nothing on its own, and omitting it
   fails in silence. A ceremonial line that throws when forgotten is merely tedious; this
   one is a defect.
   **And where the call has nothing to return, delete it**: make the do-nothing path the
   default, so the obligation disappears instead of being written down.
   **Pull over push.** A producer that must notify every consumer is that forgettable line,
   once per consumer: saving a product then remembering to reindex search, rebuild the
   sitemap and refresh the price badge. A consumer that reads its freshness from its source
   cannot forget it: each derived view is built from the catalogue revision it read, and a
   new revision is simply never served from an old view. Push keeps its place, more often
   as a performance optimisation. And the version is minted by whoever writes the data,
   not by an upstream that would have to remember.
3. **Leave an escape hatch that forces a decision rather than an answer.** Its strongest
   form makes the good practice unavoidable: `toast(…, {exceptionToCapture: Error |
   undefined})` makes you say whether there is an exception, and "none" is a valid answer.
   A constraint with no way out gets routed around.
4. **A smart default only where one branch is genuinely the common case** — see the
   explicit-parameter rule below.

**And it stops where it takes effort.** Encoding a pre- or post-condition that has to be
contorted into place says the representation is wrong, not that the types need more.
`ds-001` is the bound.

**The rules underneath:**

- **Zero, one or several → an array, not an optional.** An optional says "none or one";
  when the domain can produce two, it cannot say so, and the gap is paid downstream in
  non-null assertions and filter helpers. **The goal is not fewer representable states, it
  is no illegal ones** — a shape that cannot carry a real case is itself the defect, so
  narrowing an array back to an optional is the wrong direction. `law` — under `ds-001`.
- **One value, one canonical home.** Two sources for one value can drift; one cannot. This
  is what decides where a setting lives and which way it is copied — see the knob
  disposition below. Config is resolved once, at one point, re-exported, and **without a
  fallback on what must be set**: an omission must fail loudly, at boot, where the fix is
  obvious, not later as a silent wrong behaviour.
- **It reaches configuration points too.** A prop whose "off" position is never wanted
  manufactures a wrong state — it is not a design choice, it is what the component *is*.
  Remove it from the surface rather than defaulting it. `law`
- **The type carries the obligation, not the runtime.** `UIStepDeclaration` declares
  `run?: undefined` so TypeScript forbids the mix and the runner has nothing to check.
  `habit`
- **Immutable by default, at least from outside.** Private `#` fields, public surface via
  `get`. The getter is not the rule, it is what enforces it: the outside is *denied* a
  mutation, not asked to abstain. `law`
- **An implicit override standing in for a missing argument** → an explicit parameter the
  caller must fill. A smart default is fine where one branch is genuinely the common case;
  where the branches carry equal weight it is a guess made on the caller's behalf.
  `law`
- **A guard ends a case; a nullable type propagates it.** The opposite reflex is excluded:
  handling edge cases by making everything nullable, which spreads `if (null)` and `x?.y`
  across the codebase just in case. Impossible states are taken *out* of the system.

### Idiom — Domain-Driven Design

**The house's reading: le code est une prose** — `ds-025`

Prose gives the reader the right information at the point where it is used: enough that no
context has to be inferred, not so much that it repeats itself — **and in doubt, too much
never hurts.**

The parent of `ds-007` and of the comment law below: names, units, types and comments all
answer to it. A number carries its unit — `type Grams = number`, `netWeightInGrams`,
`GRAMS_PER_PALLET = KILOS_PER_PALLET * 1000` — so units cannot be mixed by someone who had
to guess. A type says where a value comes from — `id: IssueSchema['id']`, not
`id: number`: documentation by the code, at the level of the types.

**Its boundary with "do not state the same fact twice" is the house's:** redundant
**words** are fine, redundant **statements** — a second flag, check or wrap — are not.

**The rest of DDD — declared, without trace.** Taken whole by choice; no evidence backs
these yet, so they are the standard definitions, and the house is content to be steered
by them:
- **Bounded context** — a boundary inside which one model, and one vocabulary, holds. Its
  trace is `ds-018` below: two domains sharing one unit is the boundary missing.
- **Value object** — defined by its attributes, with no identity of its own, immutable.
  Its nearest trace: *two values that always travel together become an object* (below).
- **Aggregate** — objects changed together through one root that guards their invariants.
- **Domain event** — a fact of the domain, named in the past tense, that happened.

At the scale of modules, its neighbour is *architecture hexagonale* (`ds-026`, first
idiom).

**Departures — where the house's reading goes past the idiom:**

1. **Naming is a discovery instrument — ce qui est pareil se nomme pareil** (`ds-022`).
   Two mirror functions (a `build`/`parse` pair) carrying unrelated names hide the shared
   abstraction that naming them into symmetry would reveal: names too different stop
   patterns from surfacing. Force the symmetry, and test the round trip.
   **A translation table between two names for one thing is the symmetry refused.** Ask who
   owns the name on *your* side. If it is private — your own file names, your own internal
   keys — adopt the name that is imposed on you and delete the table. A table earns its
   place only when neither name is yours to change: two external formats, or a local name
   already published to other consumers. Data crossing a boundary is not enough; the
   imposed name crossing in is exactly the one to keep.
2. **The words come from theory too, not only from the domain experts — nommer la chose,
   c'est résoudre le problème** (`ds-024`). Symmetry *reveals* the pattern, naming it for
   real *deletes* the code it was hiding inside. **Reach for an established vocabulary
   before inventing a local one** — category theory (`CoDec`, `Semigroup`, `Monoid`, …), a
   recognised convention already circulating (`codec`, `standard-schema`); act as a senior
   would. This is `ds-012` one level up — reusing a **vocabulary** rather than an
   implementation, and the implementation follows almost for free once the name is right.
3. **The domain's vocabulary stops at the public surface** — private plumbing takes
   mechanical names. See the two regimes below.
4. **The domain speaks through the form, not only the words — la forme du domaine se donne
   à voir** (`ds-016`). When the data has a shape in the domain — a matrix, a
   neighbourhood, a grid, a board — the code can carry that shape. **Bounded, and the two
   halves differ.** In a **test**, as soon as the data has a shape, draw it: that is the
   default and its absence is worth a remark. In **production**, it stays a rare occasion —
   taken when it presents itself, never hunted for.

   ```ts
   const NEIGHBOUR_OFFSETS = [
   	[-1, -1], [+0, -1], [+1, -1],
   	[-1, +0], /*cell*/  [+1, +0],
   	[-1, +1], [+0, +1], [+1, +1],
   ] as const
   ```

   The `+0` and `+1` buy nothing but alignment; `/*cell*/` holds the hole in the middle. A
   formatter would destroy it, and it wants no marker saying so.
5. **Effort on a simple task signals the wrong model** (`ds-001`). Stacked guards, an
   abstraction that must be maintained, a check that keeps having to be made, a codec so a
   structure survives JSON: each is work spent compensating for a shape. Change the shape
   and the work has nothing left to do. When you catch yourself protecting a line, suspect
   the variable you are reading, not the line.

   **A test is where this shows first, because a test cannot lie about what it costs.**

**The rules underneath:**

- **A test earns its place, and the unit judged is the test, not the file.** A file is
  normally mixed — some cases carry a domain rule, others only witness that the wiring
  runs — so the verdict is taken case by case, and "the file is worth keeping" answers
  nothing. **What decides is what the case validates**, and it takes two questions, not
  one.
  **First, what breaks *in the domain* if the assertion fails.** If the honest answer is
  *the framework would have to be broken* or *the type would have to be wrong*, the case is
  holding up infrastructure — build or import the infrastructure, and delete it.
  **Then, and this is the one that gets skipped: where is the rule already declared?**
  Being a domain rule does not save a case. A rule already stated in an executable place —
  a schema, a type, a database constraint — and asserted again in a test makes a
  **tautological test** (`ds-032`): it holds up the *declaration*, not the rule. Delete the
  case, or move it next to the declaration if that is where it belongs.
  A case can be non-redundant, well written and still only exercise plumbing, so redundancy
  of *wording* is a symptom, never the criterion — what counts is redundancy of
  **statement**.
  **A test is code, and it is paid twice** — CI time, and maintenance — so it owes real
  added value. This is the fourth idiom applied to the suite.
  **A green suite is not evidence of good code.** A large suite standing over the wrong
  design is `ds-001`'s effort wearing a safety net's clothes: rework the form engine and
  most of those tests have nothing left to hold.
  **Then the setup is evidence about the code** — *the tell is in the test*, below under
  *Two domains in one unit*, which is where that reading lives. **It comes after the
  verdict, never instead of it**: taken first, it answers about the braid and leaves the
  test unjudged, which is how two measured runs lost this rule. `habit`
  *(under `ds-001`, `ds-018`, `ds-028`)*
- **A signature speaks the domain's vocabulary, and asks for nothing it does not use.**
  `habit`

  ```ts
  toIndex(board: Pick<Board, 'width'>, point: Point)   // not (board, x, y)
  hasCell(board: Dimensions, point: Point)
  createBoard({ width, height })                        // not (width, height)
  ```

  **A concept introduced is paid everywhere**: a type created in one corner becomes the
  module's vocabulary, and a signature still spelling out `x: number, y: number` says the
  concept does not exist. **Ask for the smallest slice** — `Pick<Board, 'width'>` is
  callable with `{ width: 3 }`, which is what makes it testable without a fixture; the
  house calls this *principe SOLID*. **And two values that always travel together become an
  object** — general, not local to one project. **Bounded by `ds-031`**: this is how the
  house writes it, and a reviewer does not ask a colleague to regroup fields that already
  read fine — the tendency below
  says the same thing from the other side.
- **Two regimes, and they do not mix.** Public state fields take **domain vocabulary,
  short** (`tape`, `memory`); a new field joins the family — `drafts`, not `draftMemory`.
  Private plumbing takes **mechanical names, long: the name says the type**, not just the
  role. `#pendingQueue` not `#pending`, `#inflightStepKey` not `#inflight`,
  `#quiescencePromise` not `#quiescence`. The stutter is preferred to the ambiguity.
  `law`
- **An ambiguous name is where a bug hides.** Where several kinds of the thing exist,
  resolve it in the name: `contract` → `mandateContract`. The rename is what made the bug
  visible. Renaming travels in the MR as a change of its own. `law`

### Two domains in one unit — `ds-018`

**The operational form of *bounded context*.** It was written as *la plomberie n'est pas la
règle métier*, and the ruling that framed it stays exact — **a "pure" piece of plumbing
carrying a domain rule is still to be flagged**, so `ds-004` does not cover it. It comes
down to separating concerns, the way a `memoize` or a `debounce` is separated from what it
wraps; the tools are higher-order functions and the strategy pattern.

**Two vocabularies in one body is the boundary missing.** Read the identifiers, not the
line count: a unit belongs to one model and speaks its words. When the name only describes
it with an *and*, there are two.

**What makes a second domain is a rule that belongs to it, not a tool borrowed from it.**
Calling a library, a scheduler, a store is consuming a mechanism — one domain, one
vocabulary. Carrying another domain's *condition of acceptance*, its shape or its
arbitration is hosting it. Without this bound every import reads as a second context,
which flags everything and decides nothing.

**The test that settles it — remove the domain.** Strip from the body everything that names
the domain. If what remains is a complete, useful unit, it was one: the domain was its
configuration. **The move follows from the test**: the mechanism becomes generic, and the
domain passes through it as data — a configuration, a schema, a strategy handed in. The two
most common instances: a write-to-temp, rename, roll-back-on-failure sequence inside
`archiveInvoices` is `atomicWrite(dir, fill)` with the invoices passed in; a lock map keyed
by customer inside `chargeCustomer` is `withKeyedLock(key, task)`.

**The tell is in the test.** When a test has to speak the mechanism's language — raw SQL
rows, HTTP frames — to reach a domain case, the two are fused. Split out the mechanism
(`deleteByPrefix(db, prefix)`) and it is testable alone; the domain function built on it
often needs no test of its own.

**The tier is asymmetric, and the direction decides.** A domain rule sitting inside a
technical unit is a direct refusal, so `law`; a mechanism leaking into a domain unit is
`habit`, said firmly. The module-mock rule is one of its descendants, not the source of its
bite.

### Idiom — KISS, keep it simple, stupid

**This is the only idiom that restrains. The other three ask for something; this one asks
whether the thing should exist at all.** Read it against them, not beside them.

**The house's reading: the best code is the one that does not exist** — `ds-028`. It had
descendants before it was named: the five single-caller abstractions deleted by hand,
the identity transformation, the function written for a caller that does not exist.

**Code that is easy to delete is maximally decoupled** — `ds-029`. **Deletability is the
measure of coupling**, and the question is *what breaks if I remove this?* Its means are
interface segregation, dependency inversion, ports and adapters, and no global
dependencies. This is where SOLID's **D** gets its reason, and why `ds-026` is reached
for: not to have layers, but so a piece can be pulled out.

**And do not do more than is necessary** — `ds-030`. The second clause carries the
argument: **extension will always be possible.** Not writing it is reversible; the
abstraction built for a need that never came is not — it has callers by the time anyone
notices.

**Departures — where the house's reading goes past the idiom:**

1. **Repetition is wanted while it is localised and a few lines** — not merely tolerated.
   Two sibling branches that both spell out their constructor, three neighbouring lines
   built on one formula: the shared shape is what the eye reads, edits land in one place,
   and nothing can drift. **The cost of removing it — an indirection, a ternary to
   unpick — is what this idiom refuses.** This bounds *name a move rather than inline it*,
   which keeps its bite on the formula **scattered** across a file; how localised is
   measured under that rule.
2. **The frontier runs at the module's surface, not at the line.** Simplicity is not
   measured on the inside. A named constant used four times inside a module *is* KISS — it
   serves the module's own author. The same value exposed as a prop nobody asked for is an
   extension, and it is paid forever: once it is settable, every setting must keep working.
   This is what bounds *parameterising is giving yourself knobs*, and it is the
   configuration-point rule reached from the other side.

**The rules underneath** — each stated where it bites, gathered here for their common
reason: the single-caller abstraction, the identity transformation, the narrow export
surface and its dead code, no constraint on the caller without cause, the configuration
point whose "off" is never wanted.

One rule has no other home:

- **A hunk that changes nothing is a cost with no benefit.** A block reshaped without
  altering its behaviour is churn: it enlarges the change, hides the part that matters and
  asks the reviewer to read it. Say so and ask for it to be left alone. **This judges the
  size of the change, not only the code in it** — the narrower form is already `law`:
  *renaming travels in the MR as a change of its own*. `habit` *(`ds-028`)*

**What it does not license.** This idiom bounds; it does not excuse. A wrong representation
is not simple, a fused infra/business unit is not simple, and "fewer lines" never settles a
case the other three idioms decide. Where it applies is the choice between two forms that
both work and both are correct — and there, it says: the one that adds nothing.

### Reuse an abstraction that already exists — `ds-012`

**The house will pay in contortion to avoid owning a component** — three Gutenberg blocks
built entirely on the platform's extension points.

**The discriminator is who pays for the abstraction**, and it resolves what looks like a
contradiction with the library rule below:

- **already in the system you depend on** — the platform, the framework's extension points,
  the design system: **reuse it, always.** It costs nothing new, and not using it is pure
  duplication.
- **a *new* dependency you would add**: **weigh who pays.** In an application, once. In a
  published library, every consumer, forever — see *Modules and boundaries*.

Never state either half without the other.

**And the cost is counted on what reaches the consumer.** Build tooling adds nothing to a
bundle and nothing to a downstream lockfile, so a `devDependency` falls outside the
question entirely.

### A name surfaces the intent; the mechanism recedes — `ds-003`

**This is the discriminator for every extract-or-inline call.** Not caller count, not size:
does the name carry an **intent** or merely an **indirection**? `fork(fn)` says *this is
deliberately not awaited*, which its three lines cannot — intent, it stays. `#dispatchRun`
named a step of one sequence in one caller — indirection, it went inline. The canonical
example is `debounce`: the utility is the mechanism, the debounced procedure is the intent.

**And it cuts both ways.** A repeated arithmetic formula — `y * width + x` written eleven
times — is itself the indirection, and `toIndex` removes it. Same test, opposite verdict:
the name carries an intent the raw expression cannot.

The harm compounds with impurity: a name over an impure fragment hides a mutation of shared
state, and inlining it exposes the duplicated paths it was hiding.

### A name explains better than a comment — `ds-007`

This is *how* the code becomes the prose. The explanation does not disappear, it moves into
an identifier. The house will name a predicate whose call already said it:

```ts
const entry = fs.statSync(entryPath)
const isDir = entry.isDirectory()
if (isDir) return Folder.load(entryPath) as T
```

**Bounded by cost to the reader.** Naming a local value is free — there is nothing to go
and look at, so over-naming is harmless. **Density is never a virtue.** Naming a
*mechanism* creates a function, and a function is a jump: past that threshold `ds-003`
takes over.

Not "name *or* comment": a regex stays unreadable however well the variable is named, so
`// ignore if file looks like (**)` sits above `const isIgnored = …`.

### No tautological test, no tautological comment — `ds-032`

**A tautology says again what the code already declares** — in a schema, a type, a
constant, a signature, the line itself, near or in another file. It adds no information,
and it is paid at every change of the fact it restates. **The tell is operational: change
the fact in one place and you are forced to change the other.** Two edits for one decision,
forever — they cannot even drift, they can only both be paid.

It governs what *speaks about* the code: a test case (*A test earns its place*, under the
fourth idiom), a comment that renarrates its line, a doc block or a single line of one that
restates the signature or a constant (*Comments and documentation*). Not an example that
shows what nothing declares, not a comment that says *why*, not a test of an arbitration
declared nowhere.

**In code itself, redundancy that documents is allowed** — and only with all three: it
documents, it short-circuits, it costs the reader nothing.

```ts
if (lines.length === 0) return []
return lines.map(toEntry)
```

The body would return the same thing; the guard says at the top that the empty case was
foreseen. Raising it is founded, demanding its removal is not (`ds-031`). A comment or a
test cannot short-circuit, so the exception never reaches them.

### There is an implicit contract with the reader — `ds-019`

The reader holds expectations they never had to write down; the code honours them. A React
component renders its `children` as given — not `React.Children.only` then reading the
child's props to drive its own render. A function does not mutate its arguments or reach
into a distant module. **The breach compounds when the name promises the opposite** — a
mutation behind a getter should light up warnings. Breaking the contract is allowed, but
then it is *justified AND documented* — one of the few comments that is owed rather than
tolerated, and still for the human you work for to approve, never yours.

**Tests are code with readers too.** A helper named for a read does not assert: a
`totalOf(cart)` that also runs `expect(discountApplied)` hides a check where nobody looks
for one. Keep the invariant, give it a name that says it checks — `expectRejected(…)`.

### Parameterising is giving yourself knobs — `ds-013`

**A parameter is an instrument for iterating, not a decoration.** The named value exists so
the next pass can turn it and see what happens. That is why this is not merely DRY: DRY
explains extracting a value that already repeats, it does not explain naming one *before*
it repeats — `ds-006` does.

```scss
--circle-size: 400px;
--circle-top: calc(var(--circle-size) / 4);   /* derived, never restated */

@media screen and (max-width: 960px) {
	--circle-size: 300px;                      /* one knob turned; the derivation follows */
}
```

A value two properties must agree on (`clip-path` and `shape-outside`) is named once —
`ds-005` in CSS.

**The trigger is pain** — humans feel the cost of changing one value in eight places. A
value consumed in several places, or re-questioned as a group, earns a name. Its outer edge
is the fourth idiom's frontier: the knob serves the module's author, not a consumer who
never asked for it.

**Where a knob lives is decided by the nature of the value, not by the medium of the
example:**

- purely a matter of layout → the stylesheet carries it
- a state the code reads too → the code carries it, and **pushes** it to the stylesheet, so
  there is one canonical representation and the two universes stay in sync in one direction

A `getComputedStyle` reading a setting back out of the CSS is the sign the flow has
inverted; a CSS fallback on a synced value would be a second source.

### Readability breaks the tie — `ds-002`

**Bounded, and the bound is the point.** It arbitrates only where more than one form is
correct: a one-line guard against the same guard braced, `#abort` against
`#abortAbortControllerByKey`, `(x) => ({ … })` against `x => { return { … } }`. It decides
nothing about a wrong representation, an `any` in a public surface, or a synchronous
throw — there only one form works, and there is no tie.

### "No premature optimisation" is a balance, not a ban — `ds-017`

**The bound is the cost to the reader.** If the optimisation weighs on neither the call site
nor the reading — a six-line generic helper, the caller unchanged — it goes in without a
measurement. The moment it costs the reader something, it needs a measured problem first.

The question is never *is this necessary?* but *does this cost anything to read?*

**A cache is an optimisation too, and it always costs the reader** — keys, lifetimes,
invalidation. So each cache needs its measured problem; in review, ask of a derived cache
whether what it saves is worth what it makes the reader track.

---

## The shape of the code on the page

Dispositions about how code sits visually, which no linter enforces and which a
formatter will happily undo.

- **Regrouper le code unitairement — `ds-008`.** What belongs to one thing is declared in
  one place, as one visible unit, even where the language would let it scatter. Its
  consequences in CSS — the `& { }` block, the media query inside its rule — are under
  *CSS and layout*.
- **Un code uniforme est plus prévisible — `ds-009`.** Uniformity is not tidiness, it is
  cheaper reading: a form held everywhere lets the reader stop parsing shape and start
  parsing meaning. **Narrow scope — it argues for holding a form already chosen, never for
  choosing one**; which form is right is `ds-002`'s call. The house's word for it is *cohérence*,
  and it is what makes the design-token rule a law.
- **Les blancs racontent une histoire et donnent du rythme — `ds-010`.** A blank line is
  punctuation, and two are not twice one — they mark different depths of break, as in
  prose. Two blank lines separate top-level sections, one separates steps of the same move.
  **This is a "do not fix" clause**: do not normalise runs of blank lines, and match the
  file's existing rhythm when you add to it. An even-toned wall of code is one of the tells
  that nothing was ever reread.

And two rules of layout that follow from them:

- **The main logic reads first, private helpers sit at the bottom.** Reading order beats
  definition order. `habit`
- **The moments of one gesture are declared together, and named as one family.** `law` —
  two demands in one sentence and both bind: co-location, and the series. An `endPainting`
  sitting among `onPaintStart` / `onPaintMove` breaks the family even once it has been
  moved. *(`ds-008`)*

---

## How strong is a rule

Two independent axes. Both are recorded because neither can be read off the code.

**Tier** — how the reviewer reacts. `law` the reviewer refuses in review · `habit` the
reviewer flags · `tendency` the reviewer never mentions. Only `law` and `habit` produce a
finding; a `tendency` informs composition and its absence is never a remark.

**Register** — why. `style` (default, unmarked) the code is unlike the house · `correctness`
the code is wrong. A correctness law holds even in a repo where the house style has no
authority.

Severity does not set the tier: a synchronous-throw bug is `habit` because the reviewer
flags rather than blocks, while two naming rules are `law`.

**And a finding costs whoever applies it** — `ds-031`. This is the churn rule raised one
level: a hunk that changes nothing is a cost with no benefit, and so is a finding.
**Where neither readability nor correctness moves, the reviewer does not ask a colleague to
change it** — the change would buy nothing and cost them a rewrite. So the threshold moves
with the audience, and that is what `tendency` really encodes: not *never mentioned*, but
**never mentioned to a colleague**. To an agent, which acts fast and pays almost nothing to
comply, the same remark is worth making.

**Assume a colleague unless something tells you otherwise.** What tells you: the human you
work for saying so, a zone known to be agent-written, `// ─── … ───` banners, a `Co-Authored-By` trailer —
which proves presence, never absence. **`law` and `correctness` are untouched**, whoever
applies them; this bounds `tendency`, and the half of `habit` whose only gain is form.

**A tier that needs this system to bend was misheard.** Every tier fits the three
definitions above; when one does not, go back and ask rather than build the exception.

**Bounded pragmatism.** The house will ship a law-breaking line when three conditions hold
together: time pressure, no clean alternative available, and code that will not move again.
That is a waiver, not a downgrade — and it never covers a violation that could have been
avoided.

---

## Consistency

- **Match the codebase you are in.** Where a choice is arbitrary in itself but uniform
  across a repo — `type` against `interface`, quotes, semicolons, indentation, import
  order — the repo decides, not your default and not the house's. `law` *(`ds-009`)*
- **Read the linter config before filing anything as style.** A formatter produces
  flawless, exceptionless uniformity that is indistinguishable from a deliberate rule. The
  house writes `type` in one repo because it is shorter and the linter autofixes, and
  `interface` in another.
- **Identify the generator before reading its output as evidence.** Scaffolded boilerplate
  is consistent, plausible and not the house's. Tolerated is not chosen.
- **And the medium of an example is not the rule it illustrates.** Before generalising, ask
  *what is this an example of*.
- **Never normalise an existing file toward your own default**, including punctuation,
  spacing and blank-line rhythm. See *Language and typography* and `ds-010`.

## Naming

Where the red lines are. More `law` entries sit here than anywhere else.

- **Any non-trivial expression is named before it is consumed.** `law` — one rule, two
  surfaces. A composed condition gets named before it is tested; a template literal
  interpolates *values*, never calculations. *(`ds-007`)*

  ```ts
  const survives = isAlive && rules.survival[neighbours]
  const isBorn = !isAlive && rules.birth[neighbours]
  if (!survives && !isBorn) return DEAD

  const isGenerationDue = time - lastAdvance >= intervalBetweenGenerations
  if (!isGenerationDue) return

  const lightness = lerp(0.92, 0.62, ratio)
  const chroma = lerp(0.2, 0.11, ratio)
  return `oklch(${lightness} ${chroma} ${hue})`
  ```

  This is what makes a bare `continue` or `return` legible without following the thread
  back.
- **`get` prefixes a retrieval, including a computed one** — `getTime`, `getStepDefinition`,
  `getOrHang`, `getContextValue`. A pure transformation takes no prefix — `hashEntry`,
  `replaceEqualDeep`, `toKebabCase`, `flattenTree`. `law`
- **A predicate is `is*` / `has*` and returns `value is X`.** `isDraft`, `isArchivable`,
  `isSettled`, `isReconciled`. **A function takes a verb; a boolean or a
  status takes `is` / `has`** — `isActive`, `hasReferral`, `isLoading` are legitimate names
  for values, not only for predicates, and naming a local boolean is free. **What the prefix
  may not carry is a value that is neither** — `hasRetries` over a count, `isOwner` over a
  user record: the name promises a yes-or-no the variable does not hold. Founded finding;
  the name is what changes. *(`ds-007`)*
- **A new helper joins the existing family** rather than inventing a nicer name of its own.
  `hashStep` sits beside `hash` / `hashEntry` / `hashParams` — a name that reads better on
  its own line and worse in the file is the wrong name. `law` *(`ds-009`)*
- **Un identifiant qui sera cherché reste littéral et entier — `ds-021`.** A call
  (`urls.purchase(...)`), a translation key (`confirmation.yes`): never built by
  concatenation or routed through a "smart" generic dispatch, even at the cost of some
  repetition — that defeats `grep` and full-text search, for a human and for an agent reading
  the codebase alike. An explicit `switch`/`case` ending in `assertNever` beats a dynamic
  `urls[transactionType]()`.

## Modules and boundaries

- **SOLID — `ds-020`.** Whole, by choice, with no outer scope written. Provenance is
  uneven: O and I carry traces; S, L and D are the standard definitions, declared without a
  trace yet.
  - **O** — open to extension, closed to modification. The house's instance: the lookup
    whose default is a thunk (see *Errors*).
  - **I** — the root of the three rules below and of the domain-signature rule: a surface
    promises no more than it uses, and a caller depends on no more than it needs. It is
    named by hand in review.
  - **S** one reason to change · **L** an implementation stands in for its contract ·
    **D** business code depends on abstractions it owns (see `ds-026`).

  For I: a value that must not be reachable is removed, not defaulted, and a caller gets the
  whole mechanism rather than its wiring step — the caller must not have to manage it.
- **A module stays isolated and exports as little as it can.** Group what belongs together
  behind one name rather than scattering its parts across the export list. **And it covers
  dead code, not only exports**: a function written for a caller that does not exist is
  deleted, an unconsumed export is withdrawn. `habit`
- **A folder per feature, small files assumed.** `habit` — **the criterion is the number of
  concepts under one roof, not the line count.** A short module holding four subjects is
  still to be split.

  ```
  /<feature>/<feature>.ts
  /<feature>/types.ts          ← a shared type; a private type stays in its file
  /<feature>/some-helper.ts
  /<feature>/some-sub-feature/some-sub-feature.ts
  ```

  Cut the folders along the pure/impure seam where there is one, so the frontier reads off
  the tree.
- **Export the question, not the machinery needed to ask it.** `isTemplate(value): value is
  Template` exists so a caller never has to import the symbol or the class the check runs
  on: a limited API surface that does not ask the user to know the implementation.
- **In a published library, every cost is paid by every consumer, forever** — a dependency
  in their lockfile, a domain in their vocabulary. The "new dependency" row of `ds-012`'s
  discriminator: rewriting a small utility can beat importing one, and a use case gets
  **pruned out of the API surface** into an example. Do not make them pay for Docker and
  friends; it is BYOC, non-opinionated. `habit` — **never state this rule without its
  condition.**
- **A barrel names what it re-exports** rather than sweeping a module up: one name out of a
  329-line file where one name is what belongs outside.

## Types

- **No `any` in the public surface.** Behind a boundary already typed upstream it is fine;
  visible from the API it is not. `law` — the reviewer would not merge it as is.
- **`any` or `as` used to unblock a type** → find the right type. `law`
- **`readonly` by default on anything crossing a public boundary.** `habit`
- **An empty string is not an absence.** `signature: ''` for "the document has not been
  signed yet" → `undefined`, or a distinct state: a token exists or it does not, `''` is
  ambiguous. `law` — descends from `ds-001`.
- *`type` against `interface` is not a house rule — see Consistency.*

## Functions

- **Named `function` at top level.** Arrow only when it captures `this`, or fits on one
  line. `law`
- **A curried reducer names its inner function.** Costs one word, buys a readable stack
  trace — `resolve` instead of `<anonymous>`. `law`
- **Work that does not depend on the argument happens before the `return`**, once, not on
  every application. `law`
- **Extract when the name carries an intent; inline when it only adds indirection.** `law` —
  `ds-003` is the test.
- **Name a move rather than inline it.** `run`, `once`, `lazyGetter`, `mapValues`,
  `assertNever`: three lines each, under `utils/`. An anonymous IIFE becomes
  `run(function wrapStepsWithLock() { … })` — the block gets a name and the name says what
  it does. **A repeated arithmetic formula counts as one**, and helpers stack: name the
  traversal first, build the rest on top of it, and the indexed loops disappear.
  **Colocation bounds it, not the count** — and **colocation is distance, measured by
  whether you see the instances at once.** A shared parent is what usually follows from
  that, never what establishes it: a parent that spans a screen holds its instances far
  apart, and they are scattered however common their enclosing function is. Ask *can I read
  them in one look?*, not *are they in the same block?* Syntax does not decide it either
  way — two statements taken in at once are colocated whether they sit side by side or in
  the arms of a branch. Instances that pass that test are wanted, not merely tolerated: see
  the fourth idiom, which is this rule's bound. What wants a name is the formula
  **scattered** across a file, or dense enough to be decoded at every reading.
  `law` *(`ds-028`)*
- **Do not impose a constraint on the caller without cause.** No `async` for synchronous
  code, no `use` prefix on a pure function. A signature is a contract; do not write one that
  promises less than you could. When a business rule genuinely needs a hook, write it pure
  and wrap it: `const useBusinessRule = () => useMemo(() => computeBusinessRule(args), [args])`.
  `law`
- **Callbacks returning an object, array or JSX take a block body** with an explicit
  `return`. A block takes an added line without a rewrite when the callback grows, and a
  parenthesised object return does not read. Yes: `x => x.value`, `x => x * 2`,
  `x => { return { … } }`. No: `(x) => ({ … })`. `habit`
- **Past ~3 positional parameters, or any optional one mixed into the list → a single
  named-object parameter.** `habit` — naming each value at the call site is what a
  positional list can no longer do cheaply past that count.

## Purity and state

- **Fields live next to the methods that use them**, in a `// #region`, not in a block at
  the top of the class. A region reads as a small module: its state, then its operations.
  `law` — `ds-008` in a class.
- **A function does not mutate the argument it was handed.** Return a new value and take the
  parameter `readonly`: `issues.toSorted(…)`, not `issues.sort(…)`. **Unless the name
  carries the mutation** — `mutateAndSortByDate` is deliberately longer, so it gets thought
  about twice and the caller is warned. `law`

## Guards

- **A guard that fits on one line: no braces, exits immediately. From two lines on,
  braces.** `law`

  ```ts
  if (targetStep === -1) return state
  if (!step?.run) return step
  if (newState === this.#state) return
  ```

- **A guard is a disposal, not a defence.** One always thinks of the happy path first;
  reality differs. A guard names an edge case at the top and removes it from everything
  below, so the body reads as the one path that matters. That is why it exits immediately
  rather than nesting — nesting keeps the case alive.
- **A guard is not an `if/else`.** The guard removes an edge case; an `if/else` puts two
  choices of equal weight side by side — tolerated for equal-weight choices, and only when
  both bodies are one-liners. Do not turn such an `if/else` into a guard.
- **The best guard disappears.** Before you write one, check you are reading the right
  variable: protecting a line is often `ds-001`'s effort, and the variable is the shape.
- **And its condition is named when it is composed** — see *Naming*. A guard the reader
  cannot decode has removed nothing.

## Errors

- **A lookup's default is a thunk, and by default it panics.**
  `resolve(name, getDefaultValue = () => isMissing(name))`: `resolve('APP_ENV', () =>
  'production')` is optional, `resolve('API_URL')` is required. The reason against
  `defaultValue?: T`: if `T` can be `undefined`, "no default given" and "value not resolved"
  become indistinguishable. *(`ds-005`, SOLID's O)*
- **A value whose absence would mean the model is broken → throw**, with `should not happen`
  in the message. A genuine absence takes `??`. And the throw is not only a runtime guard —
  **it narrows a type**, so what follows is provably safe. `law` on the panic
- **`should not happen` is a classification, not a tone.** It asserts *if you are reading
  this, the model is broken*, and is reserved for what cannot occur short of corrupted data.
  A malformed user input, a missing form field, an identifier that no longer matches —
  those **can** happen and take a message describing what is missing: `field "cellSize" does
  not exist`, not `should not happen : …`. Used everywhere, the marker distinguishes
  nothing.
- **An unreachable branch → `assertNever(message, value)`** as the closing statement of an
  exhaustive chain. `habit`
- **A `try`/`catch` that swallows and returns a default → let it propagate.** `law`
- **When a rule must be broken, break it once, in a named place.** `tryParseJson` names the
  intent, gives the exception a single home where the *why* is written down, and stops the
  pattern being copied by the next reader. The same shape licenses genuinely dangerous
  techniques: throwing for control flow lives behind one named object — black magic,
  dangerous, but boxed and controlled in a single module.
- **Every failure has an audience — two, and they differ.** The user gets a visible error
  path; a toast is the floor, not the solution. Refused: the silent `catch`, the empty
  `.catch`, the error that only reaches the console. If it is an *exception* — an unexpected
  error, a bug — it is also routed to Sentry or equivalent.
- **A promise deliberately not awaited is `void`ed explicitly.** `habit` — enforced by
  `no-floating-promises`.
- **Wrapping a call that may throw synchronously goes in `try`/`catch` inside an `async`
  function**, never `Promise.resolve(fn()).catch()`: a synchronous throw escapes before
  `Promise.resolve` is reached. `law`, **register: correctness**

## Concurrency

- **A delay is not a synchronisation.** A wait on a timer standing in for a wait on an event
  → find what the code is actually waiting for, and wait on that: the missing `await`, the
  missing serialisation, the missing event. Never a better number. It is the sign the origin
  of the problem was never found — possibly that the architecture is wrong — and it costs
  perceived performance. The timer is `ds-001`'s effort spent compensating for a shape.
  `law`, **register: correctness**

  ```diff
  -  if (change.kind !== 'insert') await sleep(3000)
     await pushToSearchIndex(change)
  -  refreshResults(query)
  +  await refreshResults(query)
  ```

## Abstraction

- **An abstraction with a single caller, existing only to hide an access, has not earned its
  name.** Delete it; a standard structure does the job. Five went that way in one repo.
  See `ds-001`, and `ds-003` for what separates this from naming a move.
- **One level of abstraction per function body.** A body stacks bricks; zooming into one is
  a function call, not a passage of the body. **The tell: comments cutting the body into
  sections.** Not every line is a bare call — calling a binary search and checking its
  result stays at one level, writing the search there does not. **What decides an extraction
  is the name, and impurity raises the stakes**: a pure step extracts cleanly, while an
  impure step hidden behind a name buries a mutation of shared state, which is the worst
  case. *(`ds-003`)*
- **An identity transformation → delete it.** `habit`
- **Do not state the same fact twice.** A `{ status: 'ok' }` returned beside a 204, an error
  re-wrapped when it already carried its meaning, a test that re-checks what the type system
  or the framework already guarantees — it is `if (true) return true else return false`.
  Delete the second statement; the wrap belongs to the API client, not the Action. `law` —
  descends from `ds-001`, a duplicate being a second representation free to drift, and it is
  nearly a redundant comment. **Statements only, never names** — see `ds-025`.
  **It reaches test fixtures**: a seed helper that writes files by hand beside the writer
  under test is a second write path for one fact — seed with the real writer.
- **A custom hook wrapping a library without adding anything → call the library directly.**
  `law`
- **Behaviour the design system already carries → call what exists**, rather than
  hand-placing it. `habit` — `ds-012` in a design system.

## Tests

- **Draw the data when it has a shape** — the test half of `ds-016`. What it buys is the
  **failure output** — two grids one above the other rather than two lists of coordinates.

  ```ts
  expect(toAscii(advance(blinker, 1))).toBe(ascii`
  	.....
  	..#..
  	..#..
  	..#..
  	.....
  `)
  ```

*What a test owes, and the module-mock rule, are under the idioms. What ships beside a suite
you wrote is in `compose.md`.*

## CSS and layout

These are the CSS moves the house holds most consistently.

- **A layout is designed for every viewport, or it is not designed.** `law` — **the rule is
  the omission, not any particular component.** A `Flex justifyContent="space-between"` with
  neither wrap nor collapse is one symptom of it, in one design system's vocabulary.
- **Jamais de valeur en dur quand le système en porte le token.** `law` — consistency is a
  law here. Colours, spacing, radii, widths: `var(--wp--preset--spacing--xx-small)`,
  `var(--wp--style--global--wide-size)`. **And a value derived from a token stays derived** —
  the negative counterpart of a spacing is computed, never retyped:
  `margin-block: calc(-1 * var(--wp--preset--spacing--xx-small))`. A literal there is correct
  the day it is written and wrong the day the token moves. *(`ds-009`, `ds-012`)*
- **Where no system publishes the tokens, build the scale in two storeys.** Below, a
  **numeric multiplicative** scale on one unit — spacing and size are the same magnitude, one
  scale serves both, and the name states the factor. Above, **semantic** tokens that draw
  from it. T-shirt sizes are refused because they order nothing.

  ```css
  --u: 0.25rem;
  --s-1: calc(var(--u) / 2);
  --s1: var(--u);
  --s2: calc(var(--u) * 2);
  --s3: calc(var(--u) * 3);

  --radius-s: var(--s1);   /* a radius is chosen for what it is, */
  --radius-m: var(--s2);   /* not computed — but its value comes off the scale */
  ```

  A repeated `calc(var(--space) / 3)` is a missing token; a `calc` that computes something
  the scale does not contain is legitimate derivation.
- **The base properties of a nested rule live in a `& { }` block of their own**, so they read
  as one unit beside the nested selectors rather than floating above them. `habit` — a
  reviewer would not forbid a colleague from doing otherwise. Only when the rule has nested
  children at all; with nothing to be uniform with, the house writes flat.
  *(`ds-008`, `ds-009`)*

  ```scss
  .wp-block-group.is-style-section-accent {
  	& {
  		background-color: var(--wp--preset--color--secondary);
  		position: relative;
  	}

  	&::after { … }
  }
  ```

- **The media query lives inside the rule it modifies**, never in a breakpoint-keyed section
  at the foot of the file. This is what keeps the knobs of `ds-013` adjacent to their
  responsive re-settings. *(`ds-008`)*
- **A threshold comes from where it actually breaks — unless a system already owns it.** The
  CSS instance of a broader disposition: one is free to write one's own conventions when they are
  justified and survive the other dispositions, so consistency and reuse are checked first
  and what survives may be one's own. Break where it is relevant, not where an abstract rule
  decided for you — synchronised breakpoints are legitimate elsewhere. Ask whether something
  owns the value: it does → take theirs; nothing does → measure where this layout breaks. The
  deliberate exception to the token law above, and the two are one idea.
- *Not a rule: guarding a recent CSS property with `@supports` was a one-off bugfix, not a
  policy. Do not report its absence.*

## React and data fetching

- **`fetch` inside a `useEffect` → `useQuery`.** `law` — forbidden by convention. Teach the
  why, link the docs.
- **An action that must not run twice → make the second attempt impossible**, not merely
  harmless. Disable the button while the request is in flight. The fix is not a guard inside
  the handler that ignores the second call; it is a control the user cannot press twice.
  *(`ds-005`)*
- **One state transition, one updater.** The decision about the state and its update live in
  the same `setState((prev) => …)`, instead of reading a closure's `state` outside and
  writing inside: a closure can go stale, and the point is to work on the state atomically.
  **Bounded: *ça n'a pas toujours autant d'importance*** — do not rewrite every
  `setState` of a file on this model. *(`ds-005`, `ds-008`, `ds-018`)*
- **A function must not handle its caller's context.** Lift the effect to the caller: a
  `sendSecret` has no business worrying about the scanner. `habit`

## Comments and documentation

- **Le code est la prose. Le commentaire est l'exception.** `law` — the consequence of
  `ds-025` for comments. The default is not "comment what is unclear" — the code carries the
  meaning, and a comment is an admission it could not. Six kinds survive a cleanup pass, and
  they are all things code *cannot* say.
  1. A **negative constraint**.
  2. A **lie in the types** — a throw narrowing a type wider than runtime, which without the
     comment reads as dead paranoia.
  3. A **question not yet answered**, left in the interrogative as a marker for the next
     pass — `// maybe implement stream interface too for better perf ?`.
  4. A **computation whose why is not deducible** — a `- 1`, a bounding `Math.min`. A brief
     explanatory comment is welcome; splitting the code into lines that read as prose is
     better still, and both are accepted.
  5. An **implicit coupling between two calls** — the reader must not have to descend into a
     callee to understand a branch.
  6. **Where this code should live**, when it sits in the wrong place —
     `// This file should move to @acme/server-libs`. A debt the code cannot state about
     itself. *Not a licence for `// TODO`*: like any debt comment, an agent proposes it and
     waits for a yes.
- **What does not survive: anything that renarrates the mechanism.** If the comment restates
  the line under it, the line was already the comment — a tautological comment (`ds-032`).
  Reach for a name first — `ds-007`.
- **Référencer le contenu extérieur — `ds-011`.** When code exists because of something
  outside the file, the link to that something is part of the code: an **explanation**, a
  **bug report**, an **inspiration** — one's own scratch work included. This never competes
  with the rule above: a reference renarrates nothing, it carries *why this shape and not
  another*. **And only while its target will still be there** — do not cite a legacy form
  that is about to be deleted.
- **A design arbitration is worth a comment, in the first person.** *// Most non JS
  developers are more familiar with object oriented patterns, so I favor it in place of
  factory functions.* Why this shape rather than the obvious one is the thing no reader can
  recover.
- **The one place the rule inverts: teaching code.** An example is read by someone learning
  the rules of the game, so numbering the steps and explaining the language is the payload,
  not noise. **The discriminator is who the file is for**, and it can scale to a whole repo
  read by non-developers. Never carry that register into `src/`, and never carry the sober
  one into an example.
- **`important:` marks a constraint a well-meant refactor would silently break** —
  `const index = cursorIndex // important: do not increment, we are seeding the cache.`
  `habit`, **and it has a ceiling**: this is the marker an AI pass inflates fastest, and
  already did once in a house repo. Only for what the code cannot show.
- **Never add documentation on your own initiative.** JSDoc on a function whose signature
  already says it → nothing; a well-named function conveys its own context. On a public API
  surface it can be welcome — usage examples, explanations, use cases, never a restatement of
  the arguments — **but always at the request of the human you work for.** **In review, the content decides, not the
  provenance a diff cannot show**: flag the block that restates the signature; one giving
  examples, explanations or use cases on an exported surface is conforming, however new the
  file looks. **Conforming as a format, not line by line**: an example line that spells out
  a constant declared in the code is still a tautology (`ds-032`). `law`
- **A debt comment is the human's call, not yours.** A `// code smell, do not reproduce`, a
  `// TODO`, a `// FIXME`, a `// HACK` freezes a judgement and commits the next reader to a
  rereading. The human you work for alone decides when one is added; do not add one to save
  time without their explicit agreement. Surface the debt in your reply, propose the
  wording, wait for the yes. *(`ds-015` sharpening)*
- **`// ─── … ───` banners are agent residue.** Do not add them.

## Language and typography

- **The comment language follows the repo** — English in one repo, French (comments *and*
  JSDoc) in another. A consistency rule. Design docs stay French regardless. `habit`
  *(`ds-009`)*
- **The other exception is an audience that does not read English**: domain identifiers in
  French, mechanism in English (`.texte-autour-du-logo` beside `addPinnedClass`).
  **It is the audience that moves, not the rule** — do not generalise it, and do not "fix" it
  where it holds.
- **French spacing before `:` `;` `?` inside English prose stays.** `// important : check if
  refCount is still 0`, `'Logic error : cannot resolve an idle step'`. English words, French
  typography — consistent across two repos, and **an agent normalising punctuation will strip
  it as a typo. Do not "fix" it.** `habit`
- **A non-breaking space in a UI string is a render instruction, not whitespace.** In a locale
  JSON the ` ` sets where the text may wrap and keeps an orphan word off its own line; it
  matters for the layout. Reformatting the file must not collapse it: the same "do not fix"
  shape as the French-spacing rule, with layout as the payload rather than typography.
  `habit`

## Borrowed code

- **Code lifted from elsewhere carries its URL, licence and copyright line at the top of the
  file.** `law` — it is politeness. The `law`-tier special case of `ds-011`, where the
  borrowing is literal and the credit is an obligation.

## Tendencies — what the house writes and does not ask for

Real and observed, explicitly not rules. **Their absence is never a finding against a
colleague** — that is `ds-031`, and it is the whole point of listing them here: they tell
you what *not* to say. Against code you know an agent wrote, the bar drops and they may be
raised as remarks. They also inform what you compose (`compose.md`).

- `create*` for a factory, `*Action` for a reducer factory.
- The duration ladder: the unit lowercase and singular, SCREAMING_CASE for the constant
  built from it.
- One barrel per package entry point, none nested below.
- `useQueries` over a `Promise.all` in a custom query.
- `define*` for a user-facing DSL, `from*` for a static factory, `with*` for a copy or a
  scope.
- Three shapes of "make one": a **PascalCase function** for a service or client, its type
  derived from it (`Env()` / `type IEnv = ReturnType<typeof Env>`); `create*` for something
  built and wired (`createServer`); `new*` for a record stamped with an id and a timestamp
  (`newAuditEntry`).
- Fields sharing a prefix become an object: `customer: { id, name }` rather than
  `customerId, customerName`.
- A lookup table is named key → value: `priceByRegion`, `statusToLabel`.

---

## Prose: who carries what

`house-style` owns prose **inside** the code — comments, identifiers, error strings, test
names. Prose **about** the code — commit messages, MR bodies, review comments, chat — is out
of its scope.

## Review — the main mode

*"Pass this diff against the house style."*

→ *Done when* every hunk has been read against the dispositions first and the rules second,
and every finding is either fixed or argued as a justified exception. Report `law` and
`habit` findings; a `tendency` is not reported against a colleague, which is the default —
see `ds-031`. A finding may rest on a disposition alone: rate
it `law` or `habit` by its weight, and say what it rests on — except `ds-015`, in
`compose.md`, which never produces a review finding. If a finding names a component or a
specific API, check it is not one level too low before reporting it. Before reporting any
uniformity a formatter could produce, check the repo's linter config — and before reading
consistency as intent, check whether a generator produced the file.

Three checks on the review itself, before handing it over:

- **A good point is judged at the unit, not at the execution.** Before praising a technique,
  ask whether the unit it lives in should exist in this form. Praise anchors: once the craft
  is saluted, nobody asks the question any more — an elegant retry-with-backoff inside the
  function that decides which invoices are overdue is a finding, not a good point. **So look
  for good points last**, once every finding is written, **and place them first** in the
  review.
- **Look for the common cause.** Group the local findings and ask whether they are symptoms
  of one missing representation (`ds-001`). When they are, lead with the missing object; the
  local findings become its evidence. Never propose to reinforce the shape that produced the
  effort — hardening the workaround instead of removing what made it necessary.
- **A visible performance cost is worth a line, never a demand.** An order of magnitude
  readable without measuring (the full country list downloaded on every keystroke of an
  address field) gets mentioned; requiring the optimisation does not follow (`ds-017`).

**Composing is the other mode, and it has its own file** — `compose.md`.
