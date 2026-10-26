'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Form states
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('automation')
  const [summary, setSummary] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [projectUrl, setProjectUrl] = useState('')

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase?.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase?.from('projects').insert([
      { title, category, summary, cover_url: coverUrl, project_url: projectUrl }
    ])
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Project published live! 🎉')
      setTitle(''); setSummary(''); setCoverUrl(''); setProjectUrl('');
    }
    setLoading(false)
  }

  // LOGIN SCREEN
  if (!session) {
    return (
      <>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-4">
          <form onSubmit={handleLogin} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-xl mx-auto mb-2">🔒</div>
            <h1 className="text-2xl font-bold text-white text-center">Admin Login</h1>
            {message && <p className="text-rose-500 text-xs text-center bg-rose-500/10 p-2 rounded-lg">{message}</p>}
            
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-cyan-500 text-sm" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-cyan-500 text-sm" required />
            
            <button type="submit" disabled={loading} className="w-full p-3 bg-cyan-500 text-slate-950 font-bold rounded-xl mt-4 active:scale-95 transition-transform">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </>
    )
  }

  // SECURE DASHBOARD
  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <div className="min-h-screen bg-[#0A0D14] text-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h1 className="text-xl font-bold text-cyan-400">Portfolio Admin</h1>
            <button onClick={() => supabase?.auth.signOut()} className="text-xs font-bold bg-slate-800 px-3 py-2 rounded-lg text-slate-300">Logout</button>
          </div>

          {/* PROJECT UPLOAD PORTAL */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-bold mb-1">Upload New Project</h2>
            <p className="text-xs text-slate-400 mb-6">Projects added here instantly show up on your live site. To add a background video, paste an .mp4 link in the URL box below!</p>
            
            {message && <p className="text-emerald-400 font-bold text-xs mb-4 bg-emerald-400/10 p-2 rounded-lg text-center">{message}</p>}
            
            <form onSubmit={handleAddProject} className="space-y-4">
              <input type="text" placeholder="Project Title (e.g. Real Estate AI Bot)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm" required />
              
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm">
                <option value="automation">Category: AI Automation</option>
                <option value="video">Category: AI Video Ads</option>
              </select>

              <textarea placeholder="Write a short summary about what you built..." value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm h-24" required />
              
              <input type="url" placeholder="Cover Image URL (Link to an image)" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm" required />
              
              <input type="url" placeholder="Optional: Project Link OR .mp4 Video URL" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm" />
              
              <button type="submit" disabled={loading} className="w-full p-3 bg-cyan-500 text-slate-950 font-bold rounded-xl mt-2 active:scale-95 transition-transform">
                {loading ? 'Publishing...' : 'Publish Project Live'}
              </button>
            </form>
          </div>

          {/* EDIT INSTRUCTIONS */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
             <h2 className="text-sm font-bold text-white mb-2">How to edit text sections?</h2>
             <p className="text-xs text-slate-400 leading-relaxed">
               For maximum speed and security, your "About Me", Contact info, and bio are coded directly into the frontend. To edit those words, open <b>app/page.tsx</b> on your GitHub and type your new text directly in the file!
             </p>
          </div>

        </div>
      </div>
    </>
  )
}
