# RealDiff Node sort-stability demo

RealDiff runs the same tests on both sides of this pull request and reports the runtime values that changed.

## How it works

1. Check out the base and pull-request revisions.
2. Prepare both with the RealDiff Node loader and require hook.
3. Run the same npm tests on both, recording observed function arguments and return values.
4. Diff those execution traces instead of inferring behavior from the source diff.

This is not mutation testing, static analysis, or coverage. No production code or test is mutated, RealDiff does not generate tests, and it observes only code this test suite executes.

## Worked example

The pull request replaces a stable merge sort, which creates arrays while recursing, with a quicksort over one copied array. In this block, `-` is the stable base path, `+` is the proposal, and the important added call is `quickSort(...)`:

```diff
-return merge(byPriority(rules.slice(0, middle)),
-             byPriority(rules.slice(middle)));
+const ordered = [...rules];
+quickSort(ordered, 0, ordered.length - 1);
+return ordered;
```

Both algorithms sort by priority, so the edit looks like a local allocation/performance refactor. The merge sort preserves declaration order for ties, keeping `Z_CLEARANCE` first. The quicksort swaps equal-priority entries and puts `A_SEASONAL` first in this deterministic fixture.

The following block labels the exact values RealDiff observed before and after the edit:

```text
BASE  DiscountEngine.selectDiscount(100) -> Z_CLEARANCE
PR    DiscountEngine.selectDiscount(100) -> A_SEASONAL
BASE  CheckoutTotals.compute(100) -> 60
PR    CheckoutTotals.compute(100) -> 85
```

Neither pricing method is in the diff; only `src/sorting/rule-ordering.js` changed. All three tests execute the path. The two broad assertions still pass because 85 is discounted and does not exceed 100. Only `clearanceWinsCurrentTies`, which checks the exact selected code, reacts.

## Why the finding is focused

RealDiff runs the base more than once and subtracts observations that disagree with themselves, removing timestamps, GUIDs, hash-order variation, and similar self-noise.

The changed rule passes through a long decision pipeline. RealDiff collapses the affected callers and reports the first changed behavior in unedited `src/pricing/discount-engine.js`.

## Run it

The command below runs the demo's three tests:

```bash
npm test
```
