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
  const [currentVideoSrc, setCurrentVideoSrc] = useState('')

  // Video Playlist for Random Motion Background
  const bgVideos = [
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-nodes-42790-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-42938-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-purple-and-blue-glowing-particles-41584-large.mp4'
  ]

  // Pick a random ambient video background on load
  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * bgVideos.length)
    setCurrentVideoSrc(bgVideos[randomIdx])
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

  // Fetch Projects from Supabase
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
      } else {
        setProjects([
          {
            id: '1',
            title: 'n8n Workflow Engine & MCP Bridge',
            category: 'automation',
            summary: 'Self-hosted n8n backend on AWS EC2 with custom webhooks & MCP AI integrations.',
            description: 'Deploys event-driven lead qualification, automated data ingestion pipelines, and CRM webhooks for high-conversion sales funnels.',
            cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            project_url: 'https://github.com/Oye96'
          },
          {
            id: '2',
            title: 'Vapi Conversational Voice AI Agent',
            category: 'automation',
            summary: 'Automated 24/7 inbound voice dispatcher with emergency call routing.',
            description: 'Custom system prompts, real-time function calling, tool schemas, and webhook dispatch tailored for UK & global service businesses.',
            cover_url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80',
            project_url: 'https://github.com/Oye96'
          },
          {
            id: '3',
            title: 'Veo3 & ElevenLabs Cinematic AI Video Ads',
            category: 'video',
            summary: '9:16 vertical motion graphics & commercial ads engineered for viral conversion.',
            description: 'Multi-scene AI video direction using Veo3, Google Vids, and custom voiceover synthesis for automobile dealerships and real estate brands.',
            cover_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
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
      {/* THIS SCRIPT FORCES THE CSS STYLING TO WORK IMMEDIATELY */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      <main className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden">
        
        {/* Background Video Layer */}
        {currentVideoSrc && (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none scale-105"
          >
            <source src={currentVideoSrc} type="video/mp4" />
          </video>
        )}

        {/* Dark Overlay Tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0A0D14]/80 to-[#0A0D14] pointer-events-none" />

        {/* Ambient Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Bar Header */}
        <div className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between py-2 px-1">
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

        {/* Center Interactive Bento Hub */}
        <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-8 flex flex-col items-center text-center space-y-6">
          
          {/* Category Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wider uppercase">
              AI Automation
            </span>
            <span className="bg-purple-950/60 text-purple-400 border border-purple-800/50 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wider uppercase">
              AI Video Ads
            </span>
            <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wider uppercase">
              Voice Agents
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hi, I'm Ibrahim.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              I create, coordinate & build AI systems that connect people.
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed">
            Specializing in self-hosted n8n automations, conversational Vapi Voice dispatchers, and high-converting cinematic video ads.
          </p>

          {/* CTA Button */}
          <button 
            onClick={() => setActiveModal('work')}
            className="group flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3 rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-200 active:scale-95"
          >
            <span>See my work</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          {/* Interactive App Icon Grid */}
          <div className="grid grid-cols-4 gap-4 pt-6 w-full max-w-sm">
            
            {/* App 1: About Me */}
            <button 
              onClick={() => setActiveModal('about')}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-500/50 transition-all">
                <span className="text-2xl">👤</span>
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-cyan-400">About Me</span>
            </button>

            {/* App 2: My Work */}
            <button 
              onClick={() => setActiveModal('work')}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-500/50 transition-all">
                <span className="text-2xl">💼</span>
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-cyan-400">My Work</span>
            </button>

            {/* App 3: Contact Me */}
            <button 
              onClick={() => setActiveModal('contact')}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-500/50 transition-all">
                <span className="text-2xl">✉️</span>
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-cyan-400">Contact me</span>
            </button>

            {/* App 4: Book Appointment */}
            <button 
              onClick={() => setActiveModal('book')}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-950/80 to-slate-900/90 border border-cyan-500/40 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                <span className="text-2xl">📅</span>
              </div>
              <span className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-400">Book Call</span>
            </button>

          </div>

          {/* Live Clock & Status Bar */}
          <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl shadow-2xl mt-4">
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">LAGOS • UTC+1</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{timeString || '22:33'}</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-slate-300 font-medium">Open to work</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="relative z-10 w-full text-center py-2 text-xs text-slate-500">
          © {new Date().getFullYear()} Oyero Ibrahim. Built with Next.js, Supabase & Vercel.
        </footer>

        {/* ================= MODAL WINDOWS ================= */}
        {activeModal && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            
            <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
              
              {/* Modal Top Header */}
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

              {/* Modal Body Content */}
              <div className="p-6 overflow-y-auto space-y-6">

                {/* ABOUT MODAL */}
                {activeModal === 'about' && (
                  <div className="space-y-5 text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl font-bold text-cyan-400">
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

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Capabilities</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-slate-300">
                          ⚡ Self-hosted n8n & Docker
                        </div>
                        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-slate-300">
                          🎙️ Vapi Voice AI Agents
                        </div>
                        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-slate-300">
                          🎬 Veo3 & AI Motion Graphics
                        </div>
                        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-slate-300">
                          🐍 Python & Webhook Funnels
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* WORK MODAL */}
                {activeModal === 'work' && (
                  <div className="space-y-4 text-left">
                    <div className="flex space-x-2 border-b border-slate-800 pb-3">
                      <button 
                        onClick={() => setWorkFilter('all')}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${workFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        All Projects
                      </button>
                      <button 
                        onClick={() => setWorkFilter('automation')}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${workFilter === 'automation' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        AI Automation
                      </button>
                      <button 
                        onClick={() => setWorkFilter('video')}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${workFilter === 'video' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        AI Video Ads
                      </button>
                    </div>

                    {loadingProjects ? (
                      <p className="text-center text-xs text-slate-500 py-8">Loading projects from Supabase...</p>
                    ) : filteredProjects.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-8">No projects found in this category.</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredProjects.map((project) => (
                          <div key={project.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-colors">
                            <img 
                              src={project.cover_url} 
                              alt={project.title} 
                              className="w-full h-36 object-cover rounded-xl border border-slate-800"
                            />
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-base">{project.title}</h4>
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-md">
                                {project.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{project.summary}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* CONTACT MODAL */}
                {activeModal === 'contact' && (
                  <div className="space-y-4 text-left">
                    <h3 className="text-lg font-bold text-white">Have something in mind?</h3>
                    <p className="text-xs text-slate-400">
                      I'd love to hear about your next project, automation pipeline, or video campaign. Find me on the platform that works best for you.
                    </p>

                    <div className="space-y-2 pt-2">
                      <a 
                        href="https://linkedin.com/in/oyeroibrahim-ai-automation-expert" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 rounded-2xl text-slate-200 text-xs font-semibold transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">💼</span>
                          <span>Message me on LinkedIn</span>
                        </div>
                        <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                      </a>

                      <a 
                        href="mailto:olaaiaautomationspecialist@gmail.com" 
                        className="flex items-center justify-between p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 rounded-2xl text-slate-200 text-xs font-semibold transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">✉️</span>
                          <span>Send me an email</span>
                        </div>
                        <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                      </a>

                      <a 
                        href="https://github.com/Oye96" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 rounded-2xl text-slate-200 text-xs font-semibold transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">💻</span>
                          <span>Follow me on GitHub</span>
                        </div>
                        <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* BOOK APPOINTMENT MODAL */}
                {activeModal === 'book' && (
                  <div className="space-y-4 text-left">
                    <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/30 rounded-2xl p-4">
                      <h3 className="font-bold text-white text-base">Let's discuss system details 🤝</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Book a 15-min or 30-min strategy call to review your automation roadmap, voice AI dispatcher setup, or video ad direction.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <a 
                        href="mailto:olaaiaautomationspecialist@gmail.com?subject=Booking%20Automation%20Consultation"
                        className="flex items-center justify-between p-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
                      >
                        <span>Request Appointment via Email</span>
                        <span>📅 →</span>
                      </a>

                      <a 
                        href="https://linkedin.com/in/oyeroibrahim-ai-automation-expert" 
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl text-xs font-bold transition-all"
                      >
                        <span>Schedule via LinkedIn Direct Message</span>
                        <span>💬 →</span>
                      </a>
                    </div>
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
