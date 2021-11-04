const { checkExists } = require("../utils");
const db = require("../db/connection");

afterAll((done) => {
  db.end();
  done();
});

describe("checkExists util:", () => {
  it("Should return a promise rejection if value not present in column, and notify the value not found", async () => {
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
