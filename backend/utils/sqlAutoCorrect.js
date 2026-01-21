function autoCorrectSQL(sql) {
  let q = sql;

  q = q.replace(/\bprreport\b/gi, "placements");
  q = q.replace(/\bcompany\b/gi, "companies");
  q = q.replace(/\bcollege\b/gi, "colleges");

  q = q.replace(/\bstudent_name\b/g, "p.student_name");
  q = q.replace(/\bpackage\b/g, "p.package");
  q = q.replace(/\bcompany_name\b/g, "c.company_name");
  q = q.replace(/\bindustry\b/g, "c.industry");

  if (q.includes("FROM placements") && !q.includes("placements p")) {
    q = q.replace("FROM placements", "FROM placements p");
  }

  if (q.includes("c.company_name") && !q.includes("JOIN companies")) {
    q += "\nJOIN companies c ON p.company_id = c.id";
  }

  return q;
}

module.exports = autoCorrectSQL;
