import React, { useState } from "react";
import InputBox from "./components/InputBox";
import ConvertButton from "./components/ConvertButton";
import OutputBox from "./components/OutputBox";
import { convertToSQL } from "./services/api";
import bg from './assets/background.jpg';
import VoiceButton from "./components/VoiceButton";


function App() {
  const [input, setInput] = useState("");
  const [sql, setSql] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const data = await convertToSQL(input);
    setSql(data.sql);
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "50px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
          Natural Language → SQL
        </h1>

        <InputBox value={input} onChange={setInput} />
        <VoiceButton onResult={setInput} />
        <ConvertButton onClick={handleConvert} disabled={loading} />
        {loading && (
          <p style={{ textAlign: "center", marginTop: "10px", color: "#555" }}>Converting…</p>
        )}
        <OutputBox sql={sql} result={result} />
      </div>
    </div>
  );
}

export default App;
