'use strict';

function byPriority(rules) {
  if (rules.length < 2) return [...rules];
  const middle = Math.floor(rules.length / 2);
  return merge(byPriority(rules.slice(0, middle)), byPriority(rules.slice(middle)));
}

function merge(left, right) {
  const ordered = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].priority <= right[rightIndex].priority) {
      ordered.push(left[leftIndex++]);
    } else {
      ordered.push(right[rightIndex++]);
    }
  }
  return ordered.concat(left.slice(leftIndex), right.slice(rightIndex));
}

module.exports = { byPriority };