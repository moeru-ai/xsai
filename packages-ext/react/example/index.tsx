import React from 'react'
import ReactDOM from 'react-dom/client'
import Chat from './useChat'

// Mount the React component to a DOM element with id="app"
ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <Chat />
  </React.StrictMode>
)
