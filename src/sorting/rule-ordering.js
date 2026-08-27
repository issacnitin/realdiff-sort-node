'use strict';

function byPriority(rules) {
  const ordered = [...rules];
  quickSort(ordered, 0, ordered.length - 1);
  return ordered;
}

function quickSort(items, left, right) {
  let lower = left;
  let upper = right;
  const pivot = items[(left + right) >> 1].priority;
  while (lower <= upper) {
    while (items[lower].priority < pivot) lower++;
    while (items[upper].priority > pivot) upper--;
    if (lower <= upper) {
      [items[lower], items[upper]] = [items[upper], items[lower]];
      lower++;
      upper--;
    }
  }
  if (left < upper) quickSort(items, left, upper);
  if (lower < right) quickSort(items, lower, right);
}

module.exports = { byPriority };