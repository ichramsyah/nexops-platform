import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendData, setBackendData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // In production, this will hit the Ingress which routes /api to the Go backend
    fetch('/api/info')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => setBackendData(data))
      .catch(err => setError(err.message))
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>NexOps Platform Dashboard</h1>
        <p>Frontend: React (Vite)</p>
        
        <div className="backend-data">
          <h2>Backend API Status (Go)</h2>
          {error && <p className="error">Error connecting to backend: {error}</p>}
          {!backendData && !error && <p>Loading data from backend...</p>}
          
          {backendData && (
            <div className="data-card">
              <p><strong>Platform:</strong> {backendData.platform}</p>
              <p><strong>Author:</strong> {backendData.author}</p>
              <p><strong>Company:</strong> {backendData.company}</p>
              <h3>Tech Stack</h3>
              <ul>
                {Object.entries(backendData.stack).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default App
