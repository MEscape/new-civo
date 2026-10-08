export type GridColumns = 1 | 2 | 3 | 4;

const COLUMN_STEPS: readonly GridColumns[] = [1, 2, 3, 4];

/** The widest column count up to `max` that the number of items can fill. */
export function columnsForCount(
  count: number,
  max: GridColumns = 4
): GridColumns {
  const wanted = Math.min(Math.max(count, 1), max);
  let columns: GridColumns = 1;
  for (const step of COLUMN_STEPS) {
    if (step <= wanted) {
      columns = step;
    }
  }
  return columns;
}
