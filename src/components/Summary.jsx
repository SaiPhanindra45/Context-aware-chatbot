import { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Loader from './loader'
function Summary({ file , onDelete}) {
    console.log(file)
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getSummary() {
      if (!file) {
        setLoading(false);
        return;
      }
     
      try {
        setLoading(true);
        setError(null);
        
        
        const apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY;
        console.log("API Key exists:", !!apiKey);
        
        if (!apiKey) {
          throw new Error("API Key not found.");
        }

    
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash-exp"});
        
        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: file.type,
              data: file.file,
            },
          },
          'Summarize the above content in a few short sentences. It can be below 300 words',
        ]);
       
        const text = result.response.text();
        setSummary(text);
      } catch (e) {
        console.error("Failed to generate summary:", e);
        setError(`Failed to generate summary: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    getSummary();
  }, [file]);
  const handleDeleteFile = () => {
    setSummary(null);
    setError(null);
    if (onDelete) onDelete(); // Notify parent to reset file state
  };
  if (loading) return <div>Generating summary <Loader /></div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  
  return (
    <div>
        <img className="preview-image" src={file.imageUrl} alt="Preview Image" />
      <h2>Document Summary</h2>
      <div className="summary-box">{summary}</div>
      <button
            onClick={handleDeleteFile}
            className="delete-button"
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Delete File
          </button>
    </div>
  );
}

export default Summary;