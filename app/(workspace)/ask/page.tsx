'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    timestamp: Date;
}

interface Source {
    id: string;
    title: string;
    snippet: string;
    type: string;
}

const suggestedQuestions = [
    "What have I learned about productivity?",
    "Summarize my notes on technology",
    "What are my key insights?",
    "Find notes about learning",
];

export default function AskPage() {
    const toast = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e?: React.FormEvent, customMessage?: string) => {
        e?.preventDefault();
        const messageText = customMessage || input.trim();

        if (!messageText || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const userId = localStorage.getItem('userid') || sessionStorage.getItem('userid');

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    userId: userId ? JSON.parse(userId) : null,
                }),
            });

            const data = await res.json();

            if (data.success) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.response,
                    sources: data.sources,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                toast.error(data.message || 'Failed to get response');
            }
        } catch (err) {
            console.error('Chat error:', err);
            toast.error('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
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
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                        </svg>
                        <span className="text-sm">Dashboard</span>
                    </Link>

                    <Link href="/ask" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2b2bee]/10 text-[#2b2bee] font-semibold">
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

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2b2bee] to-[#6366f1] flex items-center justify-center text-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white">Ask Your Brain</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Query your knowledge base with AI</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMessages([])}
                        className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Clear Chat
                    </button>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2b2bee]/20 to-[#6366f1]/20 flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-[#2b2bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Ask Anything
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                                Query your knowledge base using natural language. I'll search through your notes and provide answers with sources.
                            </p>

                            {/* Suggested Questions */}
                            <div className="grid grid-cols-2 gap-3 max-w-lg">
                                {suggestedQuestions.map((question, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleSubmit(undefined, question)}
                                        className="p-4 text-left text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#2b2bee]/50 hover:shadow-md transition-all group"
                                    >
                                        <span className="text-slate-600 dark:text-slate-300 group-hover:text-[#2b2bee]">
                                            {question}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2b2bee] to-[#6366f1] flex items-center justify-center text-white shrink-0">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                                            <div
                                                className={`p-4 rounded-2xl ${message.role === 'user'
                                                        ? 'bg-[#2b2bee] text-white rounded-br-md'
                                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-md'
                                                    }`}
                                            >
                                                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-slate-700 dark:text-slate-200'
                                                    }`}>
                                                    {message.content}
                                                </p>
                                            </div>

                                            {/* Sources */}
                                            {message.sources && message.sources.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Sources
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {message.sources.map((source) => (
                                                            <Link
                                                                key={source.id}
                                                                href={`/knowledge/${source.id}`}
                                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
                                                            >
                                                                <span className="text-[10px]">
                                                                    {source.type === 'note' ? '📝' : source.type === 'link' ? '🔗' : '💡'}
                                                                </span>
                                                                <span className="text-slate-600 dark:text-slate-300 group-hover:text-[#2b2bee] truncate max-w-[150px]">
                                                                    {source.title}
                                                                </span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {message.role === 'user' && (
                                            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-4"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2b2bee] to-[#6366f1] flex items-center justify-center text-white shrink-0">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                        <div className="relative flex items-end gap-4">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask a question about your knowledge base..."
                                    rows={1}
                                    className="w-full px-4 py-3 pr-12 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#2b2bee]/40 focus:border-transparent text-sm resize-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                    style={{ minHeight: '48px', maxHeight: '120px' }}
                                />
                            </div>
                            <motion.button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 bg-[#2b2bee] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#2b2bee]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                                Send
                            </motion.button>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}
