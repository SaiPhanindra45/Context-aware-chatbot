import { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function Summary({ file }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
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
        
        // Debug: Check if API key is available
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log("API Key available:", !!apiKey);
        console.log("API Key length:", apiKey?.length || 0);
        
        if (!apiKey) {
          throw new Error("API Key not found. Make sure VITE_GEMINI_API_KEY is set in your .env file");
        }

        // Initialize the AI client
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});
        
        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: file.type,
              data: file.file,
            },
          },
          'Summarize the above content in a few short sentences.',
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

  if (loading) return <div>Generating summary...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  
  return (
    <div>
      <h2>Document Summary</h2>
      <p>{summary}</p>
    </div>
  );
}

export default Summary;