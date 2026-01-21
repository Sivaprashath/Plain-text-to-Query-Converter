export const convertToSQL = async (question) => {
  try {
    const response = await fetch("http://localhost:8080/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    return data; // { sql, result }
  } catch (err) {
    console.error("Frontend Error:", err);
    return { sql: "", result: "Error connecting to backend" };
  }
};
