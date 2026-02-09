'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('architecture');

    const sections = [
        { id: 'architecture', label: 'Architecture', icon: '🏗️' },
        { id: 'ux-principles', label: 'UX Principles', icon: '🎨' },
        { id: 'agent-thinking', label: 'Agent Thinking', icon: '🤖' },
        { id: 'api', label: 'API Reference', icon: '📡' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#2b2bee] rounded-lg flex items-center justify-center text-white font-bold">
                            🧠
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">Second Brain</span>
                        <span className="text-slate-400 dark:text-slate-500 ml-2">/ Documentation</span>
                    </Link>
                    <Link href="/dashboard" className="text-sm text-[#2b2bee] hover:underline">
                        Back to App →
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-12 flex gap-8">
                {/* Sidebar */}
                <aside className="w-64 shrink-0 hidden lg:block">
                    <nav className="sticky top-24 space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${activeSection === section.id
                                        ? 'bg-[#2b2bee]/10 text-[#2b2bee] dark:bg-[#2b2bee]/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span>{section.icon}</span>
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    {/* Architecture Section */}
                    {activeSection === 'architecture' && (
                        <section className="space-y-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                    🏗️ Portable Architecture
                                </h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">
                                    Second Brain follows a layered architecture with clear separation of concerns, making components swappable at each layer.
                                </p>
                            </div>

                            {/* Architecture Diagram */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                                <pre className="text-sm text-slate-600 dark:text-slate-300 font-mono overflow-x-auto">
                                    {`┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│    Next.js Pages • React Components • Tailwind CSS          │
├─────────────────────────────────────────────────────────────┤
│                     APPLICATION LAYER                        │
│         API Routes • Business Logic • Validation            │
├─────────────────────────────────────────────────────────────┤
│                        AI LAYER                              │
│    Gemini Integration • Summarization • Auto-tagging        │
├─────────────────────────────────────────────────────────────┤
│                       DATA LAYER                             │
│       MongoDB • Mongoose Models • Connection Pooling        │
└─────────────────────────────────────────────────────────────┘`}
                                </pre>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Swappable Components</h2>

                            <div className="grid gap-4">
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/30 text-green-600 text-xs flex items-center justify-center">DB</span>
                                        Database Layer
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        MongoDB via Mongoose ODM. Can be swapped to PostgreSQL with Prisma by updating the models and connection logic.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs flex items-center justify-center">AI</span>
                                        AI Provider
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        Currently using Google Gemini. AI calls are isolated in /api/extract and /api/summarize routes. Can easily swap to OpenAI or Claude.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs flex items-center justify-center">🔐</span>
                                        Authentication
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        Custom session management using localStorage/sessionStorage. Can integrate NextAuth.js or Auth0 for OAuth support.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* UX Principles Section */}
                    {activeSection === 'ux-principles' && (
                        <section className="space-y-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                    🎨 UX Design Principles
                                </h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">
                                    Five core principles that guide every design decision in Second Brain.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl border-2 border-[#2b2bee]/20 bg-[#2b2bee]/5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">1️⃣</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Progressive Disclosure</h3>
                                    </div>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Information is revealed gradually. Dashboard shows summaries; full details appear on click. AI features are optional enhancements, never blockers.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl border-2 border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">2️⃣</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Immediate Feedback</h3>
                                    </div>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Every action provides instant feedback. Toast notifications, loading spinners, and micro-animations ensure users never wonder "did that work?"
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">3️⃣</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consistent Visual Language</h3>
                                    </div>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Primary color #2b2bee, Geist typography, 4px grid spacing, rounded-xl corners. Every element follows the same design tokens.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl border-2 border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-900/10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">4️⃣</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Graceful Degradation</h3>
                                    </div>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        AI features have fallbacks. If Gemini is unavailable, the app still functions with manual tagging and text snippets instead of AI summaries.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800/50 bg-cyan-50 dark:bg-cyan-900/10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">5️⃣</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mobile-First Responsiveness</h3>
                                    </div>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Layouts adapt from desktop to mobile. Touch targets are appropriately sized. Navigation collapses intelligently on smaller screens.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Agent Thinking Section */}
                    {activeSection === 'agent-thinking' && (
                        <section className="space-y-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                    🤖 Agent Thinking
                                </h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">
                                    Automation that maintains and improves the system over time.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-800/50">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="text-2xl">🏷️</span>
                                        Auto-Tagging Agent
                                    </h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        When content is captured from URLs, AI analyzes the content and automatically suggests relevant tags. Users can accept, modify, or remove suggestions.
                                    </p>
                                    <code className="mt-3 block text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                                        POST /api/extract → AI analyzes → Returns suggested tags
                                    </code>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800/50">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="text-2xl">📄</span>
                                        Content Extraction Agent
                                    </h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Paste any URL and the agent fetches the page, extracts readable content, identifies key points, and generates a concise summary—all automatically.
                                    </p>
                                    <code className="mt-3 block text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                                        URL Input → Fetch → Parse → AI Summary → Structured Output
                                    </code>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-200 dark:border-orange-800/50">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="text-2xl">📝</span>
                                        Summarization Agent
                                    </h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Long-form content is automatically summarized for quick scanning. Summaries are stored alongside original content for fast retrieval.
                                    </p>
                                    <code className="mt-3 block text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                                        POST /api/summarize → Gemini AI → Concise summary + key points
                                    </code>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Future Agent Capabilities</h3>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2b2bee]"></span>
                                        Knowledge graph connections between related notes
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2b2bee]"></span>
                                        Duplicate detection and merge suggestions
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2b2bee]"></span>
                                        Periodic review reminders for stale content
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2b2bee]"></span>
                                        Conversational chat interface for querying
                                    </li>
                                </ul>
                            </div>
                        </section>
                    )}

                    {/* API Section */}
                    {activeSection === 'api' && (
                        <section className="space-y-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                    📡 API Reference
                                </h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">
                                    RESTful API endpoints for integrating with Second Brain.
                                </p>
                            </div>

                            {/* Public API */}
                            <div className="p-6 rounded-2xl border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">PUBLIC</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Query Knowledge Base</h3>
                                </div>
                                <code className="mt-3 block text-sm bg-white dark:bg-slate-800 p-3 rounded-lg">
                                    GET /api/public/brain/query
                                </code>
                                <div className="mt-4 space-y-2 text-sm">
                                    <p className="font-medium text-slate-700 dark:text-slate-300">Query Parameters:</p>
                                    <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                                        <li><code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">q</code> - Search query (optional)</li>
                                        <li><code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">limit</code> - Max results, default 10 (optional)</li>
                                        <li><code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">type</code> - Filter by note/link/insight (optional)</li>
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">Example Response:</p>
                                    <pre className="mt-2 text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                                        {`{
  "success": true,
  "query": "programming",
  "results": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "JavaScript Best Practices",
      "summary": "Key patterns for writing...",
      "tags": ["programming", "javascript"],
      "type": "note"
    }
  ],
  "count": 1
}`}
                                    </pre>
                                </div>
                            </div>

                            {/* Notes API */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notes Endpoints</h3>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">GET</span>
                                        <code className="text-sm text-slate-600 dark:text-slate-300">/api/note</code>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Fetch all notes for authenticated user</p>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">POST</span>
                                        <code className="text-sm text-slate-600 dark:text-slate-300">/api/note</code>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Create a new note</p>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">GET</span>
                                        <code className="text-sm text-slate-600 dark:text-slate-300">/api/note/[id]</code>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Fetch single note by ID</p>
                                </div>
                            </div>

                            {/* AI API */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Endpoints</h3>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">POST</span>
                                        <code className="text-sm text-slate-600 dark:text-slate-300">/api/extract</code>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Extract content from URL with AI analysis</p>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">POST</span>
                                        <code className="text-sm text-slate-600 dark:text-slate-300">/api/summarize</code>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-500">Generate AI summary for text content</p>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
