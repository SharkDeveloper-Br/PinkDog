"use client";
import { useEffect, useState } from "react";
import type { Appointment } from "@/lib/types";

const steps = ["ESPERA", "EM EXECUCAO", "ACABAMENTO", "PRONTO"] as const;

type StepStatus = typeof steps[number];

function colStatus(status: string): number {
  if (status === "WAITING" || status === "SCHEDULED") return 0;
  if (status === "IN_PROGRESS") return 1;
  if (status === "FINISHING") return 2;
  if (status === "READY" || status === "COMPLETED") return 3;
  return 0;
}

function nextStatus(current: string): string {
  const map: Record<string, string> = {
    SCHEDULED: "WAITING",
    WAITING: "IN_PROGRESS",
    IN_PROGRESS: "FINISHING",
    FINISHING: "READY",
    READY: "COMPLETED",
  };
  return map[current] || current;
}

export default function StaffPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/appointments")
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setAppointments)
      .catch(() => setError("Erro ao carregar agendamentos"));
  }, []);

  async function advance(id: string, currentStatus: string) {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus(currentStatus) }),
      });
      if (!res.ok) throw new Error();
      const refreshed = await fetch("/api/appointments").then(r => r.json());
      setAppointments(refreshed);
    } catch {
      setError("Erro ao avancar status");
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6 pb-16">
      <header className="border-b-2 border-[#161616] pb-4 mb-6">
        <div className="font-mono text-xs text-[#FF5882] font-bold uppercase tracking-widest">// SYS_03 // OPERATIONAL PIPELINE</div>
        <h1 className="font-title text-5xl text-[#161616]">FLUXO DE ATENDIMENTO</h1>
      </header>

      {error && (
        <div className="mb-4 border-2 border-red-600 bg-red-50 p-3 font-mono text-xs text-red-700 font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {steps.map((colName, colIdx) => (
          <div key={colName} className="border-2 border-[#161616] bg-[#FAF5EC] p-3 shadow-[3px_3px_0px_#161616] min-h-[460px]">
            <div className="border-b-2 border-[#161616] pb-2 mb-3 flex justify-between">
              <span className="font-title text-xl">{colIdx + 1}. {colName}</span>
              <span className="font-mono text-xs font-bold px-1.5 bg-[#EFE7D7] border border-[#161616]">
                {appointments.filter((a) => colStatus(a.status) === colIdx).length}
              </span>
            </div>
            <div className="space-y-3">
              {appointments.filter((a) => colStatus(a.status) === colIdx).map((a) => (
                <div key={a.id} className="border-2 border-[#161616] bg-white p-3 text-xs font-mono shadow-[2px_2px_0px_#161616]">
                  <div className="flex justify-between">
                    <span className="font-bold bg-[#161616] text-white px-1.5">{a.time}</span>
                    <span className="text-[10px] text-[#FF5882] font-bold">{a.service?.name?.split(" ")[0]}</span>
                  </div>
                  <div className="font-bold text-sm mt-1">{a.pet?.name}</div>
                  <div className="text-[10px] text-[#161616]/70">{a.pet?.breed}</div>
                  {colIdx < 3 && (
                    <button type="button" onClick={() => advance(a.id, a.status)} className="w-full mt-2 bg-[#FF5882] text-white py-1 border border-[#161616] font-bold text-[10px]">AVANCAR &rarr;</button>
                  )}
                  {colIdx === 3 && (
                    <button type="button" className="w-full mt-2 bg-emerald-600 text-white py-1 border border-[#161616] font-bold text-[10px]">WHATSAPP</button>
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
