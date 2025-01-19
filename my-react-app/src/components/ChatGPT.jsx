import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatGPT.css';

const ChatGPT = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi There! 👋 What Is Your Name ? 🤚'
    }
  ]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const [productType, setProductType] = useState('');
  const [stage, setStage] = useState('name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState([]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    setIsLoading(true);
    setError(null);
    
    try {
      if (stage === 'name') {
        setStage('product');
        setUserName(userMessage);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Hi ${userMessage}! 👋 Please choose either:\n- Laptop 💻\n- Mobile Phone 📱\n- Washing Machine 🧺`
        }]);
      } else if (stage === 'product') {
        const product = userMessage.toLowerCase();
        if (['laptop', 'mobile phone', 'washing machine'].includes(product)) {
          setProductType(product);
          setStage('requirements');
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Great choice! 🎉 Please tell me your requirements for the ${product} (such as budget, specific features, or preferences).`
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '❌ Please choose either Laptop, Mobile Phone, or Washing Machine.'
          }]);
        }
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Act as a product recommendation expert. The user ${userName} is looking for a ${productType} with the following requirements: ${userMessage}. Based on these requirements, recommend 3 best ${productType}s with their specifications, pros and cons, and prices. Format the response as follows for each product:
        Product 1: [Name]
        Specifications: [Key specs in bullet points]
        Price: [Price in INR]
        Pros: [List of pros]
        Cons: [List of cons]
        Product 2: [Name]
        Specifications: [Key specs in bullet points]
        Price: [Price in INR]
        Pros: [List of pros]
        Cons: [List of cons]
        Product 3: [Name]
        Specifications: [Key specs in bullet points]
        Price: [Price in INR]
        Pros: [List of pros]
        Cons: [List of cons]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: text
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.'
      }]);
      setError('An error occurred while processing your request');
    }
    setIsLoading(false);
  };

  const ProductRecommendation = ({ content }) => {
    const products = content.split(/Product \d+:/g).filter(Boolean);
    
    return (
      <div>
        {products.map((product, productIndex) => {
          const lines = product.split('\n');
          const productName = lines[0].trim().replace(/\*\*/g, '');
          const specs = [];
          const pros = [];
          const cons = [];
          let currentSection = 'specs';

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.toLowerCase().includes('pros:')) {
              currentSection = 'pros';
            } else if (line.toLowerCase().includes('cons:')) {
              currentSection = 'cons';
            } else if (line.trim() && !line.startsWith('Specifications:')) {
              switch (currentSection) {
                case 'specs':
                  if (!line.includes('**')) {
                    if (line.toLowerCase().includes('price:')) {
                      specs.push(<div className="price-highlight">{line}</div>);
                    } else {
                      specs.push(line);
                    }
                  }
                  break;
                case 'pros':
                  if (!line.includes('Price:') && !line.includes('Cons:') && !line.includes('**')) {
                    pros.push(line.replace(/\*/g, '').trim());
                  }
                  break;
                case 'cons':
                  if (!line.includes('Price:') && !line.includes('Pros:') && !line.includes('**')) {
                    cons.push(line.replace(/\*/g, '').trim());
                  }
                  break;
              }
            }
          }

          return (
            <div key={productIndex} className="product-container">
              <h2 className="product-name">{productName}</h2>
              <div className="specifications">
                {specs.map((spec, index) => (
                  <div key={index} className="spec-item">
                    {typeof spec === 'string' ? spec : spec}
                  </div>
                ))}
              </div>
              {(pros.length > 0 || cons.length > 0) && (
                <div className="pros-cons-grid">
                  <div className="pros-section">
                    <h3 className="pros-title">Pros</h3>
                    {pros.map((pro, index) => (
                      <div key={index} className="pros-item">{pro}</div>
                    ))}
                  </div>
                  <div className="cons-section">
                    <h3 className="cons-title">Cons</h3>
                    {cons.map((con, index) => (
                      <div key={index} className="cons-item">{con}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    return (
      <div key={index} className={message.role === 'user' ? 'user-message' : 'bot-message'}>
        {message.role === 'assistant' && index === 0 ? (
          <span>Hi There! <span className="wave-emoji">👋</span> What Is Your Name ? <span className="wave-emoji">🤚</span></span>
        ) : (
          message.role === 'assistant' && message.content.includes('Pros:') ? (
            <ProductRecommendation content={message.content} />
          ) : (
            message.content.split('\n').map((line, i) => (
              <p key={i} style={{ margin: '5px 0' }}>{line}</p>
            ))
          )
        )}
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => renderMessage(message, index))}
        {isLoading && (
          <div className="message assistant loading">
            Thinking<span className="loading-dots">...</span>
          </div>
        )}
        {error && (
          <div className="message error">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={stage === 'name' ? "Enter your name..." : stage === 'product' ? "Choose a product type..." : "Tell me your requirements..."}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatGPT;
