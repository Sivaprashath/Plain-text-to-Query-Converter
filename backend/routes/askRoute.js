const express = require("express");
const router = express.Router();

const groq = require("../config/groqClient");
const db = require("../db/database");
const validateSQL = require("../utils/sqlValidator");
const autoCorrectSQL = require("../utils/sqlAutoCorrect");
const extractSQL = require("../utils/sqlExtractor");

router.post("/", async (req, res) => {
  const question = req.body.question;

  const prompt = `
You are an expert SQLite SQL generator.

Tables:
placements(id, student_name, package, company_id, college_id, date)
companies(id, company_name, industry, location, employees, revenue)
colleges(id, college_name, city, state, students_count, established_year)
schools(id, school_name, city, state, students_count, established_year)

Rules:
- Use JOINs when required
- Use only SELECT
- Return only SQL

Question: ${question}
`;

  try {
    const reply = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    let sql = extractSQL(reply.choices[0].message.content);

    let validation = validateSQL(sql);
    if (!validation.valid) {
      const corrected = autoCorrectSQL(sql);
      if (validateSQL(corrected).valid) {
        sql = corrected;
      } else {
        return res.status(400).json({ sql, result: validation.reason });
      }
    }

    const rows = db.prepare(sql).all();
    res.json({ sql, result: rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
