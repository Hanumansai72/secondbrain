"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";

export default function NewPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the capture page after a short delay
        const timer = setTimeout(() => {
            router.replace("/capture");
        }, 1500);
        return () => clearTimeout(timer);
    }, [router]);


    return (
        <div className="min-h-screen w-full flex flex-col bg-white dark:bg-slate-900">
            <Topbar />
            <div className="flex-1 flex items-center justify-center pt-16">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#2b2bee] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Creating New Knowledge</h2>
                    <p className="text-slate-500">Redirecting to capture page...</p>
                </div>
            </div>
        </div>
    );
}
