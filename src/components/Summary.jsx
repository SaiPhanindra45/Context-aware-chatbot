import { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Loader from './loader'
function Summary({ file }) {
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
        
        
        const apiKey = import.meta.VITE_GEMINI_API_KEY;
       
        
        if (!apiKey) {
          throw new Error("API Key not found.");
        }

    
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});
        
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

  if (loading) return <div>Generating summary <Loader /></div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  
  return (
    <div>
        <img className="preview-image" src={file.imageUrl} alt="Preview Image" />
      <h2>Document Summary</h2>
      <div className="summary-box">{summary}</div>
      
    </div>
  );
}

export default Summary;