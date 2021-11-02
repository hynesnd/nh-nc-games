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
                comment_count: expect.any(Number),
              })
            );
          });
      });

      it("Status 200: comment_ count aggregate function returns correct number  of comments", () => {
        return request(app)
          .get("/api/reviews/3")
          .expect(200)
          .then(({ body }) => {
            expect(body.review.comment_count).toBe(3);
          });
      });

      it("Status 404: responds with not found when requested id does not exist", () => {
        return request(app)
          .get("/api/reviews/999999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("id not found");
          });
      });

      it("Status 400: responds with invalid query when passed review_id not a number", () => {
        return request(app)
          .get("/api/reviews/invalid_id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });
    });

    describe("PATCH method:", () => {
      it("Status 200: responds with updated review object", () => {
        const newVote = 1;
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: newVote })
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
              })
            );
          });
      });

      it("Status 200: inc_votes increases vote count by correct amount", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: newVote })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(10);
          });
      });

      it("Status 200: inc_votes decreases vote count by correct amount", () => {
        const newVote = -6;
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: newVote })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(-1);
          });
      });

      it("Status 404: returns not found when attempting to patch non-existent review_id", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/reviews/9999")
          .send({ inc_votes: newVote })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("id not found");
          });
      });
    });
  });
});
