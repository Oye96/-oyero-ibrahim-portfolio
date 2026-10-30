'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null

interface Project {
  id: string; title: string; category: string; summary: string; cover_url: string; project_url?: string;
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [introText, setIntroText] = useState('')
  const introMessage = `Hello. Here's what your browser just told me:\n\n> Initializing AI Systems...\n> Status: Secure Connection\n> Booting n8n Automation Workflows...\n> Rendering Cinematic Video Engines...\n\nWelcome to Oyero Ibrahim's Portfolio.`

  const [activeModal, setActiveModal] = useState<'about' | 'work' | 'contact' | 'book' | null>(null)
  const [workFilter, setWorkFilter] = useState<'all' | 'automation' | 'video'>('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [timeString, setTimeString] = useState('')
  const [bgVideoSrc, setBgVideoSrc] = useState<string | null>(null)
  
  // Terminal Typing Effect
  useEffect(() => {
    let i = 0
    if (!showIntro) return
    const typingInterval = setInterval(() => {
      if (i < introMessage.length) {
        setIntroText(introMessage.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => setShowIntro(false), 2200)
      }
    }, 40)
    return () => clearInterval(typingInterval)
  }, [showIntro])

  // Live Lagos Clock
  useEffect(() => {
    const updateTime = () => {
      setTimeString(new Intl.DateTimeFormat([], { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()))
    }
    updateTime()
    const timer = setInterval(updateTime, 10000)
    return () => clearInterval(timer)
  }, [])

  // Fetch Projects & Video
  useEffect(() => {
    async function fetchProjects() {
      if (!supabase) return
      setLoadingProjects(true)
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setProjects(data)
        const videoProjects = data.filter(p => p.project_url && p.project_url.includes('.mp4'))
        if (videoProjects.length > 0) {
          setBgVideoSrc(videoProjects[Math.floor(Math.random() * videoProjects.length)].project_url || null)
        } else {
          setBgVideoSrc('https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-nodes-42790-large.mp4')
        }
      } else {
        setBgVideoSrc('https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-nodes-42790-large.mp4')
      }
      setLoadingProjects(false)
    }
    fetchProjects()
  }, [])

  const filteredProjects = workFilter === 'all' ? projects : projects.filter(p => p.category === workFilter)

  return (
    <>
      {/* CSS ENGINE - LOADED IMMEDIATELY SO IT NEVER BREAKS */}
      <script src="https://cdn.tailwindcss.com"></script>
      
      {/* JUICY CUSTOM ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes elasticPop {
          0% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          75% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes splashJuice {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; filter: blur(10px); border-radius: 50%; }
          50% { transform: scale(1.1) rotate(5deg); opacity: 1; filter: blur(0px); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          75% { transform: scale(0.95) rotate(-2deg); border-radius: 50%; }
          100% { transform: scale(1) rotate(0); border-radius: 50%; }
        }
        .animate-elastic { animation: elasticPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-splash { animation: splashJuice 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />

      {/* TERMINAL SCREEN */}
      {showIntro ? (
        <div 
          className="fixed inset-0 z-[9999] bg-black text-[#00FF41] font-mono p-6 flex flex-col justify-center items-start cursor-pointer"
          onClick={() => setShowIntro(false)}
        >
          <div className="w-full max-w-xl mx-auto space-y-4">
            <pre className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
              {introText}<span className="animate-pulse">_</span>
            </pre>
            <div className="absolute bottom-10 left-0 w-full text-center opacity-50 animate-pulse text-xs text-slate-400">
              Tap anywhere to skip
            </div>
          </div>
        </div>
      ) : (

      /* MAIN APP INTERFACE */
      <main className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col items-center p-4 md:p-8 font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden">
        
        {bgVideoSrc && (
          <video key={bgVideoSrc} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none scale-105">
            <source src={bgVideoSrc} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D14]/90 via-[#0A0D14]/70 to-[#0A0D14] pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl flex items-center justify-between py-2 px-1 mb-8 mt-2 animate-elastic">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-lg shadow-cyan-500/20">OI</div>
            <span className="font-semibold tracking-wide text-sm text-slate-300">Oyero Ibrahim</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">Available for Hire</span>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center space-y-6 mt-2">
          {/* SPLASH ANIMATION AVATAR */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 animate-splash shadow-2xl shadow-cyan-500/40">
            <div className="absolute inset-1 bg-slate-950 rounded-full flex items-center justify-center z-10">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">OI</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight mt-6 animate-elastic" style={{animationDelay: '0.1s'}}>
             Welcome to my <span className="text-cyan-400">Portfolio</span>
          </h1>

          {/* EDIT YOUR HERO TEXT HERE */}
           <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed px-4 animate-elastic" style={{animationDelay: '0.2s'}}>
            I create, coordinate & build AI systems that connect people. Specializing in self-hosted n8n automations, voice dispatchers, and high-converting cinematic video ads.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-4 pt-10 w-full max-w-sm">
          {[ 
            { id: 'about', icon: '👤', label: 'About Me' },
            { id: 'work', icon: '💼', label: 'My Work' },
            { id: 'contact', icon: '✉️', label: 'Contact me' },
            { id: 'book', icon: '📅', label: 'Book Call', color: 'text-cyan-300' }
          ].map((app, index) => (
            <button key={app.id} onClick={() => setActiveModal(app.id as any)} className="flex flex-col items-center space-y-2 group active:scale-75 transition-all duration-300 animate-elastic" style={{animationDelay: \`\${0.3 + (index * 0.1)}s\`}}>
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:-translate-y-3 group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/40 group-active:scale-90 transition-all duration-300">
                <span className="text-2xl group-hover:scale-110 transition-transform">{app.icon}</span>
              </div>
              <span className={`text-[11px] font-semibold tracking-wide ${app.color || 'text-slate-300'} group-hover:text-cyan-400 transition-colors`}>{app.label}</span>
            </button>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-3xl p-4 flex items-center justify-between backdrop-blur-xl shadow-2xl mt-8 mb-4 hover:border-slate-700 transition-colors animate-elastic" style={{animationDelay: '0.6s'}}>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">LAGOS • UTC+1</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{timeString || '22:33'}</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-slate-300 font-medium">Open to work</span>
          </div>
        </div>

        {/* ELASTIC POPUP MODALS */}
        {activeModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative animate-elastic">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-200 capitalize">
                    {activeModal === 'about' && 'About Oyero'}
                    {activeModal === 'work' && 'Featured Work'}
                    {activeModal === 'contact' && 'Contact Me'}
                    {activeModal === 'book' && 'Book a Strategy Call'}
                  </h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full transition-colors active:scale-75 duration-200">
                  Close ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-slate-900 to-[#0A0D14]">
                
                {activeModal === 'about' && (
                  <div className="space-y-5 text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-extrabold text-slate-950 shadow-lg shadow-cyan-500/30 animate-splash">OI</div>
                      <div>
                        {/* EDIT YOUR ABOUT INFO HERE */}
                        <h2 className="text-xl font-bold text-white">Oyero Ibrahim</h2>
                        <p className="text-xs text-cyan-400 font-medium">AI Automation Expert & Video Creator</p>
                        <p className="text-xs text-slate-500">Based in Nigeria • Remote Worldwide</p>
                      </div>
                    </div>
                    {/* EDIT YOUR BIO TEXT HERE */}
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                      I direct practical execution across digital channels, self-hosted automation backends, voice dispatch bots, and high-impact AI visual advertising campaigns.
                    </p>
                  </div>
                )}

                {activeModal === 'work' && (
                  <div className="space-y-4 text-left">
                    <div className="flex space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
                      <button onClick={() => setWorkFilter('all')} className={`text-xs px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap active:scale-90 ${workFilter === 'all' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>All</button>
                      <button onClick={() => setWorkFilter('automation')} className={`text-xs px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap active:scale-90 ${workFilter === 'automation' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Automation</button>
                      <button onClick={() => setWorkFilter('video')} className={`text-xs px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap active:scale-90 ${workFilter === 'video' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Video Ads</button>
                    </div>

                    {loadingProjects ? (
                      <div className="flex justify-center py-8"><span className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></span></div>
                    ) : filteredProjects.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-8">No projects found.</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredProjects.map((project) => (
                          <a key={project.id} href={project.project_url || '#'} target={project.project_url ? "_blank" : "_self"} className="block bg-slate-950/60 border border-slate-800 rounded-3xl p-4 space-y-3 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group cursor-pointer hover:-translate-y-2 active:scale-95 shadow-lg hover:shadow-cyan-500/20">
                            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                              <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                              {project.project_url && <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-full text-xs text-white group-hover:scale-110 transition-transform">↗</div>}
                            </div>
                            <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{project.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{project.summary}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeModal === 'contact' && (
                  <div className="space-y-3 text-left">
                     {/* EDIT LINKEDIN URL HERE */}
                     <a href="https://linkedin.com/in/oyeroibrahim-ai-automation-expert" target="_blank" className="flex items-center justify-between p-5 bg-slate-800/70 border border-slate-700/50 rounded-3xl text-slate-200 text-sm font-semibold hover:border-cyan-500/50 hover:-translate-y-2 active:scale-95 transition-all group shadow-lg hover:shadow-cyan-500/20">
                      <span className="flex items-center space-x-4"><span className="text-2xl group-hover:scale-125 transition-transform duration-300">💼</span><span>Message me on LinkedIn</span></span><span className="text-cyan-400 group-hover:translate-x-2 transition-transform">→</span>
                    </a>
                     {/* EDIT EMAIL URL HERE */}
                    <a href="mailto:olaaiaautomationspecialist@gmail.com" className="flex items-center justify-between p-5 bg-slate-800/70 border border-slate-700/50 rounded-3xl text-slate-200 text-sm font-semibold hover:border-cyan-500/50 hover:-translate-y-2 active:scale-95 transition-all group shadow-lg hover:shadow-cyan-500/20">
                      <span className="flex items-center space-x-4"><span className="text-2xl group-hover:scale-125 transition-transform duration-300">✉️</span><span>Send me an email</span></span><span className="text-cyan-400 group-hover:translate-x-2 transition-transform">→</span>
                    </a>
                  </div>
                )}

                 {activeModal === 'book' && (
                  <div className="space-y-4 text-left">
                     {/* EDIT BOOKING URL HERE */}
                     <a href="mailto:olaaiaautomationspecialist@gmail.com?subject=Booking%20Automation%20Consultation" className="flex items-center justify-between p-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-3xl text-sm font-bold shadow-xl shadow-cyan-500/30 transition-all hover:-translate-y-2 active:scale-90 group">
                      <span>Request Appointment via Email</span><span className="group-hover:translate-x-2 transition-transform">📅 →</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      )}
    </>
  )
}
