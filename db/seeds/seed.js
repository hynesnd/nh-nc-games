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
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL
    )`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      avatar_url VARCHAR,
      name VARCHAR NOT NULL
    )`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR,
      review_body VARCHAR,
      designer VARCHAR,
      review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      category VARCHAR REFERENCES categories(slug) ON DELETE CASCADE NOT NULL,
      owner VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
        review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
        votes INT DEFAULT 0,
        created_id TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR
      )`);
    })
    .then(() => {
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
    });
  // 2. insert data
};

module.exports = seed;
