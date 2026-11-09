export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b-2 border-ink bg-paper/95 backdrop-blur sticky top-0 z-50 px-4 py-2 text-xs font-mono tracking-widest uppercase">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-pop animate-ping"></span>
              SYS_02
            </span>
            <span className="hidden sm:inline border-l-2 border-ink/30 pl-4">PINKDOG.VET // V3.2</span>
          </div>
          <div className="font-semibold text-center hidden lg:block tracking-[0.25em]">THE PINK DOG CLINICAL & SHAMPOO SOCIETY</div>
          <div className="flex items-center gap-4">
            <a href="/login" className="bg-pink-pop hover:bg-ink text-black hover:text-white border-2 border-ink px-3 py-1 font-bold text-xs shadow-brutal-sm transition-all">LOGIN</a>
            <a href="/admin" className="bg-ink text-white border-2 border-ink px-3 py-1 font-bold text-xs shadow-brutal-sm transition-all">ADMIN</a>
          </div>
        </div>
      </header>

      {/* Cliente Entry Bar */}
      <section className="border-b-2 border-ink bg-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-pink-pop border-2 border-ink flex items-center justify-center font-mono font-bold text-xs text-white">🐾</span>
            <div>
              <div className="font-title font-black text-lg tracking-tight uppercase">Área do Tutor</div>
              <div className="text-[10px] font-mono text-zinc-500">CADASTRO DE PETS • AGENDAMENTOS • ACOMPANHAMENTO</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/login" className="px-4 py-2 text-xs font-mono font-bold bg-white border-2 border-ink hover:bg-zinc-100 transition shadow-brutal-sm">
              JÁ TENHO CADASTRO →
            </a>
            <a href="/cadastro" className="px-4 py-2 text-xs font-mono font-bold bg-pink-pop border-2 border-ink hover:bg-ink hover:text-white transition shadow-brutal-sm">
              QUERO ME CADASTRAR →
            </a>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative pt-4 pb-12 px-4 border-b-2 border-ink overflow-hidden">
        <div className="max-w-7xl mx-auto relative min-h-[580px] flex flex-col justify-between">
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none select-none z-0">
            <h1 className="font-title text-[105px] sm:text-[150px] md:text-[230px] lg:text-[290px] leading-none tracking-tighter text-ink/90 pl-1 sm:pl-4">PINK</h1>
            <h1 className="font-title text-[105px] sm:text-[150px] md:text-[230px] lg:text-[290px] leading-none tracking-tighter text-ink/90 pr-1 sm:pr-4 text-right">DOG</h1>
          </div>
          <div className="relative z-10 my-auto flex flex-col items-center justify-center pt-2">
            <div className="self-end mr-4 sm:mr-28 mb-1 z-20">
              <div className="border-2 border-ink bg-paper px-3 py-1 shadow-brutal-sm flex items-center gap-2 text-xs font-mono">
                <span className="text-pink-pop font-bold">LOOK CLOSER:</span>
                <span>WET DOGS ARE HUGE & HAPPY</span>
              </div>
            </div>
            <div className="relative group max-w-lg lg:max-w-2xl w-full flex justify-center">
              <div className="relative flex flex-col items-center">
                <div className="w-full h-[320px] sm:h-[400px] bg-pink-100 border-2 border-ink flex items-center justify-center text-pink-pop text-6xl">
                  🐺
                </div>
                <a href="/cadastro" className="mt-[-28px] sm:mt-[-36px] z-30 bg-[#E2596A] hover:bg-pink-pop text-white border-2 border-ink rounded-full px-6 py-3 font-title text-2xl tracking-wider shadow-[4px_4px_0px_#161616] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 uppercase">
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
