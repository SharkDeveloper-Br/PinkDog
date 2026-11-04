"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/stats").then(r => r.json()).then(setStats);
    fetch("/api/appointments").then(r => r.json()).then(setAppointments);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6 space-y-8 pb-16">
      <header className="border-b-2 border-[#161616] pb-4">
        <div className="font-mono text-xs text-[#FF5882] font-bold uppercase tracking-widest">// SYS_02 // ADMIN & DISPATCH CONSOLE</div>
        <h1 className="font-title text-5xl text-[#161616]">DASHBOARD PINK DOG</h1>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border-2 border-[#161616] bg-[#FAF5EC] p-4 shadow-[3px_3px_0px_#161616]">
          <span className="text-[10px] font-mono font-bold text-[#161616]/60 uppercase">// PACIENTES HOJE</span>
          <div className="font-title text-5xl">{stats?.totalToday ?? 0}</div>
          <div className="text-[11px] font-mono text-emerald-700 font-bold">{stats?.remaining ?? 0} restantes</div>
        </div>
        <div className="border-2 border-[#161616] bg-[#FAF5EC] p-4 shadow-[3px_3px_0px_#161616]">
          <span className="text-[10px] font-mono font-bold text-[#161616]/60 uppercase">// SPA & BANHOS</span>
          <div className="font-title text-5xl">{stats?.bathCount ?? 0}</div>
        </div>
        <div className="border-2 border-[#161616] bg-[#FAF5EC] p-4 shadow-[3px_3px_0px_#161616]">
          <span className="text-[10px] font-mono font-bold text-[#161616]/60 uppercase">// CONSULTAS</span>
          <div className="font-title text-5xl">{stats?.vetCount ?? 0}</div>
        </div>
        <div className="border-2 border-[#161616] bg-[#FAF5EC] p-4 shadow-[3px_3px_0px_#161616]">
          <span className="text-[10px] font-mono font-bold text-[#161616]/60 uppercase">// FATURAMENTO</span>
          <div className="font-title text-5xl">R$ {stats?.revenue ?? 0}</div>
        </div>
      </section>

      {/* Appointments Table */}
      <section className="border-2 border-[#161616] bg-[#FAF5EC] p-5 shadow-[6px_6px_0px_#161616]">
        <h2 className="font-title text-3xl mb-4">AGENDAMENTOS DE HOJE</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y-2 divide-[#161616]">
            <thead className="bg-[#EFE7D7] font-bold uppercase">
              <tr>
                <th className="py-2 px-3">Hora</th>
                <th className="py-2 px-3">Pet</th>
                <th className="py-2 px-3">Serviço</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]/30">
              {appointments.map((a: any) => (
                <tr key={a.id} className="hover:bg-[#FFAEC0]/20">
                  <td className="py-3 px-3 font-bold">{a.time}</td>
                  <td className="py-3 px-3">{a.pet?.name} ({a.pet?.breed})</td>
                  <td className="py-3 px-3 text-[#FF5882] font-bold">{a.service?.name}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 border border-[#161616] text-[10px] font-bold ${
                      a.status === 'COMPLETED' ? 'bg-emerald-200' :
                      a.status === 'IN_PROGRESS' ? 'bg-amber-200' :
                      a.status === 'READY' ? 'bg-emerald-600 text-white' :
                      'bg-white'
                    }`}>{a.status}</span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="border border-[#161616] bg-white px-2 py-1 text-[10px] hover:bg-[#161616] hover:text-white transition">VER &rarr;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
