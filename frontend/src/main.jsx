import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Disable StrictMode to avoid react-leaflet-cluster cleanup issues
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

