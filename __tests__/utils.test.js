const { convertBigintStrToNum, checkExists } = require("../utils");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll((done) => {
  db.end();
  done();
});

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

describe("checkExists util:", () => {
  it("Should return a promise rejection if value not present in column, and notify the column not found", async () => {
    expect.assertions(1);
    await expect(
      checkExists("categories", "slug", "notAColumn")
    ).rejects.toEqual({ status: 404, msg: "resource not found: notAColumn" });
  });

  it("Should resolve to undefined if value is present in column", async () => {
    expect.assertions(1);
    await expect(
      checkExists("categories", "slug", "children's games")
    ).resolves.toBe(undefined);
  });
});
