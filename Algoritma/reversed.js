function reverseString(str) {
  const letters = str.replace(/\d/g, "");
  const digits = str.replace(/\D/g, "");

  return [...letters].reverse().join("") + digits;
}

console.log(reverseString("NEGIE1"));
