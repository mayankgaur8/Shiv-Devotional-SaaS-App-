'use client'

import { useState } from 'react'

const mockDonations = [
  { id: 1, name: 'Ramesh Sharma', amount: 5100, purpose: 'Rudra Abhishek', time: '10:32 AM', avatar: 'RS' },
  { id: 2, name: 'Sunita Devi', amount: 1100, purpose: 'General Donation', time: '9:45 AM', avatar: 'SD' },
  { id: 3, name: 'Vikram Patel', amount: 11000, purpose: 'Mahashivratri Puja', time: '9:12 AM', avatar: 'VP' },
  { id: 4, name: 'Ananya Singh', amount: 2100, purpose: 'Daily Aarti Seva', time: '8:30 AM', avatar: 'AS' },
  { id: 5, name: 'Harish Gupta', amount: 500, purpose: 'Prasad Distribution', time: '8:05 AM', avatar: 'HG' },
]

const mockBookings = [
  { id: 1, name: 'Deepak Verma', service: 'Rudra Abhishek', date: 'Mon, 24 Feb', time: '6:00 AM', status: 'confirmed', amount: 2100 },
  { id: 2, name: 'Priya Nair', service: 'Laghu Rudra', date: 'Mon, 24 Feb', time: '7:00 AM', status: 'pending', amount: 5100 },
  { id: 3, name: 'Mohan Das', service: 'Maha Mrityunjaya', date: 'Tue, 25 Feb', time: '5:30 AM', status: 'confirmed', amount: 3100 },
  { id: 4, name: 'Kavita Joshi', service: 'Panchabhishek', date: 'Wed, 26 Feb', time: '6:30 AM', status: 'pending', amount: 7100 },
]

const mockDevotees = [
  { name: 'Ramesh Sharma', visits: 47, lastVisit: '2 days ago', seva: 'Abhishek', tier: 'Niyamit' },
  { name: 'Sunita Devi', visits: 112, lastVisit: 'Today', seva: 'Aarti', tier: 'Param Bhakt' },
  { name: 'Vikram Patel', visits: 23, lastVisit: '1 week ago', seva: 'Donation', tier: 'Sahayak' },
  { name: 'Ananya Singh', visits: 78, lastVisit: 'Yesterday', seva: 'Prasad', tier: 'Niyamit' },
]

type Tab = 'overview' | 'donations' | 'bookings' | 'devotees' | 'streaming'

export default function TemplePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [isLive, setIsLive] = useState(false)
  const [newDonation, setNewDonation] = useState({ name: '', amount: '', purpose: 'General Donation' })
  const [showDonationForm, setShowDonationForm] = useState(false)

  const totalToday = mockDonations.reduce((sum, d) => sum + d.amount, 0)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'donations', label: 'Donations', icon: '💰' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'devotees', label: 'Devotees', icon: '🙏' },
    { id: 'streaming', label: 'Live Aarti', icon: '📹' },
  ]

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🛕</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">B2B Temple Plan — ₹1999/month</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-bhasma-100">Temple SaaS Dashboard</h1>
          <p className="text-bhasma-600 text-sm mt-1">Shri Shiv Shankar Mandir, Varanasi</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl text-sm bg-white/5 text-bhasma-400 border border-white/10 hover:bg-white/10">
            ⚙️ Settings
          </button>
          <button className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-saffron-500 to-saffron-600 text-white saffron-glow">
            + New Seva
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-saffron-500 text-white saffron-glow'
                : 'bg-white/5 text-bhasma-400 hover:bg-white/10'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Aaj Ka Daan', value: `₹${totalToday.toLocaleString('en-IN')}`, change: '+23% vs yesterday', icon: '💰', color: 'from-green-500/20 to-emerald-600/20', border: 'border-green-500/30' },
              { label: 'Aaj Ki Bookings', value: '12', change: '4 pending confirmation', icon: '📅', color: 'from-blue-500/20 to-blue-700/20', border: 'border-blue-500/30' },
              { label: 'Niyamit Bhakt', value: '1,247', change: '+8 this week', icon: '🙏', color: 'from-saffron-500/20 to-saffron-700/20', border: 'border-saffron-500/30' },
              { label: 'Live Viewers', value: isLive ? '342' : '0', change: isLive ? 'Currently live' : 'Offline', icon: '📹', color: 'from-purple-500/20 to-purple-700/20', border: 'border-purple-500/30' },
            ].map((kpi, i) => (
              <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${kpi.color} border ${kpi.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{kpi.icon}</span>
                </div>
                <p className="text-2xl font-bold text-bhasma-100">{kpi.value}</p>
                <p className="text-xs text-bhasma-600 mt-1">{kpi.label}</p>
                <p className="text-xs text-bhasma-700 mt-0.5">{kpi.change}</p>
              </div>
            ))}
          </div>

          {/* Recent Donations + Upcoming Bookings side by side */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Recent Donations */}
            <div className="sacred-card rounded-2xl p-5 bg-white/2">
              <h3 className="text-sm font-bold text-bhasma-300 mb-4 flex items-center gap-2">
                <span>💰</span> Recent Donations
                <span className="ml-auto text-xs text-bhasma-600">Today</span>
              </h3>
              <div className="space-y-3">
                {mockDonations.slice(0, 4).map((d) => (
                  <div key={d.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {d.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-bhasma-200 font-medium truncate">{d.name}</p>
                      <p className="text-xs text-bhasma-600">{d.purpose} • {d.time}</p>
                    </div>
                    <p className="text-sm font-bold text-green-400">₹{d.amount.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('donations')}
                className="mt-4 w-full text-xs text-center text-bhasma-600 hover:text-saffron-400 transition-colors"
              >
                View all donations →
              </button>
            </div>

            {/* Upcoming Bookings */}
            <div className="sacred-card rounded-2xl p-5 bg-white/2">
              <h3 className="text-sm font-bold text-bhasma-300 mb-4 flex items-center gap-2">
                <span>📅</span> Upcoming Bookings
                <span className="ml-auto text-xs text-bhasma-600">Next 7 days</span>
              </h3>
              <div className="space-y-3">
                {mockBookings.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <div className="text-center bg-white/5 rounded-lg px-2 py-1 flex-shrink-0">
                      <p className="text-xs text-bhasma-400">{b.date.split(',')[0]}</p>
                      <p className="text-sm font-bold text-saffron-400">{b.time}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-bhasma-200 truncate">{b.name}</p>
                      <p className="text-xs text-bhasma-600">{b.service}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      b.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {b.status === 'confirmed' ? '✓ Set' : '⏳ Pending'}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="mt-4 w-full text-xs text-center text-bhasma-600 hover:text-saffron-400 transition-colors"
              >
                View all bookings →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Accept Donation', icon: '💰', action: () => setActiveTab('donations') },
              { label: 'New Booking', icon: '📅', action: () => setActiveTab('bookings') },
              { label: 'Go Live Aarti', icon: '📹', action: () => setActiveTab('streaming') },
              { label: 'Send Notification', icon: '🔔', action: () => {} },
            ].map((qa) => (
              <button
                key={qa.label}
                onClick={qa.action}
                className="sacred-card p-4 rounded-xl bg-white/3 text-center hover:border-saffron-500/30 transition-all"
              >
                <span className="text-2xl block mb-2">{qa.icon}</span>
                <p className="text-xs text-bhasma-400 font-medium">{qa.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DONATIONS TAB */}
      {activeTab === 'donations' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-bhasma-100">Daan Prabandhan</h2>
              <p className="text-bhasma-600 text-xs">Aaj ka kul daan: <span className="text-green-400 font-bold">₹{totalToday.toLocaleString('en-IN')}</span></p>
            </div>
            <button
              onClick={() => setShowDonationForm(!showDonationForm)}
              className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-saffron-500 to-saffron-600 text-white"
            >
              + Record Donation
            </button>
          </div>

          {showDonationForm && (
            <div className="sacred-card rounded-2xl p-5 mb-6 bg-white/3">
              <h3 className="text-sm font-bold text-bhasma-300 mb-4">New Donation Entry</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Devotee Name"
                  value={newDonation.name}
                  onChange={e => setNewDonation(p => ({ ...p, name: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-bhasma-200 placeholder-bhasma-700 outline-none focus:border-saffron-500/50"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={newDonation.amount}
                  onChange={e => setNewDonation(p => ({ ...p, amount: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-bhasma-200 placeholder-bhasma-700 outline-none focus:border-saffron-500/50"
                />
                <select
                  value={newDonation.purpose}
                  onChange={e => setNewDonation(p => ({ ...p, purpose: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-bhasma-200 outline-none focus:border-saffron-500/50"
                >
                  {['General Donation', 'Rudra Abhishek', 'Daily Aarti Seva', 'Prasad Distribution', 'Temple Renovation', 'Mahashivratri Fund'].map(p => (
                    <option key={p} value={p} className="bg-gray-900">{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-green-600 to-emerald-500 text-white">
                  ✅ Record & Print Receipt
                </button>
                <button className="px-4 py-2 rounded-xl text-sm bg-white/5 text-bhasma-400 hover:bg-white/10" onClick={() => setShowDonationForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {mockDonations.map((d) => (
              <div key={d.id} className="sacred-card flex items-center gap-4 p-4 rounded-xl bg-white/2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {d.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-bhasma-200">{d.name}</p>
                  <p className="text-xs text-bhasma-600">{d.purpose} • {d.time}</p>
                </div>
                <p className="text-lg font-bold text-green-400">₹{d.amount.toLocaleString('en-IN')}</p>
                <button className="text-xs text-bhasma-600 hover:text-saffron-400 transition-colors px-2 py-1 rounded bg-white/5">
                  Receipt
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-bhasma-100">Seva Booking Management</h2>
            <button className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-saffron-500 to-saffron-600 text-white">
              + New Booking
            </button>
          </div>

          {/* Services Offered */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { service: 'Rudra Abhishek', price: '₹2,100', duration: '60 min', slots: '3 left today' },
              { service: 'Laghu Rudra', price: '₹5,100', duration: '2 hrs', slots: '1 left today' },
              { service: 'Maha Mrityunjaya', price: '₹3,100', duration: '90 min', slots: '2 left today' },
              { service: 'Panchabhishek', price: '₹7,100', duration: '3 hrs', slots: 'Book tomorrow' },
            ].map((s) => (
              <div key={s.service} className="sacred-card rounded-xl p-4 bg-white/3">
                <p className="text-sm font-semibold text-bhasma-200 mb-1">{s.service}</p>
                <p className="text-saffron-400 font-bold text-sm">{s.price}</p>
                <p className="text-xs text-bhasma-600">{s.duration}</p>
                <p className="text-xs text-green-400 mt-1">{s.slots}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {mockBookings.map((b) => (
              <div key={b.id} className="sacred-card flex items-center gap-4 p-4 rounded-xl bg-white/2">
                <div className="text-center bg-white/5 rounded-xl px-3 py-2 flex-shrink-0">
                  <p className="text-xs text-bhasma-600">{b.date.split(',')[0]}</p>
                  <p className="text-sm font-bold text-saffron-400">{b.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-bhasma-200">{b.name}</p>
                  <p className="text-xs text-bhasma-600">{b.service} • ₹{b.amount.toLocaleString('en-IN')}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  b.status === 'confirmed'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {b.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                </span>
                {b.status === 'pending' && (
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-saffron-500 text-white hover:bg-saffron-400 transition-all">
                    Confirm
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEVOTEES TAB */}
      {activeTab === 'devotees' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-bhasma-100">Devotee Management (CRM)</h2>
              <p className="text-xs text-bhasma-600">1,247 registered bhakts</p>
            </div>
            <input
              type="text"
              placeholder="Search bhakts..."
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-bhasma-200 placeholder-bhasma-700 outline-none focus:border-saffron-500/50 w-48"
            />
          </div>

          <div className="space-y-3">
            {mockDevotees.map((d, i) => (
              <div key={i} className="sacred-card flex items-center gap-4 p-4 rounded-xl bg-white/2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neelkanth-500 to-neelkanth-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {d.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-bhasma-200">{d.name}</p>
                  <p className="text-xs text-bhasma-600">Preferred seva: {d.seva} • Last visit: {d.lastVisit}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-saffron-400">{d.visits}</p>
                  <p className="text-xs text-bhasma-700">visits</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  d.tier === 'Param Bhakt' ? 'bg-gold-500/20 text-gold-300' :
                  d.tier === 'Niyamit' ? 'bg-saffron-500/20 text-saffron-300' :
                  'bg-bhasma-800 text-bhasma-500'
                }`}>
                  {d.tier}
                </span>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-bhasma-500 hover:bg-white/10 hover:text-bhasma-300">
                  SMS/WhatsApp
                </button>
              </div>
            ))}
          </div>

          {/* Tier Explanation */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { tier: 'Param Bhakt', condition: '100+ visits', color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/20' },
              { tier: 'Niyamit', condition: '25-99 visits', color: 'text-saffron-400', bg: 'bg-saffron-500/10 border-saffron-500/20' },
              { tier: 'Sahayak', condition: '1-24 visits', color: 'text-bhasma-400', bg: 'bg-white/3 border-white/10' },
            ].map((t) => (
              <div key={t.tier} className={`rounded-xl p-3 border ${t.bg} text-center`}>
                <p className={`text-sm font-bold ${t.color}`}>{t.tier}</p>
                <p className="text-xs text-bhasma-600 mt-0.5">{t.condition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE AARTI TAB */}
      {activeTab === 'streaming' && (
        <div>
          <h2 className="text-lg font-bold text-bhasma-100 mb-6">Live Aarti Streaming</h2>

          {/* Stream Status */}
          <div className="sacred-card rounded-2xl p-6 mb-6 text-center"
            style={{ background: isLive ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(8,12,20,1))' : 'linear-gradient(135deg, rgba(30,58,95,0.1), rgba(8,12,20,1))' }}>
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl ${
              isLive ? 'bg-red-500/20 border-2 border-red-500 animate-pulse' : 'bg-white/5 border-2 border-white/10'
            }`}>
              {isLive ? '🔴' : '📹'}
            </div>
            <h3 className="text-xl font-bold text-bhasma-100 mb-1">
              {isLive ? 'LIVE — Sandhya Aarti' : 'Offline'}
            </h3>
            {isLive ? (
              <div className="mb-4">
                <p className="text-red-400 text-sm mb-1 font-medium">● LIVE • 342 viewers</p>
                <p className="text-bhasma-600 text-xs">Started 23 minutes ago</p>
              </div>
            ) : (
              <p className="text-bhasma-600 text-sm mb-4">Next: Sandhya Aarti at 7:00 PM</p>
            )}
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                isLive
                  ? 'bg-red-600 text-white hover:bg-red-500'
                  : 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white saffron-glow'
              }`}
            >
              {isLive ? '⏹️ End Stream' : '▶️ Go Live — Start Aarti'}
            </button>
          </div>

          {/* Scheduled Streams */}
          <h3 className="text-sm text-bhasma-500 uppercase tracking-widest mb-3">Scheduled Aartis</h3>
          <div className="space-y-2 mb-6">
            {[
              { name: 'Mangala Aarti', time: '5:00 AM', status: 'Daily', viewers: 89 },
              { name: 'Abhishek Darshan', time: '6:00 AM', status: 'Daily', viewers: 234 },
              { name: 'Madhyahn Aarti', time: '12:00 PM', status: 'Daily', viewers: 156 },
              { name: 'Sandhya Aarti', time: '7:00 PM', status: 'Daily', viewers: 512 },
              { name: 'Shayan Aarti', time: '9:30 PM', status: 'Daily', viewers: 178 },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-4 p-3 rounded-xl bg-white/3">
                <div className="text-center w-16">
                  <p className="text-xs font-bold text-saffron-400">{s.time}</p>
                  <p className="text-xs text-bhasma-700">{s.status}</p>
                </div>
                <p className="flex-1 text-sm text-bhasma-300">{s.name}</p>
                <p className="text-xs text-bhasma-600">avg {s.viewers} viewers</p>
                <button className="text-xs px-2 py-1 rounded bg-saffron-500/20 text-saffron-400 hover:bg-saffron-500/30">
                  Edit
                </button>
              </div>
            ))}
          </div>

          {/* Integration Info */}
          <div className="rounded-xl p-4 bg-purple-500/5 border border-purple-500/20">
            <p className="text-xs text-purple-400 font-semibold mb-2">📺 Stream Integration</p>
            <p className="text-xs text-bhasma-600 mb-3">Connect your streaming platform:</p>
            <div className="flex gap-2 flex-wrap">
              {['YouTube Live', 'Facebook Live', 'Custom RTMP', 'App-native'].map(platform => (
                <span key={platform} className="text-xs px-3 py-1 rounded-full bg-white/5 text-bhasma-500 border border-white/10">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
