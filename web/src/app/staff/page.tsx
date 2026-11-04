"use client";
import { useEffect, useState } from "react";

export default function StaffPage() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/appointments").then(r => r.json()).then(setAppointments);
  }, []);

  async function advance(id: string) {
    await fetch(`/api/appointments`, { method: "PATCH", body: JSON.stringify({ id }) });
    fetch("/api/appointments").then(r => r.json()).then(setAppointments);
  }

  const steps = ['ESPERA', 'EM EXECUÇÃO', 'ACABAMENTO', 'PRONTO'];

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6 pb-16">
      <header className="border-b-2 border-[#161616] pb-4 mb-6">
        <div className="font-mono text-xs text-[#FF5882] font-bold uppercase tracking-widest">// SYS_03 // OPERATIONAL PIPELINE</div>
        <h1 className="font-title text-5xl text-[#161616]">FLUXO DE ATENDIMENTO</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {steps.map((colName, colIdx) => (
          <div key={colName} className="border-2 border-[#161616] bg-[#FAF5EC] p-3 shadow-[3px_3px_0px_#161616] min-h-[460px]">
            <div className="border-b-2 border-[#161616] pb-2 mb-3 flex justify-between">
              <span className="font-title text-xl">{colIdx + 1}. {colName}</span>
              <span className="font-mono text-xs font-bold px-1.5 bg-[#EFE7D7] border border-[#161616]">
                {appointments.filter((a: any) => colStatus(a.status) === colIdx).length}
              </span>
            </div>
            <div className="space-y-3">
              {appointments.filter((a: any) => colStatus(a.status) === colIdx).map((a: any) => (
                <div key={a.id} className="border-2 border-[#161616] bg-white p-3 text-xs font-mono shadow-[2px_2px_0px_#161616]">
                  <div className="flex justify-between">
                    <span className="font-bold bg-[#161616] text-white px-1.5">{a.time}</span>
                    <span className="text-[10px] text-[#FF5882] font-bold">{a.service?.name?.split(' ')[0]}</span>
                  </div>
                  <div className="font-bold text-sm mt-1">{a.pet?.name}</div>
                  <div className="text-[10px] text-[#161616]/70">{a.pet?.breed}</div>
                  {colIdx < 3 && (
                    <button onClick={() => advance(a.id)} className="w-full mt-2 bg-[#FF5882] text-white py-1 border border-[#161616] font-bold text-[10px]">AVANÇAR &rarr;</button>
                  )}
                  {colIdx === 3 && (
                    <button className="w-full mt-2 bg-emerald-600 text-white py-1 border border-[#161616] font-bold text-[10px]">WHATSAPP</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function colStatus(status: string) {
  if (status === 'WAITING' || status === 'SCHEDULED') return 0;
  if (status === 'IN_PROGRESS') return 1;
  if (status === 'FINISHING') return 2;
  if (status === 'READY' || status === 'COMPLETED') return 3;
  return 0;
}
