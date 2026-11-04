export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b-2 border-[#161616] bg-[#FAF5EC]/95 backdrop-blur sticky top-0 z-50 px-4 py-2 text-xs font-mono tracking-widest uppercase">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5882] animate-ping"></span>
              SYS_02
            </span>
            <span className="hidden sm:inline border-l-2 border-[#161616]/30 pl-4">PINKDOG.VET // V3.2</span>
          </div>
          <div className="font-semibold text-center hidden lg:block tracking-[0.25em]">THE PINK DOG CLINICAL & SHAMPOO SOCIETY</div>
          <div className="flex items-center gap-4">
            <a href="/admin" className="bg-[#FF5882] hover:bg-[#161616] text-white border-2 border-[#161616] px-3 py-1 font-bold text-xs shadow-[2px_2px_0px_#161616] transition-all">ADMIN</a>
            <a href="/staff" className="bg-[#161616] text-white border-2 border-[#161616] px-3 py-1 font-bold text-xs shadow-[2px_2px_0px_#161616] transition-all">STAFF</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-4 pb-12 px-4 border-b-2 border-[#161616] overflow-hidden">
        <div className="max-w-7xl mx-auto relative min-h-[580px] flex flex-col justify-between">
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none select-none z-0">
            <h1 className="font-title text-[105px] sm:text-[150px] md:text-[230px] lg:text-[290px] leading-none tracking-tighter text-[#161616]/90 pl-1 sm:pl-4">PINK</h1>
            <h1 className="font-title text-[105px] sm:text-[150px] md:text-[230px] lg:text-[290px] leading-none tracking-tighter text-[#161616]/90 pr-1 sm:pr-4 text-right">DOG</h1>
          </div>
          <div className="relative z-10 my-auto flex flex-col items-center justify-center pt-2">
            <div className="self-end mr-4 sm:mr-28 mb-1 z-20">
              <div className="border-2 border-[#161616] bg-[#FAF5EC] px-3 py-1 shadow-[2px_2px_0px_#161616] flex items-center gap-2 text-xs font-mono">
                <span className="text-[#FF5882] font-bold">LOOK CLOSER:</span>
                <span>WET DOGS ARE HUGE & HAPPY</span>
              </div>
            </div>
            <div className="relative group max-w-lg lg:max-w-2xl w-full flex justify-center">
              <div className="relative flex flex-col items-center">
                <div className="w-full h-[320px] sm:h-[400px] bg-pink-100 border-2 border-[#161616] flex items-center justify-center text-[#FF5882] text-6xl">
                  🐺
                </div>
                <a href="#" className="mt-[-28px] sm:mt-[-36px] z-30 bg-[#E2596A] hover:bg-[#FF5882] text-white border-2 border-[#161616] rounded-full px-6 py-3 font-title text-2xl tracking-wider shadow-[4px_4px_0px_#161616] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 uppercase">
                  <span>WASH NOW</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
