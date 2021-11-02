//psql bigInt datatype is coerced to string on output.
//for consistency of testing I decided to write this util to drop into models
//and coerce the strings to Number as I am confident that numbers in this app will not exceed 53 bits..
exports.convertBigintStrToNum = (str) => {
  if (!str || str.length === 0) return null;

  return Number(str);
};
