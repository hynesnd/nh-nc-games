const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("api testing:", () => {
  it("Status 404: responds with message path not found", () => {
    return request(app)
      .get("/not-a-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });

  describe("/api/categories path:", () => {
    describe("GET: method:", () => {
      it("Status 200: responds with array of all category objects", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.categories)).toBe(true);
            body.categories.forEach((cat) => {
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              });
            });
          });
      });
    });
  });

  describe("/api/reviews path:", () => {
    describe("GET method:", () => {
      it("Status 200: responds with a correct review object", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
      });

      it("Status 404: responds with not found when requested id does not exist", () => {
        return request(app)
          .get("/api/reviews/999999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("no items found");
          });
      });

      it("Status 400: responds with invalid id when passed review_id not a number", () => {
        return request(app)
          .get("/api/reviews/invalid_id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid input");
          });
      });
    });
  });
});
