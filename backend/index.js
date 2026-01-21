const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("pr_report.db");

const groq = new Groq({
  apiKey: "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"
});

function validateSQL(sql) {
  const lower = sql.toLowerCase();

  const forbidden = [
    "drop ", "delete ", "update ", "insert ",
    "alter ", "create ", "truncate ", "pragma "
  ];

  for (let f of forbidden) {
    if (lower.includes(f)) {
      return { valid: false, reason: `Forbidden keyword: ${f}` };
    }
  }

  if (!lower.startsWith("select")) {
    return { valid: false, reason: "Only SELECT queries are allowed" };
  }

  return { valid: true };
}

function autoCorrectSQL(sql) {
  let q = sql;

  q = q.replace(/\bprreport\b/gi, "placements");

  q = q.replace(/'आईटी'/g, "'IT'");
  q = q.replace(/'बैंगलोर'/g, "'Bangalore'");
  q = q.replace(/'பெங்களூர்'/g, "'Bangalore'");
  q = q.replace(/'தகவல் தொழில்நுட்ப'/g, "'IT'");

  if (q.match(/from\s+placements/i) && !q.match(/from\s+placements\s+p/i)) {
    q = q.replace(/from\s+placements/i, "FROM placements p");
  }

  const safeReplace = (col, prefixed) => {
    q = q.replace(new RegExp(`(?<!\\.)\\b${col}\\b`, "g"), prefixed);
  };

  safeReplace("student_name", "p.student_name");
  safeReplace("package", "p.package");
  safeReplace("company_name", "c.company_name");
  safeReplace("industry", "c.industry");
  safeReplace("location", "c.location");

  if (
    (q.includes("c.") || q.includes("industry") || q.includes("company_name")) &&
    !q.includes("JOIN companies")
  ) {
    q += "\nJOIN companies c ON p.company_id = c.id";
  }

  return q;
}

app.post("/api/ask", async (req, res) => {
  const question = req.body.question;

  const prompt = `
You are a STRICT SQLite SQL generator.

The user question may be in English, Tamil, or Hindi.
Internally translate and understand the question if needed.

OUTPUT RULES (MANDATORY):
- Output ONLY ONE valid SQLite SELECT query
- NO explanations
- NO translations
- NO headings
- NO markdown
- NO comments
- NO extra text
- NO AS keyword unless required

DATABASE SCHEMA:

placements(id, student_name, package, company_id, college_id, date)
companies(id, company_name, industry, location, employees, revenue)
colleges(id, college_name, city, state, students_count, established_year)
schools(id, school_name, city, state, students_count, established_year)

LOGIC:
- "show placement" → SELECT * FROM placements
- "show school" → SELECT * FROM schools
- "show college" → SELECT * FROM colleges
- "show" alone → SELECT * FROM placements
- Use JOIN only when required
- Use ONLY SELECT

User Question:
${question}

REMEMBER: OUTPUT ONLY SQL QUERY.
`;

  try {
    const reply = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    let raw = reply.choices[0].message.content;

    const match = raw.match(/select[\s\S]*?(;|$)/i);

    if (!match) {
      return res.json({
        sql: raw,
        result: "Invalid query: No SELECT statement found"
      });
    }

    let sql = match[0].trim();
    console.log("LLM SQL:", sql);

    let validation = validateSQL(sql);

    if (!validation.valid) {
      sql = autoCorrectSQL(sql);
      validation = validateSQL(sql);

      if (!validation.valid) {
        return res.json({
          sql,
          result: `Invalid query: ${validation.reason}`
        });
      }
    }

    console.log("Final SQL:", sql);

    const rows = db.prepare(sql).all();
    res.json({ sql, result: rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      sql: "Error",
      result: err.message
    });
  }
});

app.listen(8080, () => {
  console.log("Backend running on port 8080");
});
