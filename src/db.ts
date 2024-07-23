import pg from "pg";
import dotenv from "dotenv";
dotenv.config({});

const db = new pg.Pool({
  user: process.env["PG_USER"],
  password: process.env["PG_PASSWORD"],
  host: process.env["HOST"],
  port: 5432,
  database: process.env["PG_DATABASE"],
});

export default db;
