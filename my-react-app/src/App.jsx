import { useState } from 'react'
import ChatGPT from './components/ChatGPT'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="chat-header">
        <h1>AI BASED ELECTRONIC RECOMMENDATION</h1>
      </header>
      <ChatGPT />
    </div>
  )
}

export default App
