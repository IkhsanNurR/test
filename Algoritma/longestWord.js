const sentence = "Saya sangat senang mengerjakan soal algoritma";

function longest(sentence) {
  return sentence
    .split(" ")
    .reduce((result, word) => (word.length > result.length ? word : result));
}

const result = longest(sentence);
console.log(`${result}: ${result.length} character`);
