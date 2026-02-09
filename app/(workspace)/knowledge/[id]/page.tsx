"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface NoteData {
    id: string;
    title: string;
    description: string;
    tags: string[];
    type: string;
    createdAt: string;
    updatedAt: string;
}

interface AISummary {
    summary: string;
    keyPoints: string[];
    aiGenerated: boolean;
}

export default function KnowledgeDetailPage() {
    const params = useParams();
    const [aiQuestion, setAiQuestion] = useState("");
    const [note, setNote] = useState<NoteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
    const [summarizing, setSummarizing] = useState(false);

    // Fetch note data on mount
    useEffect(() => {
        const fetchNote = async () => {
            if (!params.id) return;

            try {
                const res = await fetch(`/api/note/${params.id}`);
                const data = await res.json();

                if (data.success) {
                    setNote(data.note);
                    // If it's a link type, get AI summary
                    if (data.note.type === "link" && data.note.description) {
                        fetchAISummary(data.note.description);
                    }
                } else {
                    setError(data.message || "Failed to fetch note");
                }
            } catch (err) {
                console.error("Error fetching note:", err);
                setError("Failed to load note");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [params.id]);

    // Fetch AI summary for the description
    const fetchAISummary = async (text: string) => {
        setSummarizing(true);
        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });
            const data = await res.json();
            if (data.success) {
                setAiSummary({
                    summary: data.summary,
                    keyPoints: data.keyPoints || [],
                    aiGenerated: data.aiGenerated
                });
            }
        } catch (err) {
            console.error("Error fetching AI summary:", err);
        } finally {
            setSummarizing(false);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#2b2bee] border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500">Loading knowledge...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !note) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{error || "Note not found"}</h2>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#2b2bee] hover:underline">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col bg-white dark:bg-slate-900 text-[#1a1a1e] dark:text-gray-100 antialiased">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="bg-[#2b2bee] p-1.5 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">Second Brain</h2>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/dashboard" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">My Brain</Link>
                    <Link href="/capture" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Capture</Link>
                    <Link href="/settings" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Settings</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-[#2b2bee] transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#2b2bee] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all">
                        <span>Edit Note</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2b2bee] to-[#6366f1] overflow-hidden ring-2 ring-[#2b2bee]/20 flex items-center justify-center text-white font-bold text-sm">
                        JD
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full px-6 py-10 lg:flex gap-12">
                {/* Article Content */}
                <div className="lg:w-[70%] space-y-8">
                    {/* Article Header */}
                    <header className="space-y-6">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2b2bee]/80">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {note.type || "Note"}
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                            {note.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(note.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {note.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full border border-gray-200 dark:border-gray-700"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* AI Summary Section - Only for link types with summary */}
                    {note.type === "link" && (aiSummary || summarizing) && (
                        <section className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                            <div className="flex items-center gap-3 text-[#2b2bee]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <h3 className="font-bold text-lg">AI Insight Summary</h3>
                                {aiSummary?.aiGenerated && (
                                    <span className="px-2 py-0.5 bg-[#2b2bee]/10 text-[#2b2bee] text-[10px] font-bold rounded-full">AI GENERATED</span>
                                )}
                            </div>
                            {summarizing ? (
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="w-5 h-5 border-2 border-[#2b2bee] border-t-transparent rounded-full animate-spin" />
                                    <span>Generating AI summary...</span>
                                </div>
                            ) : aiSummary && (
                                <div className="text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
                                    <p>{aiSummary.summary}</p>
                                    {aiSummary.keyPoints.length > 0 && (
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none">
                                            {aiSummary.keyPoints.map((point, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-[#2b2bee] mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Note Content */}
                    <article className="text-gray-800 dark:text-gray-200 w-full text-lg leading-relaxed dark:bg-slate-900">
                        <div className="whitespace-pre-wrap">{note.description}</div>
                    </article>
                </div>

                {/* Sidebar */}
                <aside className="lg:w-[30%] mt-12 lg:mt-0">
                    <div className="lg:sticky lg:top-[100px] space-y-6" style={{ height: "calc(100vh - 120px)" }}>
                        {/* Ask AI Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col gap-4">
                            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                                <svg className="w-5 h-5 text-[#2b2bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Ask AI about this
                            </div>
                            <div className="relative">
                                <textarea
                                    value={aiQuestion}
                                    onChange={(e) => setAiQuestion(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-sm p-3 focus:ring-[#2b2bee] focus:border-[#2b2bee] resize-none h-24"
                                    placeholder="Ask a question about this knowledge..."
                                />
                                <button className="absolute bottom-2 right-2 bg-[#2b2bee] text-white p-1.5 rounded-lg hover:bg-[#4f46e5] transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Suggested Prompts</p>
                                <div className="flex flex-col gap-2">
                                    {["What are the key takeaways?", "Summarize this in simple terms", "What are the action items?"].map((prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() => setAiQuestion(prompt)}
                                            className="text-left text-xs p-2 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors"
                                        >
                                            &quot;{prompt}&quot;
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-[#2b2bee] transition-all group">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Export to Notion</span>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#2b2bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                            <button className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-400 transition-all group">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Archive Entry</span>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Mobile FAB */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <button className="w-14 h-14 bg-[#2b2bee] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
