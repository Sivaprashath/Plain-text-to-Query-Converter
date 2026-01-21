const Database = require("better-sqlite3");

const db = new Database("pr_report.db");

module.exports = db;
