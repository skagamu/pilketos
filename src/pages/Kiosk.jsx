import { useState, useEffect, useRef } from 'react'
import { Lock, Maximize, CheckCircle2, User, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { fetchCandidates, submitVote } from '../lib/db'

const OPERATOR_PIN = "1234"

// Fallback if DB is empty during development
const FALLBACK_CANDIDATES = [
  { id: 'uuid-1', candidate_number: 1, name: "Chansa Krinstianti & Danang Arif Susanto", photo_url: "/assets/paslon-1.jpeg" },
  { id: 'uuid-2', candidate_number: 2, name: "Ramadani Suciva A & Sela Miftakul J", photo_url: "/assets/paslon-2.jpeg" },
  { id: 'uuid-3', candidate_number: 3, name: "Noval Pratama & Yolandha Clara S", photo_url: "/assets/paslon-3.jpeg" }
]

export default function Kiosk() {
  const [kioskState, setKioskState] = useState('LOCKED')
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const timerRef = useRef(null)

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault()
    document.addEventListener('contextmenu', handleContextMenu)
    
    // Load candidates from Supabase
    const loadData = async () => {
      const data = await fetchCandidates()
      if (data && data.length > 0) {
        setCandidates(data)
      } else {
        // Use fallback if DB is empty for UI testing
        setCandidates(FALLBACK_CANDIDATES)
      }
      setLoading(false)
    }
    loadData()
    
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  const handleUnlock = (e) => {
    e.preventDefault()
    if (pinInput === OPERATOR_PIN) {
      setKioskState('VOTING')
      setPinInput('')
      setPinError(false)
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 2000)
    }
  }

  const handleSelect = (candidate) => {
    setSelectedCandidate(candidate)
    setShowModal(true)
  }

  const handleConfirmVote = async () => {
    setIsSubmitting(true)
    try {
      // Only hit DB if it's not a fallback UUID
      if (!selectedCandidate.id.startsWith('uuid-')) {
        await submitVote(selectedCandidate.id)
      } else {
        // Simulate network delay for fallback
        await new Promise(r => setTimeout(r, 500))
      }
      
      setShowModal(false)
      setKioskState('THANK_YOU')
  
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setKioskState('LOCKED')
        setSelectedCandidate(null)
      }, 3000)
    } catch (error) {
      alert("Gagal menyimpan suara, periksa koneksi internet.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const enforceFullscreen = () => {
    const elem = document.documentElement
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => console.log(err))
    } else {
      document.exitFullscreen()
    }
  }

  if (loading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-slate-950"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden select-none">
      <button 
        onClick={enforceFullscreen}
        className="fixed bottom-0 right-0 w-16 h-16 opacity-0 hover:opacity-10 transition-opacity z-50 flex items-center justify-center cursor-default"
      >
        <Maximize className="w-6 h-6 text-slate-100" />
      </button>

      {kioskState === 'LOCKED' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
            <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Bilik Suara Terkunci</h1>
            <p className="text-slate-400 mb-8 text-sm">Menunggu Operator untuk membuka sesi pemilihan berikutnya.</p>
            
            <form onSubmit={handleUnlock} className="space-y-4">
              <input 
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN Operator"
                className={`w-full text-center tracking-[0.5em] font-mono text-2xl py-4 bg-slate-950 border rounded-xl focus:outline-none transition-colors ${
                  pinError ? 'border-red-500 text-red-500' : 'border-slate-800 focus:border-red-500 text-white'
                }`}
                autoFocus
              />
              <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all active:scale-[0.98]">
                Buka Bilik Suara
              </button>
            </form>
          </div>
        </div>
      )}

      {kioskState === 'VOTING' && (
        <div className="flex-1 flex flex-col p-6 lg:p-12 max-w-7xl mx-auto w-full">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Pemilihan Ketua & Wakil OSIS</h1>
            <p className="text-xl text-slate-400">Silakan pilih pasangan calon kepercayaan Anda.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
                <div className="relative aspect-[3/4] w-full mb-6 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  {candidate.photo_url ? (
                    <img src={`${import.meta.env.BASE_URL}${candidate.photo_url.replace(/^\\//, '')}`} alt={`Paslon ${candidate.candidate_number}`} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                      <User className="w-16 h-16 mb-2 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-black font-mono shadow-lg border-4 border-slate-900">
                    {candidate.candidate_number}
                  </div>
                </div>
                
                <div className="text-center mb-8 flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold leading-tight">{candidate.name}</h2>
                </div>

                <button 
                  onClick={() => handleSelect(candidate)}
                  className="w-full py-5 bg-slate-100 hover:bg-white text-slate-900 font-black text-xl rounded-2xl transition-all active:scale-[0.98] uppercase tracking-wide"
                >
                  Coblos Paslon {candidate.candidate_number}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isSubmitting && setShowModal(false)}></div>
          <div className="bg-slate-900 border border-slate-700 p-8 md:p-12 rounded-3xl shadow-2xl relative z-10 max-w-lg w-full text-center animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">Konfirmasi Pilihan</h2>
            <p className="text-xl text-slate-300 mb-8">
              Apakah Anda yakin ingin memilih <br/>
              <strong className="text-white">Paslon Nomor {selectedCandidate.candidate_number}</strong>?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button disabled={isSubmitting} onClick={() => setShowModal(false)} className="py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl active:scale-[0.98] disabled:opacity-50">
                Batal
              </button>
              <button disabled={isSubmitting} onClick={handleConfirmVote} className="py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yakin, Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {kioskState === 'THANK_YOU' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-emerald-950/30">
          <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <CheckCircle2 className="w-32 h-32 text-emerald-500 mx-auto mb-8" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-white">Terima Kasih!</h1>
            <p className="text-2xl text-emerald-200/80">Suara Anda telah berhasil direkam.</p>
          </div>
        </div>
      )}
    </div>
  )
}