import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload_resume/", formData);
      setResults(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />

      <div style={{
        width: "100%",
        maxWidth: "800px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "#fff",
        animation: "fadeIn 0.6s ease-out"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "2rem",
          textShadow: "0 2px 4px rgba(0,0,0,0.4)"
        }}>
          🚀 <span style={{ color: "#00C9A7" }}>AI Resume Screening</span> Dashboard
        </h1>

        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={handleFileChange}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "none",
            marginBottom: "1rem",
            backgroundColor: "#ffffff",
            color: "#333",
            fontWeight: "500"
          }}
        />

        <button
          onClick={handleUpload}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#00C9A7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.3s ease"
          }}
        >
          Upload Resume
        </button>

        {results && (
          <div style={{ marginTop: "2rem" }}>
            {/* Circular Match Score */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "2rem"
            }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: `conic-gradient(#00C9A7 ${results.match_score * 360}deg, #ffffff22 0deg)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#fff",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)"
              }}>
                {Math.round(results.match_score * 100)}%
              </div>
            </div>

            {/* Responsive Grid */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              justifyContent: "space-between"
            }}>
              {/* Extracted Skills Card */}
              <div style={{
                flex: "1 1 300px",
                background: "#ffffff11",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}>
                <h3 style={{ color: "#00C9A7" }}>✅ Extracted Skills</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {results.extracted_skills.map((skill, index) => (
                    <span key={index} style={{
                      backgroundColor: "#00C9A7",
                      color: "#fff",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "500"
                    }}>
                      {skill === "Python" && "🐍 "}
                      {skill === "HTML" && "🌐 "}
                      {skill === "CSS" && "🎨 "}
                      {skill === "JavaScript" && "⚡ "}
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills Card */}
              <div style={{
                flex: "1 1 300px",
                background: "#ffffff11",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}>
                <h3 style={{ color: "#E74C3C" }}>❌ Missing Skills</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {results.missing_skills.map((skill, index) => (
                    <span key={index} style={{
                      backgroundColor: "#E74C3C",
                      color: "#fff",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "500"
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
