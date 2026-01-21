import React from "react";

export default function InputBox({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your question here..."
      rows={4}
      style={{
        width: "100%",
        padding: "15px",
        fontSize: "16px",
        borderRadius: "12px",
        border: "1px solid #ccc",
        marginBottom: "20px",
        resize: "none",
        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
      }}
    />
  );
}
