const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];

function countDiagonal(matrix) {
  return (
    matrix.reduce((acc, row, i) => acc + row[i], 0) -
    matrix.reduce((acc, row, i) => acc + row[matrix.length - 1 - i], 0)
  );
}

console.log(countDiagonal(matrix));
