"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  preferredSector?: string | null;
}

interface MeData {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  role: string;
  pets: Pet[];
}

export default function ClienteDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<MeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((data) => {
        if (data.role !== "CLIENT") {
          router.push("/login");
          return;
        }
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-paper">
        <div className="font-mono text-xs font-bold animate-pulse">CARREGANDO DASHBOARD...</div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Header */}
      <header className="border-b-2 border-ink bg-white px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-pop border-2 border-ink flex items-center justify-center font-title text-xl font-black text-white">
              PD
            </div>
            <div>
              <div className="font-title font-black text-lg leading-none">PAINEL DO TUTOR</div>
              <div className="text-[10px] font-mono text-zinc-500">{user.name.toUpperCase()} // CLIENTE</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="px-3 py-1.5 text-xs font-mono font-bold bg-zinc-100 border-2 border-ink hover:bg-zinc-200 transition">
              SITE
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-mono font-bold bg-red-100 border-2 border-ink hover:bg-red-200 transition"
            >
              SAIR
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Dados pessoais */}
        <section className="bg-white border-[3px] border-ink shadow-brutal-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 bg-ink text-white flex items-center justify-center font-mono font-bold text-[10px]">👤</span>
            <h2 className="font-title font-black text-lg uppercase tracking-tight">Meus Dados</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-zinc-50 p-3 border-2 border-ink">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Nome</span>
              <span className="font-bold text-zinc-900">{user.name}</span>
            </div>
            <div className="bg-zinc-50 p-3 border-2 border-ink">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Telefone</span>
              <span className="font-bold text-zinc-900">{user.phone}</span>
            </div>
            <div className="bg-zinc-50 p-3 border-2 border-ink">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">E-mail</span>
              <span className="font-bold text-zinc-900">{user.email || "Não informado"}</span>
            </div>
          </div>
        </section>

        {/* Pets */}
        <section className="bg-white border-[3px] border-ink shadow-brutal-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-pink-pop text-black border-2 border-ink flex items-center justify-center font-mono font-bold text-[10px]">🐾</span>
              <h2 className="font-title font-black text-lg uppercase tracking-tight">Meus Pets</h2>
            </div>
            <a
              href="/cadastro"
              className="px-3 py-1.5 text-xs font-mono font-bold bg-yellow-200 border-2 border-ink hover:bg-yellow-300 transition"
            >
              + NOVO PET
            </a>
          </div>
          {user.pets.length === 0 ? (
            <div className="text-xs font-mono text-zinc-500 p-4 bg-zinc-50 border-2 border-ink border-dashed text-center">
              Nenhum pet cadastrado. <a href="/cadastro" className="text-pink-pop font-bold underline">Cadastre agora →</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {user.pets.map((pet) => (
                <div key={pet.id} className="bg-zinc-50 p-4 border-2 border-ink hover:bg-pink-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-title font-black text-xl">{pet.name.toUpperCase()}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border-2 border-ink ${
                      pet.preferredSector === "VET" ? "bg-sky-200 text-sky-950" : "bg-pink-200 text-pink-900"
                    }`}>
                      {pet.preferredSector === "VET" ? "CLÍNICA" : "SPA"}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-zinc-600">
                    {pet.species === "DOG" ? "Cachorro" : pet.species === "CAT" ? "Gato" : "Outro"} • {pet.breed}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Ações */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="#" className="block bg-pink-pop border-[3px] border-ink shadow-brutal-lg p-5 hover:bg-ink hover:text-white transition group">
            <div className="font-title font-black text-2xl uppercase mb-1">Agendar Serviço</div>
            <div className="font-mono text-xs opacity-80">Banho, tosa ou consulta veterinária →</div>
          </a>
          <a href="#" className="block bg-white border-[3px] border-ink shadow-brutal-lg p-5 hover:bg-zinc-100 transition">
            <div className="font-title font-black text-2xl uppercase mb-1">Histórico</div>
            <div className="font-mono text-xs text-zinc-600">Visualize atendimentos anteriores →</div>
          </a>
        </section>
      </div>
    </main>
  );
}
