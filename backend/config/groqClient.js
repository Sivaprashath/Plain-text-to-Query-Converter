const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "YOUR_GROQ_KEY"
});

module.exports = groq;
