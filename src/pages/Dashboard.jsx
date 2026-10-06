import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { fetchCandidates, fetchVoteCounts } from '../lib/db'
import { BarChart3, Lock, Users, Activity } from 'lucide-react'

const MASTER_PIN = "9999"

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  
  const [candidates, setCandidates] = useState([])
  const [voteTally, setVoteTally] = useState({})
  const [totalVotes, setTotalVotes] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fallback for development if DB is empty
  const FALLBACK_CANDIDATES = [
    { id: 'uuid-1', candidate_number: 1, name: "Chansa & Danang", photo_url: "/assets/paslon-1.jpeg" },
    { id: 'uuid-2', candidate_number: 2, name: "Ramadani & Sela", photo_url: "/assets/paslon-2.jpeg" },
    { id: 'uuid-3', candidate_number: 3, name: "Noval & Yolandha", photo_url: "/assets/paslon-3.jpeg" }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    if (pinInput === MASTER_PIN) {
      setIsAuthenticated(true)
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 2000)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return

    let subscription

    const loadDashboardData = async () => {
      setLoading(true)
      
      // Fetch candidates
      const cands = await fetchCandidates()
      const effectiveCandidates = (cands && cands.length > 0) ? cands : FALLBACK_CANDIDATES
      setCandidates(effectiveCandidates)

      // Fetch initial tally
      const tally = await fetchVoteCounts()
      setVoteTally(tally)
      
      const total = Object.values(tally).reduce((a, b) => a + b, 0)
      setTotalVotes(total)
      setLoading(false)

      // Setup Realtime Subscription
      subscription = supabase
        .channel('public:votes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, payload => {
          // Tarik ulang data asli dari database setiap kali ada perubahan apapun.
          // Ini menjamin angka di layar 100% akurat dan tidak akan pernah "desync" (selisih)
          // meskipun koneksi Wi-Fi laptop proyektor sempat putus-nyambung.
          fetchVoteCounts().then(tally => {
            setVoteTally(tally)
            setTotalVotes(Object.values(tally).reduce((a, b) => a + b, 0))
          })
        })
        .subscribe((status) => {
          console.log("Status Realtime:", status)
        })
    }

    loadDashboardData()

    return () => {
      if (subscription) supabase.removeChannel(subscription)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-slate-950 text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tight">Akses Terkunci</h1>
          <p className="text-slate-400 mb-8 text-sm">Masukkan PIN Master untuk melihat hasil pemilu.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="PIN Master"
              className={`w-full text-center tracking-[0.5em] font-mono text-2xl py-4 bg-slate-950 border rounded-xl focus:outline-none transition-colors ${
                pinError ? 'border-red-500 text-red-500' : 'border-slate-800 focus:border-red-500 text-white'
              }`}
              autoFocus
            />
            <button type="submit" className="w-full py-4 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-xl transition-all active:scale-[0.98]">
              Lihat Hasil
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Find max votes for scaling the bars
  const maxVotes = Math.max(...Object.values(voteTally), 1) // prevent div by zero

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 p-6 lg:p-12 flex flex-col">
      <header className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Monitoring
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Hasil Perolehan Suara</h1>
          <p className="text-slate-400 mt-2 text-lg">Pemilihan Ketua & Wakil OSIS</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-w-[200px] text-right">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Total Suara Masuk</p>
          <div className="flex items-center justify-end gap-3">
            <Users className="w-8 h-8 text-slate-500" />
            <span className="text-5xl font-black font-mono text-white">{totalVotes}</span>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 animate-pulse">Memuat data real-time...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-end">
          {candidates.map((candidate) => {
            const votes = voteTally[candidate.id] || 0
            const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0
            // Height calculation for the bar
            const heightPercent = (votes / maxVotes) * 100
            
            return (
              <div key={candidate.id} className="flex flex-col h-full justify-end relative">
                
                {/* Metrics */}
                <div className="mb-4 text-center">
                  <div className="text-4xl lg:text-6xl font-black font-mono mb-1">{votes}</div>
                  <div className="text-slate-400 font-mono text-lg">{percentage}%</div>
                </div>

                {/* The Bar */}
                <div className="relative w-full bg-slate-900 border border-slate-800 rounded-t-3xl overflow-hidden flex flex-col justify-end min-h-[100px]" style={{ height: `min(60vh, max(100px, ${heightPercent}%))` }}>
                  {/* Fill */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-rose-400 transition-all duration-1000 ease-out origin-bottom"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  
                  {/* Candidate Photo (Overlay) */}
                  <div className="relative z-10 w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-6 rounded-full border-4 border-slate-950 overflow-hidden shadow-2xl bg-slate-900">
                     <img src={`${import.meta.env.BASE_URL}${candidate.photo_url.startsWith('/') ? candidate.photo_url.slice(1) : candidate.photo_url}`} alt="Paslon" className="w-full h-full object-cover object-top" />
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-3xl p-6 text-center">
                  <div className="inline-block w-8 h-8 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-3">
                    {candidate.candidate_number}
                  </div>
                  <h3 className="font-bold text-slate-100 leading-tight">{candidate.name}</h3>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}