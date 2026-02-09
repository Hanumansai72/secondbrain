"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { useToast } from "@/components/ui/Toast";

type CaptureMode = "manual" | "url";
type ContentType = "note" | "insight" | "link";

interface ProcessingStage {
    id: string;
    label: string;
    status: "completed" | "active" | "pending";
    progress?: string;
}

interface ExtractedContent {
    title: string;
    summary: string;
    tags: string[];
    keyPoints?: string[];
    aiGenerated: boolean;
}

export default function CapturePage() {
    const toast = useToast();
    const [mode, setMode] = useState<CaptureMode>("manual");
    const [contentType, setContentType] = useState<ContentType>("note");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState<string[]>(["Productivity"]);
    const [tagInput, setTagInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractError, setExtractError] = useState("");

    const processingStages: ProcessingStage[] = [
        { id: "extract", label: "Extracting key ideas", status: processingProgress >= 33 ? "completed" : processingProgress > 0 ? "active" : "pending", progress: processingProgress >= 33 ? "Done" : `${Math.min(processingProgress * 3, 100)}%` },
        { id: "summary", label: "Generating summary", status: processingProgress >= 66 ? "completed" : processingProgress >= 33 ? "active" : "pending", progress: processingProgress >= 66 ? "Done" : processingProgress >= 33 ? `${Math.round((processingProgress - 33) * 3)}%` : "Waiting" },
        { id: "topics", label: "Identifying topics", status: processingProgress >= 100 ? "completed" : processingProgress >= 66 ? "active" : "pending", progress: processingProgress >= 100 ? "Done" : processingProgress >= 66 ? `${Math.round((processingProgress - 66) * 3)}%` : "Waiting" },
    ];

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // Handle URL analysis with AI
    const handleAnalyzeUrl = async () => {
        if (!url.trim()) {
            setExtractError("Please enter a URL");
            return;
        }

        setIsExtracting(true);
        setExtractError("");
        setExtractedContent(null);
        setProcessingProgress(0);

        try {
            // Start progress animation
            const progressInterval = setInterval(() => {
                setProcessingProgress(prev => Math.min(prev + 2, 90));
            }, 100);

            const res = await fetch("/api/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() })
            });

            clearInterval(progressInterval);
            setProcessingProgress(100);

            const data = await res.json();

            if (data.success) {
                setExtractedContent({
                    title: data.title,
                    summary: data.summary,
                    tags: data.tags || [],
                    keyPoints: data.keyPoints || [],
                    aiGenerated: data.aiGenerated
                });
                // Pre-fill the form
                setTitle(data.title);
                setContent(data.summary);
                setTags(data.tags || ["Link"]);
                setContentType("link");
            } else {
                setExtractError(data.message || "Failed to extract content");
            }
        } catch (err) {
            console.error("Error extracting URL:", err);
            setExtractError("Failed to analyze URL. Please try again.");
        } finally {
            setIsExtracting(false);
            setProcessingProgress(0);
        }
    };

    // Save extracted content
    const handleSaveExtracted = async () => {
        if (!extractedContent) return;

        setIsProcessing(true);
        setProcessingProgress(0);

        try {
            const userid = localStorage.getItem("userid") || sessionStorage.getItem("userid");

            if (!userid) {
                toast.warning("Please login first");
                setIsProcessing(false);
                return;
            }

            for (let i = 0; i <= 50; i += 10) {
                await new Promise((r) => setTimeout(r, 50));
                setProcessingProgress(i);
            }

            const res = await fetch("/api/note", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userid: JSON.parse(userid),
                    title: title,
                    tags: tags,
                    Type: "link",
                    des: content + (url ? `\n\nSource: ${url}` : "")
                })
            });

            const data = await res.json();

            for (let i = 50; i <= 100; i += 10) {
                await new Promise((r) => setTimeout(r, 50));
                setProcessingProgress(i);
            }

            if (data.success) {
                await new Promise((r) => setTimeout(r, 500));
                setUrl("");
                setTitle("");
                setContent("");
                setTags(["Productivity"]);
                setExtractedContent(null);
                toast.success("Saved to your brain!");
            } else {
                toast.error(data.message || "Failed to save");
            }
        } catch (err) {
            console.error("Error saving:", err);
            toast.error("Failed to save. Please try again.");
        }

        setIsProcessing(false);
        setProcessingProgress(0);
    };

    const handleSave = async () => {
        setIsProcessing(true);
        setProcessingProgress(0);

        try {
            // Get userid from localStorage or sessionStorage
            const userid = localStorage.getItem("userid") || sessionStorage.getItem("userid");

            if (!userid) {
                toast.warning("Please login first");
                setIsProcessing(false);
                return;
            }

            // Simulate processing animation
            for (let i = 0; i <= 50; i += 5) {
                await new Promise((r) => setTimeout(r, 50));
                setProcessingProgress(i);
            }

            // Make API call to save note
            const res = await fetch('/api/note', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userid: JSON.parse(userid),
                    title: title,
                    tags: tags,
                    Type: contentType,
                    des: content
                })
            });

            const data = await res.json();

            // Complete the progress animation
            for (let i = 50; i <= 100; i += 5) {
                await new Promise((r) => setTimeout(r, 50));
                setProcessingProgress(i);
            }

            if (data.success) {
                await new Promise((r) => setTimeout(r, 500));
                // Reset form after successful save
                setTitle("");
                setContent("");
                setTags(["Productivity"]);
                toast.success("Note saved successfully!");
            } else {
                toast.error(data.message || "Failed to save note");
            }
        } catch (err) {
            console.error("Error saving note:", err);
            toast.error("Failed to save note. Please try again.");
        }

        setIsProcessing(false);
        setProcessingProgress(0);
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
            {/* Header */}
            <Topbar></Topbar>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-3xl mx-auto ">
                {/* Page Header */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#2b2bee] uppercase">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Smart Capture
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ paddingTop: "50px" }}>What&apos;s on your mind?</h1>

                    {/* Mode Toggle */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit mt-8 border border-slate-200/50 dark:border-slate-800">
                        <button
                            onClick={() => setMode("manual")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "manual"
                                ? "bg-white dark:bg-slate-800 shadow-sm text-[#2b2bee]"
                                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Write Manually
                        </button>
                        <button
                            onClick={() => setMode("url")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "url"
                                ? "bg-white dark:bg-slate-800 shadow-sm text-[#2b2bee]"
                                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Import from URL
                        </button>
                    </div>
                </div>

                {/* Manual Write Mode */}
                {mode === "manual" && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {/* Title Input */}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-3xl font-bold placeholder:text-slate-200 dark:placeholder:text-slate-800 focus:ring-0 focus:outline-none"
                                placeholder="Knowledge Title..."
                            />

                            {/* Type Selector & Toolbar */}
                            <div className="flex items-center gap-2 py-2 border-y border-slate-100 dark:border-slate-800">
                                <div className="flex p-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    {(["note", "insight", "link"] as ContentType[]).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setContentType(type)}
                                            className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${contentType === type
                                                ? "text-[#2b2bee] bg-white dark:bg-slate-800 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>

                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

                                <div className="flex gap-1">
                                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
                                        </svg>
                                    </button>
                                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content Textarea */}
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-lg leading-relaxed min-h-[100px] resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 focus:outline-none"
                                placeholder="Start typing your thoughts, ideas, or paste content..."
                            />

                            {/* Tags Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-500">Tags</label>
                                <div className="flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 bg-[#2b2bee]/5 text-[#2b2bee] text-xs font-bold rounded-lg flex items-center gap-1 border border-[#2b2bee]/10"
                                        >
                                            #{tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 min-w-[120px] focus:outline-none"
                                        placeholder="Add tags..."
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 italic">AI will suggest tags automatically based on content.</p>
                            </div>

                            {/* AI Assist Card */}
                            <div className="p-5 bg-indigo-50/50 dark:bg-[#2b2bee]/5 rounded-2xl border border-indigo-100/50 dark:border-[#2b2bee]/10 relative overflow-hidden group">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <svg className="w-5 h-5 text-[#2b2bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Assist Active</h4>
                                        <p className="text-xs text-slate-500 leading-normal">
                                            Our AI will automatically generate a summary, identify key topics, and link this to relevant knowledge in your brain.
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <svg className="w-16 h-16 text-[#2b2bee]" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="3" />
                                        <circle cx="6" cy="6" r="2" />
                                        <circle cx="18" cy="6" r="2" />
                                        <circle cx="6" cy="18" r="2" />
                                        <circle cx="18" cy="18" r="2" />
                                    </svg>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Autosaved 1 minute ago
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="group flex items-center gap-3 px-10 py-4 bg-[#2b2bee] text-white font-bold rounded-2xl shadow-xl shadow-[#2b2bee]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <span>Save to Brain</span>
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* URL Import Mode */}
                {mode === "url" && (
                    <div className="space-y-6">
                        {/* URL Input */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => { setUrl(e.target.value); setExtractError(""); }}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none dark:text-white"
                                    placeholder="https://example.com/article-title"
                                    disabled={isExtracting}
                                />
                            </div>

                            {extractError && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <p className="text-red-600 dark:text-red-400 text-sm">{extractError}</p>
                                </div>
                            )}

                            <button
                                onClick={handleAnalyzeUrl}
                                disabled={isExtracting || !url.trim()}
                                className="w-full py-4 bg-[#2b2bee] text-white font-bold rounded-2xl hover:bg-[#2b2bee]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2b2bee]/20"
                            >
                                {isExtracting ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Analyzing with AI...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>Analyze with AI</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Extraction Progress */}
                        {isExtracting && (
                            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#2b2bee]/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#2b2bee] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white">AI is analyzing...</h4>
                                        <p className="text-sm text-slate-500">Extracting content and generating summary</p>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#2b2bee] transition-all duration-300"
                                        style={{ width: `${processingProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Extracted Content Preview */}
                        {extractedContent && !isExtracting && (
                            <div className="space-y-4">
                                <div className="p-6 bg-white dark:bg-slate-900 border border-[#2b2bee]/30 rounded-2xl shadow-lg shadow-[#2b2bee]/5">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-900 dark:text-white">Content Extracted</h4>
                                                {extractedContent.aiGenerated && (
                                                    <span className="px-2 py-0.5 bg-[#2b2bee]/10 text-[#2b2bee] text-[10px] font-bold rounded-full">AI GENERATED</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500">Review and edit before saving</p>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="mb-4">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-[#2b2bee]/40 focus:border-transparent dark:text-white"
                                        />
                                    </div>

                                    {/* AI Summary */}
                                    <div className="mb-4">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Summary</label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={3}
                                            className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-[#2b2bee]/40 focus:border-transparent resize-none dark:text-white"
                                        />
                                    </div>

                                    {/* Key Points */}
                                    {extractedContent.keyPoints && extractedContent.keyPoints.length > 0 && (
                                        <div className="mb-4">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Points</label>
                                            <ul className="mt-2 space-y-2">
                                                {extractedContent.keyPoints.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                        <svg className="w-4 h-4 text-[#2b2bee] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                                        </svg>
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</label>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            {tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1.5 bg-[#2b2bee]/5 text-[#2b2bee] text-xs font-bold rounded-lg flex items-center gap-1 border border-[#2b2bee]/10"
                                                >
                                                    #{tag}
                                                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={handleAddTag}
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 min-w-[100px] focus:outline-none dark:text-white"
                                                placeholder="Add tag..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleSaveExtracted}
                                    className="w-full py-4 bg-[#2b2bee] text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#2b2bee]/20"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    Save to Brain
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!extractedContent && !isExtracting && (
                            <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Import from any URL</h4>
                                    <p className="text-sm text-slate-500">Paste a link and AI will extract content, generate a summary, and suggest tags.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-[#2b2bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div className="absolute inset-0 w-20 h-20 rounded-full border-t-4 border-[#2b2bee] animate-spin" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Processing Knowledge</h3>
                                <p className="text-sm text-slate-500">Refining your new entry with AI...</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {processingStages.map((stage) => (
                                <div
                                    key={stage.id}
                                    className={`flex items-center justify-between text-sm transition-opacity duration-500 ${stage.status === "completed" ? "text-green-600" :
                                        stage.status === "active" ? "text-[#2b2bee] font-semibold" :
                                            "opacity-30"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {stage.status === "completed" ? (
                                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : stage.status === "active" ? (
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                            </svg>
                                        )}
                                        <span>{stage.label}</span>
                                    </div>
                                    <span className="font-mono text-xs">{stage.progress}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
