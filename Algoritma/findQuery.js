function findQuery(input, query) {
  //count how many times it appears in the input array.
  const output = query.map((q) => input.filter((i) => i === q).length);
  const result = output
    .map(
      (count, index) =>
        `${index === query.length - 1 ? "dan " : ""}kata '${query[index]}' ${
          count ? `terdapat ${count}` : "tidak ada"
        } pada INPUT${index === query.length - 1 ? "" : ", "}`
    )
    .join("");

  console.log(output, `karena ${result}`);
}

const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERY = ["bbb", "ac", "dz"];

findQuery(INPUT, QUERY);
