import { useState, useEffect } from 'react'

function App() {
  const [backendData, setBackendData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchInfo = () => {
    setLoading(true)
    fetch('/api/info')
      .then(response => {
        if (!response.ok) {
          throw new Error('Backend unreachable')
        }
        return response.json()
      })
      .then(data => {
        setBackendData(data)
        setError(null)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  // Maps tech stack items to specific modern SVG icons and colors
  const getTechDetails = (key) => {
    switch (key.toLowerCase()) {
      case 'infra':
        return {
          title: 'Infrastructure',
          desc: 'Terraform & GCP VM Nodes',
          icon: (
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
          color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20'
        }
      case 'config_mgmt':
        return {
          title: 'Configuration',
          desc: 'Ansible Playbooks',
          icon: (
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          color: 'from-red-500/10 to-pink-500/10 border-red-500/20'
        }
      case 'kubernetes':
        return {
          title: 'Orchestration',
          desc: 'K3s Lightweight Cluster',
          icon: (
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
          color: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20'
        }
      case 'ci':
        return {
          title: 'CI Pipeline',
          desc: 'Jenkins + SonarQube + Trivy',
          icon: (
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
            </svg>
          ),
          color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20'
        }
      case 'cd':
        return {
          title: 'CD GitOps',
          desc: 'ArgoCD Synchronization',
          icon: (
            <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ),
          color: 'from-teal-500/10 to-emerald-500/10 border-teal-500/20'
        }
      case 'observability':
        return {
          title: 'Observability',
          desc: 'Prometheus + Grafana + Loki',
          icon: (
            <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          ),
          color: 'from-fuchsia-500/10 to-pink-500/10 border-fuchsia-500/20'
        }
      case 'application':
        return {
          title: 'Applications',
          desc: 'React (Vite) + Go Backend',
          icon: (
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
          color: 'from-emerald-500/10 to-cyan-500/10 border-emerald-500/20'
        }
      default:
        return {
          title: key,
          desc: '',
          icon: (
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'from-gray-500/10 to-slate-500/10 border-gray-500/20'
        }
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navbar Header */}
      <header className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                NexOps Platform
              </h1>
              <p className="text-xs text-slate-500 font-medium">DevSecOps GitOps Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Go API Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${error ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`}></span>
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
                {loading ? 'Connecting...' : error ? 'API Offline' : 'API Online'}
              </span>
            </div>

            <button 
              onClick={fetchInfo}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition-all active:scale-95"
              title="Reload Status"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl w-full mx-auto p-6 md:p-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Profile / Details */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          {/* Main Info Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
            
            <div>
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                Author Profile
              </span>
              
              <h2 className="text-2xl font-bold mt-4 tracking-tight text-white">
                Ichramsyah Abdurrachman
              </h2>
              <p className="text-sm text-slate-400 mt-1 font-medium">Cloud & DevSecOps Engineer</p>
              
              <div className="mt-8 space-y-4 border-t border-slate-800/80 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Platform Role</span>
                  <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">Owner & Creator</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Project Name</span>
                  <span className="text-xs font-semibold text-slate-300">NexOps Platform</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Frontend Stack</span>
                  <span className="text-xs font-semibold text-indigo-400">React + Vite + Tailwind</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Backend Stack</span>
                  <span className="text-xs font-semibold text-cyan-400">Go (Golang 1.24)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-slate-950/60 border border-slate-800/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Secure Deployment</p>
                <p className="text-[10px] text-slate-500 font-medium">Auto-scanned by Trivy Container security</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Interactive Tech Stack Grid */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 backdrop-blur">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              DevSecOps Platform Tech Stack
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Explore the underlying infrastructure and software layers powering this deployment.</p>

            {loading ? (
              <div className="mt-8 flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium">Fetching platform configurations...</p>
              </div>
            ) : error ? (
              <div className="mt-8 p-6 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
                <p className="text-sm text-red-400 font-semibold">Error communicating with Go API</p>
                <p className="text-xs text-slate-500 mt-1">Make sure backend deployment is reachable and check your network policy config.</p>
                <button 
                  onClick={fetchInfo}
                  className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition-all active:scale-95"
                >
                  Try Reconnecting
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {Object.entries(backendData.stack).map(([key, value]) => {
                  const tech = getTechDetails(key)
                  return (
                    <div 
                      key={key} 
                      className={`group rounded-xl border p-4 bg-gradient-to-br ${tech.color} hover:bg-slate-900/60 transition-all duration-300 flex items-start gap-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-950/40`}
                    >
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 group-hover:border-slate-700/60 shadow transition-colors">
                        {tech.icon}
                      </div>
                      
                      <div className="flex-grow">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{tech.title}</p>
                        <p className="text-sm font-semibold text-white mt-1 group-hover:text-indigo-300 transition-colors">{value}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{tech.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 text-center py-6 px-6 mt-12">
        <p className="text-xs text-slate-600 font-medium">
          &copy; {new Date().getFullYear()} NexOps Platform. Designed with passion for GitOps and Kubernetes.
        </p>
      </footer>
    </div>
  )
}

export default App
