function extractSQL(text) {
  const match = text.match(/```sql([\s\S]*?)```/i);
  if (match) return match[1].trim();

  return text
    .split("\n")
    .filter(line =>
      line.toLowerCase().startsWith("select") ||
      line.toLowerCase().startsWith("from") ||
      line.toLowerCase().startsWith("join") ||
      line.toLowerCase().startsWith("where") ||
      line.toLowerCase().startsWith("group by") ||
      line.toLowerCase().startsWith("order by") ||
      line.toLowerCase().startsWith("limit")
    )
    .join("\n")
    .trim();
}

module.exports = extractSQL;
