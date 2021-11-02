const { convertBigintStrToNum } = require("../utils");

describe("convertBigintStrToNum util:", () => {
  it("returns null if given empty string", () => {
    expect(convertBigintStrToNum("")).toBe(null);
  });

  it("Should return a correct number when given a string formatted number", () => {
    const input = "99";
    const expected = 99;
    const actual = convertBigintStrToNum(input);
    expect(actual).toBe(expected);
  });

  it("does not mutate input", () => {
    const input = "99";
    convertBigintStrToNum("99");
    expect(input).toBe("99");
  });

  it("output has different reference to input", () => {
    const input = "99";
    const actual = convertBigintStrToNum(input);
    expect(actual).not.toBe(input);
  });
});
