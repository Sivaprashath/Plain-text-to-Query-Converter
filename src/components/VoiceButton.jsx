import React from "react";

function VoiceButton({ onResult }) {
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = navigator.language || "ta-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.onerror = (e) => {
      console.error("Voice error:", e);
    };
  };

  return (
    <button
      onClick={startListening}
      style={{
        width: "100%",
        marginTop: "10px",
        padding: "12px",
        fontSize: "16px",
        borderRadius: "12px",
        border: "none",
        background: "#28a745",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      🎤 Speak (Tamil / Hindi / English)
    </button>
  );
}

export default VoiceButton;
