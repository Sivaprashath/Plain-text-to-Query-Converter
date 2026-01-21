function validateSQL(sql) {
  const lowerSQL = sql.toLowerCase();

  const forbidden = [
    "drop ", "delete ", "update ", "insert ",
    "alter ", "create ", "truncate ", "pragma "
  ];

  for (let word of forbidden) {
    if (lowerSQL.includes(word)) {
      return { valid: false, reason: `Forbidden keyword: ${word}` };
    }
  }

  if (!lowerSQL.startsWith("select")) {
    return { valid: false, reason: "Only SELECT queries allowed" };
  }

  const allowedTables = [
    "placements", "companies", "colleges", "schools", "prreport"
  ];

  const tableRegex = /(from|join)\s+([a-zA-Z_]+)/g;
  let match;

  while ((match = tableRegex.exec(lowerSQL)) !== null) {
    if (!allowedTables.includes(match[2])) {
      return { valid: false, reason: `Invalid table: ${match[2]}` };
    }
  }

  return { valid: true };
}

module.exports = validateSQL;
