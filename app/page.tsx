'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { createClient } from '@supabase/supabase-js'

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null

interface Project {
  id: string
  title: string
  category: 'automation' | 'video'
  summary: string
  description: string
  cover_url: string
  project_url?: string
}

export default function Home() {
  const [activeModal, setActiveModal] = useState<'about' | 'work' | 'contact' | 'book' | null>(null)
  const [workFilter, setWorkFilter] = useState<'all' | 'automation' | 'video'>('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [timeString, setTimeString] = useState('')
  const [typedText, setTypedText] = useState('')
  const [bgVideoSrc, setBgVideoSrc] = useState<string | null>(null)
  
  const fullText = "Welcome to Oyero Ibrahim's Portfolio"

  // Typing Effect
  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)
    return () => clearInterval(typingInterval)
  }, [])

  // Live Lagos UTC+1 Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
      setTimeString(new Intl.DateTimeFormat([], options).format(now))
    }
    updateTime()
    const timer = setInterval(updateTime, 10000)
    return () => clearInterval(timer)
  }, [])

  // Fetch Projects & Set Background Video (Now includes ALL categories)
  useEffect(() => {
    async function fetchProjects() {
      if (!supabase) return
      setLoadingProjects(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setProjects(data)
        
        // Find ALL uploaded projects (both Automation & Video) that have an MP4 link
        const videoProjects = data.filter(p => p.project_url && p.project_url.includes('.mp4'))
        
        if (videoProjects.length > 0) {
          const randomVideo = videoProjects[Math.floor(Math.random() * videoProjects.length)]
          setBgVideoSrc(randomVideo.project_url || null)
        } else {
          setBgVideoSrc('https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-nodes-42790-large.mp4')
        }
      } else {
        setBgVideoSrc('https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-nodes-42790-large.mp4')
        setProjects([
          {
            id: '1', title: 'n8n Workflow Engine', category: 'automation',
            summary: 'Self-hosted n8n backend on AWS EC2.', description: '',
            cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            project_url: 'https://github.com/Oye96'
          }
        ])
      }
      setLoadingProjects(false)
    }
    fetchProjects()
  }, [])

  const filteredProjects = workFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === workFilter)

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      {/* Add Custom Animations inline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slowPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(6,182,212,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(6,182,212,0.6); }
        }
        .animate-slow-pulse { animation: slowPulse 4s ease-in-out infinite; }
      `}} />

      <main className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col items-center p-4 md:p-8 font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden">
        
        {/* Dynamic Background Video Layer */}
        {bgVideoSrc && (
          <video 
            key={bgVideoSrc}
            autoPlay loop muted playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none scale-105"
          >
            <source src={bgVideoSrc} type="video/mp4" />
          </video>
        )}

        {/* Dark Overlay Tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D14]/90 via-[#0A0D14]/70 to-[#0A0D14] pointer-events-none" />

        {/* Top Bar Header */}
        <div className="relative z-10 w-full max-w-xl flex items-center justify-between py-2 px-1 mb-8 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-lg shadow-cyan-500/20">
              OI
            </div>
            <span className="font-semibold tracking-wide text-sm text-slate-300">Oyero Ibrahim</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">Available for Hire</span>
          </div>
        </div>

        {/* --- PERSONALIZED HERO SECTION --- */}
        <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center space-y-6 mt-2">
          
          {/* Glowing Premium CSS Avatar */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 animate-slow-pulse">
            <div className="absolute inset-1 bg-slate-950 rounded-full flex items-center justify-center z-10">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                OI
              </span>
            </div>
            <div className="absolute inset-0 rounded-full border border-white/20 backdrop-blur-sm z-20" />
          </div>

          {/* Typing Welcome Text */}
          <div className="h-16 flex items-center justify-center pt-2">
             <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {typedText}
              <span className="animate-pulse text-cyan-400 font-light">|</span>
             </h1>
          </div>

           <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed px-4">
            I create, coordinate & build AI systems that connect people. Specializing in self-hosted n8n automations, voice dispatchers, and high-converting cinematic video ads.
          </p>
        </div>

        {/* Interactive App Icon Grid */}
        <div className="relative z-10 grid grid-cols-4 gap-4 pt-10 w-full max-w-sm">
          <button onClick={() => setActiveModal('about')} className="flex flex-col items-center space-y-2 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-500/50 transition-all">
              <span className="text-2xl">👤</span>
            </div>
            <span className="text-[11px] font-semibold tracking-wide text-slate-300 group-hover:text-cyan-400">About Me</span>
          </button>

          <button onClick={() => setActiveModal('work')} className="flex flex-col items-center space-y-2 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-500/50 transition-all">
              <span className="text-2xl">💼</span>
            </div>
            <span className="text-[11px] font-semibold tracking-wide text-slate-300 group-hover:text-cyan-400">My Work</span>
          </button>

          <button onClick={() => setActiveModal('contact')} className="flex flex-col items-center space-y-2 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-500/50 transition-all">
              <span className="text-2xl">✉️</span>
            </div>
            <span className="text-[11px] font-semibold tracking-wide text-slate-300 group-hover:text-cyan-400">Contact me</span>
          </button>

          <button onClick={() => setActiveModal('book')} className="flex flex-col items-center space-y-2 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-950/80 to-slate-900/90 border border-cyan-500/40 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-400 transition-all">
              <span className="text-2xl">📅</span>
            </div>
            <span className="text-[11px] font-semibold tracking-wide text-cyan-300 group-hover:text-cyan-400">Book Call</span>
          </button>
        </div>

        {/* Live Clock & Status Bar */}
        <div className="relative z-10 w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl shadow-2xl mt-8 mb-4">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">LAGOS • UTC+1</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{timeString || '22:33'}</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-slate-300 font-medium">Open to work</span>
          </div>
        </div>

        {/* ================= MODAL WINDOWS ================= */}
        {activeModal && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            
            <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <h3 className="text-sm font-bold text-slate-200 capitalize">
                    {activeModal === 'about' && 'About Oyero'}
                    {activeModal === 'work' && 'Featured Work'}
                    {activeModal === 'contact' && 'Contact Me'}
                    {activeModal === 'book' && 'Book a 1-on-1 Strategy Call'}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  Close ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* ABOUT MODAL */}
                {activeModal === 'about' && (
                  <div className="space-y-5 text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-extrabold text-slate-950 shadow-lg shadow-cyan-500/30">
                        OI
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Oyero Ibrahim</h2>
                        <p className="text-xs text-cyan-400 font-medium">AI Automation Expert & Video Creator</p>
                        <p className="text-xs text-slate-500">Based in Nigeria • Remote Worldwide</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      I direct practical execution across digital channels, self-hosted automation backends, voice dispatch bots, and high-impact AI visual advertising campaigns.
                    </p>
                  </div>
                )}

                {/* WORK MODAL */}
                {activeModal === 'work' && (
                  <div className="space-y-4 text-left">
                    <div className="flex space-x-2 border-b border-slate-800 pb-3">
                      <button onClick={() => setWorkFilter('all')} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${workFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>All</button>
                      <button onClick={() => setWorkFilter('automation')} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${workFilter === 'automation' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>Automation</button>
                      <button onClick={() => setWorkFilter('video')} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${workFilter === 'video' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>Video Ads</button>
                    </div>

                    {loadingProjects ? (
                      <p className="text-center text-xs text-slate-500 py-8">Loading projects...</p>
                    ) : filteredProjects.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-8">No projects found.</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredProjects.map((project) => (
                          <a 
                            key={project.id} 
                            href={project.project_url || '#'} 
                            target={project.project_url ? "_blank" : "_self"}
                            className="block bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group cursor-pointer"
                          >
                            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                              <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              {project.project_url && (
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-xs text-white">
                                  ↗
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{project.title}</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{project.summary}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                 {/* CONTACT MODAL */}
                {activeModal === 'contact' && (
                  <div className="space-y-4 text-left">
                     <a href="https://linkedin.com/in/oyeroibrahim-ai-automation-expert" target="_blank" className="flex items-center justify-between p-4 bg-slate-800/70 border border-slate-700/50 rounded-2xl text-slate-200 text-xs font-semibold hover:border-cyan-500/50 transition-colors">
                      <span className="flex items-center space-x-3"><span className="text-lg">💼</span><span>Message me on LinkedIn</span></span><span className="text-cyan-400">→</span>
                    </a>
                    <a href="mailto:olaaiaautomationspecialist@gmail.com" className="flex items-center justify-between p-4 bg-slate-800/70 border border-slate-700/50 rounded-2xl text-slate-200 text-xs font-semibold hover:border-cyan-500/50 transition-colors">
                      <span className="flex items-center space-x-3"><span className="text-lg">✉️</span><span>Send me an email</span></span><span className="text-cyan-400">→</span>
                    </a>
                  </div>
                )}

                 {/* BOOK MODAL */}
                 {activeModal === 'book' && (
                  <div className="space-y-4 text-left">
                     <a href="mailto:olaaiaautomationspecialist@gmail.com?subject=Booking%20Automation%20Consultation" className="flex items-center justify-between p-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition-transform active:scale-95">
                      <span>Request Appointment via Email</span><span>📅 →</span>
                    </a>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </main>
    </>
  )
}
