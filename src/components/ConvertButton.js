import React from "react";

export default function ConvertButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        borderRadius: "12px",
        border: "none",
        background: "#0072ff",
        color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "0.3s",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      }}
    >
      {disabled ? "Converting..." : "Convert to SQL"}
    </button>
  );
}
