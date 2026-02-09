import { Topbar } from "../components/layout/Topbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-slate-900">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }
      `}</style>
      <Topbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="px-6 py-20 md:py-32 max-w-[1200px] mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2b2bee]/10 border border-[#2b2bee]/20 text-[#2b2bee] text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up hover:scale-105 transition-transform duration-300 cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2b2bee] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2b2bee]"></span>
            </span>
            Now with GPT-4o Integration
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8 max-w-4xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Your External Brain <br /> <span className="text-[#2b2bee]">— Powered by AI</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            The all-in-one workspace to capture notes, automate summaries, and query your knowledge instantly. Stop searching, start knowing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link href="/(workspace)/dashboard">
              <button className="bg-[#2b2bee] hover:bg-[#2118c4] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-[#2b2bee]/30 transition-all flex items-center justify-center gap-2 hover-lift hover:shadow-[0_0_30px_rgba(43,43,238,0.5)] group">
                Open Dashboard
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </Link>
            <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover-lift">
              View Demo
            </button>
          </div>

          {/* Product Preview */}
          <div className="mt-20 w-full max-w-5xl relative animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="absolute inset-0 bg-[#2b2bee]/20 blur-[120px] rounded-full -z-10"></div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-2 shadow-2xl overflow-hidden aspect-video hover-lift hover:border-[#2b2bee]/50 dark:hover:border-[#2b2bee]/50 transition-all">
              <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                Dashboard Preview
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white dark:bg-slate-900/50 py-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">How it works</h2>
              <div className="h-1.5 w-20 bg-[#2b2bee] rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="flex flex-col items-start animate-fade-in-up hover:translate-x-1 transition-transform duration-300" style={{animationDelay: '0.1s'}}>
                <div className="w-14 h-14 rounded-2xl bg-[#2b2bee]/10 flex items-center justify-center text-[#2b2bee] mb-6 text-2xl">
                  📤
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Capture</h3>
                <p className="text-slate-600 dark:text-slate-400">Feed in web clips, PDFs, or voice notes. Second Brain accepts almost any format of raw information.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-start animate-fade-in-up hover:translate-x-1 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
                <div className="w-14 h-14 rounded-2xl bg-[#2b2bee]/10 flex items-center justify-center text-[#2b2bee] mb-6 text-2xl">
                  ✨
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. Process</h3>
                <p className="text-slate-600 dark:text-slate-400">AI automatically tags, links, and summarizes. It finds hidden connections between your disparate thoughts.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-start animate-fade-in-up hover:translate-x-1 transition-transform duration-300" style={{animationDelay: '0.3s'}}>
                <div className="w-14 h-14 rounded-2xl bg-[#2b2bee]/10 flex items-center justify-center text-[#2b2bee] mb-6 text-2xl">
                  💬
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Retrieve</h3>
                <p className="text-slate-600 dark:text-slate-400">Ask questions in natural language and get instant answers based solely on your own uploaded knowledge base.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col gap-4 mb-16">
            <h2 className="text-slate-900 dark:text-white text-4xl font-black tracking-tight leading-tight max-w-[720px]">
              Supercharge your memory
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-[720px]">Our AI-driven features help you manage information without the manual effort.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:shadow-lg transition-all border-b-4 border-b-[#2b2bee] hover-lift hover:scale-105 cursor-pointer animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="text-[#2b2bee] text-3xl">🔗</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Smart Linking</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-normal">Automatically connects related ideas across your notes without manual tagging.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:shadow-lg transition-all hover-lift hover:scale-105 cursor-pointer animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="text-[#2b2bee] text-3xl">💬</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Natural Querying</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-normal">Ask your brain questions like you're talking to a friend and get cited answers.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:shadow-lg transition-all hover-lift hover:scale-105 cursor-pointer animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="text-[#2b2bee] text-3xl">🔒</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Privacy First</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-normal">Your data is end-to-end encrypted and never used for training public models.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:shadow-lg transition-all hover-lift hover:scale-105 cursor-pointer animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="text-[#2b2bee] text-3xl">🔌</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Web Extension</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-normal">Clip articles, tweets, or YouTube transcripts directly from your browser in one click.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24">
          <div className="max-w-[1000px] mx-auto bg-[#2b2bee] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden animate-fade-in-up hover-lift" style={{animationDelay: '0.2s'}}>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[40px] border-white"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border-[40px] border-white"></div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Ready to unlock your <br /> superhuman memory?</h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto relative z-10">Join knowledge workers, researchers, and students using Second Brain.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="bg-white text-[#2b2bee] hover:bg-slate-50 px-10 py-4 rounded-xl text-lg font-bold shadow-xl transition-all hover-lift hover:shadow-[0_20px_25px_rgba(255,255,255,0.3)]">
                Get Started Free
              </button>
              <button className="bg-[#2b2bee]/20 text-white border border-white/30 hover:bg-white/10 px-10 py-4 rounded-xl text-lg font-bold transition-all hover-lift hover:border-white/50 duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">© 2024 Second Brain Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
