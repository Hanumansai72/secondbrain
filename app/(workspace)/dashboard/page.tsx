"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Knowledge card types
interface KnowledgeCard {
  _id: string;
  Type: "link" | "note" | "insight";
  Title: string;
  des: string;
  tags: string[];
  createdAt: string;
}

const typeConfig: Record<string, { icon: string; color: string; hoverColor: string }> = {
  link: { icon: "🔗", color: "text-[#2b2bee]", hoverColor: "group-hover:text-[#2b2bee]" },
  note: { icon: "📝", color: "text-amber-500", hoverColor: "group-hover:text-amber-500" },
  insight: { icon: "💡", color: "text-emerald-500", hoverColor: "group-hover:text-emerald-500" },
};

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-10 h-2 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-3" />
      <div className="w-4/5 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-2" />
      <div className="w-3/5 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-4" />
      <div className="flex gap-2">
        <div className="w-12 h-5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-12 h-5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </div>
  );
}

function KnowledgeCardComponent({ card, index }: { card: KnowledgeCard; index: number }) {
  const config = typeConfig[card.Type] || typeConfig.note;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link href={`/knowledge/${card._id}`}>
        <div className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer h-full">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${config.color}`}>
              <span className="text-lg">{config.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{card.Type}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium uppercase">{formatTime(card.createdAt)}</span>
          </div>
          <h3 className={`font-bold text-slate-900 dark:text-slate-100 mb-2 ${config.hoverColor} transition-colors line-clamp-1`}>
            {card.Title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {card.des || "No description"}
          </p>
          <div className="flex flex-wrap gap-2">
            {card.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-semibold text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notes yet</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        Start capturing your thoughts, ideas, and insights. Your knowledge will appear here.
      </p>
      <Link
        href="/capture"
        className="px-6 py-3 bg-[#2b2bee] text-white font-bold rounded-xl shadow-lg shadow-[#2b2bee]/20 hover:scale-[1.02] transition-all"
      >
        Capture First Note
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<KnowledgeCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const userid = localStorage.getItem("userid") || sessionStorage.getItem("userid");

      if (!userid) {
        setError("Please login to view your notes");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/note?userid=${JSON.parse(userid)}`);
      const data = await res.json();

      if (data.success) {
        setNotes(data.notes);
      } else {
        setError(data.message || "Failed to fetch notes");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side search filtering
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.Title?.toLowerCase().includes(query) ||
        note.des?.toLowerCase().includes(query) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  // Get unique tags for display
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((note) => note.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).slice(0, 3);
  }, [notes]);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2b2bee] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#2b2bee]/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">Second Brain</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI Knowledge Hub</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2b2bee]/10 text-[#2b2bee] font-semibold">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-sm">Dashboard</span>
          </Link>

          <Link href="/ask" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">Ask AI</span>
          </Link>

          <Link href="/docs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">Docs</span>
          </Link>

          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Settings</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <Link
            href="/capture"
            className="w-full flex items-center justify-center gap-2 bg-[#2b2bee] hover:bg-[#2b2bee]/90 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#2b2bee]/20 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Knowledge
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
          <div className="relative w-full max-w-xl">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#2b2bee]/40 text-sm transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
              placeholder="Search your brain... (Cmd + K)"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2b2bee] to-[#6366f1] overflow-hidden border border-slate-300 dark:border-slate-600 flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-8">
          {/* Dashboard Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">Dashboard</h2>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {notes.length} Knowledge Items
              </span>
              {allTags.length > 0 && (
                <div className="flex gap-2">
                  {allTags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px] font-bold uppercase tracking-wider">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : filteredNotes.length > 0 ? (
              filteredNotes.map((card, index) => (
                <KnowledgeCardComponent key={card._id} card={card} index={index} />
              ))
            ) : notes.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                <p>No notes match &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

