const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");
const { checkExists } = require("../utils");
const endpointData = require("../endpoints.json");

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
            expect(body.categories).toHaveLength(4);
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

  describe("/api/reviews/:review_id path:", () => {
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
            expect(body.msg).toBe("resource not found: 999999");
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
            expect(body.msg).toBe("resource not found: 9999");
          });
      });

      it("Status 400: responds with invalid query when review_id not a number", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/reviews/INVALID")
          .send({ inc_votes: newVote })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });

      it("Status 400: responds with invalid query body if not passed proper inc_votes", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/reviews/2")
          .send({ NOT_THE_COLUMN: newVote })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query body");
          });
      });

      it("Status 400: responds with invalid query if inc_votes wrong datatype", () => {
        const newVote = "invalid";
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: newVote })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });

      it("Status 400: responds with invalid query if req body has too many columns", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/reviews/2")
          .send({ inc_votes: newVote, extra_column: "I'm wrong" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query body");
          });
      });
    });
  });

  describe("/api/reviews path:", () => {
    describe("GET method:", () => {
      it("Status 200: responds with an array of review objects", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toHaveLength(13);
            body.reviews.forEach((rev) => {
              expect(rev).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  category: expect.any(String),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });

      it("Status 200: response sorted by date desc by default", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });

      it("Status 200: will sort response by column passed in sort_by query", () => {
        return request(app)
          .get("/api/reviews?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });

      it("Status 200: will sort response ascending or descending from order query", () => {
        return request(app)
          .get("/api/reviews?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("votes");
          });
      });

      it("Status 200: will respond with array filtered by category query", () => {
        return request(app)
          .get("/api/reviews?category=social deduction")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toHaveLength(11);
          });
      });

      it("Status 400: responds with invalid sort_by query if sorting by column that doesn't exist.", () => {
        return request(app)
          .get("/api/reviews?sort_by=notAColumn")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid sort_by query");
          });
      });

      it("Status 400: responds with invalid sort_by query if sorting by column that doesn't exist.", () => {
        return request(app)
          .get("/api/reviews?sort_by=notAColumn")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid sort_by query");
          });
      });

      it("Status 400: responds with invalid order query if not passed asc or desc", () => {
        return request(app)
          .get("/api/reviews?order=notascordesc")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid order query");
          });
      });

      it("Status 404: responds with resource not found if searching for category that doesn't exist", () => {
        return request(app)
          .get("/api/reviews?category=notacategory")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("resource not found: notacategory");
          });
      });

      it("Status 200: responds with empty array if category exists but has no reviews", () => {
        return request(app)
          .get("/api/reviews?category=children's games")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toHaveLength(0);
          });
      });
    });
  });

  describe("/api/reviews/:review_id/comments path:", () => {
    describe("GET method:", () => {
      it("Status 200: responds with array of comment objects for given review_id", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toHaveLength(3);
            body.comments.forEach((comm) =>
              expect(comm).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              )
            );
          });
      });

      it("Status 404: responds with resource not found if review_id doesn't exist", () => {
        return request(app)
          .get("/api/reviews/999999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("resource not found: 999999");
          });
      });

      it("Status 200: responds with empty array if review_id has no comments associated", () => {
        return request(app)
          .get("/api/reviews/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toHaveLength(0);
          });
      });

      it("Status 400: responds with invalid query if review_id passed is not number", () => {
        return request(app)
          .get("/api/reviews/notnumber/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });
    });

    describe("POST method:", () => {
      it("Status 200: responds with posted comment", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({ username: "mallionaire", body: "test review" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: 0,
                created_at: expect.any(String),
                author: "mallionaire",
                body: "test review",
              })
            );
          });
      });

      it("Status 404: responds with resource not found if attempting to post comment to review_id that does not exist", () => {
        return request(app)
          .post("/api/reviews/9999999/comments")
          .send({ username: "mallionaire", body: "test review" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("resource not found: 9999999");
          });
      });

      it("Status 404: responds with invalid query if review_id not a number", () => {
        return request(app)
          .post("/api/reviews/NotANumber/comments")
          .send({ username: "mallionaire", body: "test review" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });

      it("Status 400: responds with invalid query body when req body has too few or too many columns", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query body");
          });
      });

      it("Status 400: responds with invalid query body when length correct but username or body are not present", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({ wrongColumn: 1, wrongColumn2: "Hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query body");
          });
      });

      it("Status 404: responds with resource not found when username does not exist", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({ username: 1, body: "Hello" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("resource not found: 1");
          });
      });
    });
  });

  describe("/api/comments/:comment_id path:", () => {
    describe("DELETE method:", () => {
      it("Status 200: deletes proper row and responds with status 204", async () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(async () => {
            await expect(
              checkExists("comments", "comment_id", "1")
            ).rejects.toEqual({ status: 404, msg: "resource not found: 1" });
          });
      });

      it("Status 404: returns resource not found when attempting to delete a comment that does not exist", () => {
        return request(app)
          .delete("/api/comments/99999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("resource not found: 99999");
          });
      });

      it("Status 400: returns invalid query when acomment_id not a number", () => {
        return request(app)
          .delete("/api/comments/noANumber")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });
    });

    describe("EXTRA TASK : PATCH method: ", () => {
      it("EXTRA TASK : Status 200: responds with an updated comment object", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: newVote })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
      });

      it("EXTRA TASK : Status 200: comment votes are increased by the correct amount", () => {
        const newVote = 4;
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: newVote })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual(
              expect.objectContaining({
                comment_id: 1,
                votes: 20,
                created_at: expect.any(String),
                author: "bainesface",
                body: "I loved this game too!",
              })
            );
          });
      });

      it("EXTRA TASK : Status 200: comment votes are decreased by the correct amount", () => {
        const newVote = -6;
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: newVote })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual(
              expect.objectContaining({
                comment_id: 1,
                votes: 10,
                created_at: expect.any(String),
                author: "bainesface",
                body: "I loved this game too!",
              })
            );
          });
      });

      it("EXTRA TASK : Status 404: responds with resource not found if attempting to patch comment_id that doesn't exist", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/comments/99999")
          .send({ inc_votes: newVote })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("resource not found: 99999");
          });
      });

      it("EXTRA TASK : Status 400: responds with invalid query when comment_id not a number", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/comments/INVALID")
          .send({ inc_votes: newVote })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });

      it("EXTRA TASK : Status 400: responds with invalid query body if not passed proper inc_votes", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/comments/2")
          .send({ NOT_THE_COLUMN: newVote })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query body");
          });
      });

      it("EXTRA TASK : Status 400: responds with invalid query if inc_votes wrong datatype", () => {
        const newVote = "invalid";
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: newVote })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query");
          });
      });

      it("EXTRA TASK : Status 400: responds with invalid query if req body has too many columns", () => {
        const newVote = 5;
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: newVote, extra_column: "I'm wrong" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid query body");
          });
      });
    });
  });

  describe("/api path", () => {
    it("Status 200: responds with JSON describing available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpointData);
        });
    });
  });

  describe("/api/users path:", () => {
    describe("GET method:", () => {
      it("Status 200: responds with array of user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users).toHaveLength(4);
            body.users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                })
              );
            });
          });
      });
    });
  });

  describe("EXTRA TASK : /api/users/:username path:", () => {
    describe("EXTRA TASK : GET method:", () => {
      it("Status 200: responds with a correct user object", () => {
        return request(app)
          .get("/api/users/mallionaire")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
      });

      it("EXTRA TASK : Status 404: returns resource not found when searching for username that doesn't exist", () => {
        return request(app)
          .get("/api/users/iDontExist")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("resource not found: iDontExist");
          });
      });

      // it("EXTRA TASK : Status 400: returns invalid query when username wrong datatype", () => {
      //   return request(app)
      //     .get("/api/users/<>^`{|}|;;")
      //     .expect(400)
      //     .then(({ body }) => {
      //       expect(body.msg).toBe("invalid query");
      //     });
      // });
    });
  });
});
