const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS reviews");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS categories");
    })
    .then(() => {
      return db.query(`
    CREATE TABLE categories (
      slug VARCHAR UNIQUE PRIMARY KEY,
      description VARCHAR NOT NULL
    )`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE users (
      username VARCHAR UNIQUE PRIMARY KEY,
      avatar_url VARCHAR,
      name VARCHAR NOT NULL
    )`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      review_body VARCHAR NOT NULL,
      designer VARCHAR NOT NULL,
      review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      category VARCHAR REFERENCES categories(slug) NOT NULL,
      owner VARCHAR REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
        review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
        votes INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR
      )`);
    })
    .then(() => {
      // 2. insert data
      const insertQuery = format(
        `INSERT INTO categories
        (slug, description)
        VALUES
        %L;`,
        categoryData.map((cat) => {
          return [cat.slug, cat.description];
        })
      );

      return db.query(insertQuery);
    })
    .then(() => {
      const insertQuery = format(
        `INSERT INTO users
        (username, name, avatar_url)
        VALUES
        %L;`,
        userData.map((user) => {
          return [user.username, user.name, user.avatar_url];
        })
      );

      return db.query(insertQuery);
    })
    .then(() => {
      const insertQuery = format(
        `INSERT INTO reviews
        (title, designer, owner, review_img_url, review_body, category, created_at, votes)
        VALUES
        %L;`,
        reviewData.map((rev) => {
          return [
            rev.title,
            rev.designer,
            rev.owner,
            rev.review_img_url,
            rev.review_body,
            rev.category,
            rev.created_at,
            rev.votes,
          ];
        })
      );

      return db.query(insertQuery);
    })
    .then(() => {
      const insertQuery = format(
        `INSERT INTO comments
        (body, votes, author, review_id, created_at)
        VALUES
        %L;`,
        commentData.map((comm) => {
          return [
            comm.body,
            comm.votes,
            comm.author,
            comm.review_id,
            comm.created_at,
          ];
        })
      );
      return db.query(insertQuery);
    });
};

module.exports = seed;
