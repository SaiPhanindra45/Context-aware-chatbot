import { GoogleGenerativeAI } from "@google/generative-ai";
import './Chat.css'
import { useState } from 'react'

function Chat({file}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    async function handleSendMessage(){
        if(input.length) {
            const userInput = input;
            let chatMessages = [...messages, {role: "user", text: input}, {role: "loader", text: ""}];
            setInput("");
            setMessages(chatMessages);

            try {
                // Log the file object to see its structure
                console.log("File object:", file);
                console.log("File keys:", Object.keys(file));
                
                // Check if file exists and has required properties
                if (!file || !file.file || !file.type) {
                    throw new Error("File data is missing or incomplete");
                }

                const apiKey = import.meta.VITE_GEMINI_API_KEY;
                
                if (!apiKey) {
                    throw new Error("API Key not found");
                }
                
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
                
                const result = await model.generateContent([
                  {
                      inlineData: {
                          mimeType: file.type,
                          data: file.file,
                      },
                  },
                  `Answer this question about the attached document: ${userInput}.
Answer as a chatbot with short messages and text only (no markdowns, tags or symbols)

Previous conversation:
${messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}

Current question: ${userInput}`,
                ]);

                const responseText = result.response.text();
                console.log("Response received:", responseText);
                
                chatMessages = [...chatMessages.filter((msg)=>msg.role !== 'loader'), {role: "model", text: responseText}];
                setMessages(chatMessages);
              } catch (error) {
                console.error('Full error object:', error);
                console.error('Error message:', error.message);
                
                chatMessages = [...chatMessages.filter((msg)=>msg.role !== 'loader'), {role: "error", text: `Error: ${error.message || 'Unknown error'}`}];
                setMessages(chatMessages);
              }
        }
    }

    // Add a safety check before rendering
    if (!file) {
        return (
            <section className="chat-window">
                <h2>Chat</h2>
                <p>Please upload a document first.</p>
            </section>
        );
    }

    return (
      <section className="chat-window">
        <h2>Chat</h2>
        {
            messages.length ?
            <div className="chat">
                {
                    messages.map((msg, index)=>(
                        <div className={msg.role} key={`${msg.role}-${index}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))
                }
            </div> :
            ''
        }
        
        <div className="input-area">
            <input 
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                type="text"
                placeholder="Ask any question about the uploaded document..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
      </section>
    )
  }
  
  export default Chat