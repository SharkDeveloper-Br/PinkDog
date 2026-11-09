"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasPetTaxi, setHasPetTaxi] = useState(false);

  const [tutorName, setTutorName] = useState("");
  const [tutorPhone, setTutorPhone] = useState("");
  const [tutorEmail, setTutorEmail] = useState("");
  const [password, setPassword] = useState("");

  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("DOG");
  const [petBreed, setPetBreed] = useState("");
  const [petSize, setPetSize] = useState("Médio");
  const [petAge, setPetAge] = useState("");
  const [sector, setSector] = useState("SPA");

  const [addressCep, setAddressCep] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressNeighborhood, setAddressNeighborhood] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [addressNotes, setAddressNotes] = useState("");

  function maskPhone(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 6) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    if (digits.length > 2) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return digits;
  }

  function maskCep(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const addressParts = [addressStreet, addressNumber, addressNeighborhood, addressComplement]
      .filter(Boolean)
      .join(", ");
    const fullAddress = hasPetTaxi ? addressParts : undefined;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tutorName,
          phone: tutorPhone.replace(/\D/g, ""),
          email: tutorEmail || null,
          password,
          address: fullAddress || null,
          pet: {
            name: petName,
            species: petSpecies,
            breed: petBreed || "SRD",
            weight: petSize === "Pequeno" ? 5 : petSize === "Médio" ? 15 : 30,
            birthDate: null,
            alert: addressNotes || null,
            notes: `Porte: ${petSize}. Idade aprox: ${petAge || "Não informada"}.`,
            preferredSector: sector,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar");
        setLoading(false);
        return;
      }
      router.push("/cliente");
    } catch {
      setError("Erro de conexão");
      setLoading(false);
    }
  }

  const speciesLabel = petSpecies === "DOG" ? "Cachorro" : petSpecies === "CAT" ? "Gato" : "Outro";
  const tagId = `PD-${Math.floor(100 + Math.random() * 900)}`;

  return (
    <main className="min-h-screen bg-paper text-ink p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto mb-8 bg-white border-[3px] border-ink shadow-brutal-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-pop border-[3px] border-ink flex items-center justify-center font-title text-2xl font-black text-white">
            PD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-ink text-white px-2 py-0.5">// FORM_INDUCTION_V3</span>
              <span className="text-xs font-mono text-zinc-500">NOVA ENTRADA NO SISTEMA</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-title font-black tracking-tight">CADASTRO DE PET & TUTOR</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" className="px-3 py-1.5 text-xs font-mono font-bold bg-zinc-100 border-2 border-ink hover:bg-zinc-200 transition">
            ← SITE
          </a>
          <a href="/login" className="px-3 py-1.5 text-xs font-mono font-bold bg-zinc-100 border-2 border-ink hover:bg-zinc-200 transition">
            LOGIN
          </a>
          <span className="px-3 py-1.5 text-xs font-mono font-bold bg-yellow-200 border-2 border-ink">
            REGISTRO AUTOMÁTICO
          </span>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Formulário */}
        <div className="lg:col-span-7 bg-white border-[3px] border-ink shadow-brutal-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bloco 01 */}
            <div className="border-b-2 border-ink pb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 bg-ink text-white flex items-center justify-center font-mono font-bold text-xs">01</span>
                <h2 className="font-title font-black text-lg tracking-tight uppercase">DADOS DO TUTOR (RESPONSÁVEL)</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-mono font-bold text-xs uppercase mb-1">Nome Completo do Tutor *</label>
                  <input
                    type="text"
                    required
                    value={tutorName}
                    onChange={(e) => setTutorName(e.target.value)}
                    placeholder="Ex: Igor Torres"
                    className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono font-bold text-xs uppercase mb-1">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={tutorPhone}
                      onChange={(e) => setTutorPhone(maskPhone(e.target.value))}
                      placeholder="(11) 98841-3320"
                      className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-xs uppercase mb-1">E-mail</label>
                    <input
                      type="email"
                      value={tutorEmail}
                      onChange={(e) => setTutorEmail(e.target.value)}
                      placeholder="tutor@exemplo.com"
                      className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono font-bold text-xs uppercase mb-1">Senha de Acesso *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 02 */}
            <div className="border-b-2 border-ink pb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 bg-pink-pop text-black border-2 border-ink flex items-center justify-center font-mono font-bold text-xs">02</span>
                <h2 className="font-title font-black text-lg tracking-tight uppercase">DADOS DO PACIENTE (PET)</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-mono font-bold text-xs uppercase mb-1">Nome do Pet *</label>
                    <input
                      type="text"
                      required
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Ex: Shaggy"
                      className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-xs uppercase mb-1">Espécie</label>
                    <select
                      value={petSpecies}
                      onChange={(e) => setPetSpecies(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop"
                    >
                      <option value="DOG">Cachorro 🐕</option>
                      <option value="CAT">Gato 🐈</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono font-bold text-xs uppercase mb-1">Raça</label>
                    <input
                      type="text"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      placeholder="Ex: Golden Retriever"
                      className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-xs uppercase mb-1">Porte</label>
                    <select
                      value={petSize}
                      onChange={(e) => setPetSize(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop"
                    >
                      <option value="Grande">Grande (25kg+)</option>
                      <option value="Médio">Médio (10kg a 25kg)</option>
                      <option value="Pequeno">Pequeno (até 10kg)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-xs uppercase mb-1">Idade Aprox.</label>
                    <input
                      type="text"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      placeholder="Ex: 3 anos"
                      className="w-full p-3 bg-zinc-50 border-2 border-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-pop focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono font-bold text-xs uppercase mb-2">Ala de Atendimento Inicial</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-3 bg-pink-50 border-2 border-ink cursor-pointer hover:bg-pink-100 transition">
                      <input type="radio" name="sector" value="SPA" checked={sector === "SPA"} onChange={() => setSector("SPA")} className="w-4 h-4 accent-pink-600" />
                      <span className="font-mono text-xs font-bold text-pink-900">🧼 SPA & Banho</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 bg-sky-50 border-2 border-ink cursor-pointer hover:bg-sky-100 transition">
                      <input type="radio" name="sector" value="VET" checked={sector === "VET"} onChange={() => setSector("VET")} className="w-4 h-4 accent-sky-600" />
                      <span className="font-mono text-xs font-bold text-sky-950">🩺 Clínica Veterinária</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 03 */}
            <div className="pb-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-yellow-300 text-black border-2 border-ink flex items-center justify-center font-mono font-bold text-xs">03</span>
                  <h2 className="font-title font-black text-lg tracking-tight uppercase">TRANSPORTE & LOGÍSTICA</h2>
                </div>
                <span className="text-xs font-mono font-bold bg-ink text-yellow-300 px-2 py-0.5">VAN CLIMATIZADA</span>
              </div>
              <div className="p-4 bg-yellow-50 border-2 border-ink mb-4">
                <div className="font-bold text-sm text-zinc-900 mb-1">Deseja cadastrar o serviço de Pet Táxi?</div>
                <p className="text-xs font-mono text-zinc-600 mb-4">
                  Buscamos e entregamos seu companheiro com caixas de transporte individuais higienizadas e monitoramento em tempo real.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setHasPetTaxi(false)}
                    className={`p-3 text-xs font-mono font-bold border-2 border-ink transition-all text-center ${
                      !hasPetTaxi ? "bg-ink text-white" : "bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    ✕ NÃO, VOU LEVAR PESSOALMENTE
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasPetTaxi(true)}
                    className={`p-3 text-xs font-mono font-bold border-2 border-ink transition-all text-center ${
                      hasPetTaxi ? "bg-yellow-300 text-black" : "bg-white text-zinc-700 hover:bg-yellow-100"
                    }`}
                  >
                    🚐 SIM! CADASTRAR PET TÁXI
                  </button>
                </div>
              </div>

              {hasPetTaxi && (
                <div className="space-y-4 p-5 bg-yellow-100/70 border-2 border-ink mt-4">
                  <div className="flex items-center justify-between border-b border-ink/20 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <span className="font-mono font-bold text-xs uppercase text-zinc-800">Endereço de Coleta & Entrega</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 font-bold bg-white px-2 py-0.5 border-2 border-ink">ROTA PINK VAN</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-mono font-bold text-[11px] uppercase mb-1">CEP</label>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={addressCep}
                          onChange={(e) => setAddressCep(maskCep(e.target.value))}
                          placeholder="00000-000"
                          maxLength={9}
                          className="w-full p-2.5 bg-white border-2 border-ink font-mono text-xs focus:ring-2 focus:ring-yellow-400"
                        />
                        <button type="button" className="px-2 bg-ink text-white text-xs font-mono font-bold">BUSCAR</button>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-mono font-bold text-[11px] uppercase mb-1">Rua / Avenida *</label>
                      <input
                        type="text"
                        required={hasPetTaxi}
                        value={addressStreet}
                        onChange={(e) => setAddressStreet(e.target.value)}
                        placeholder="Ex: Av. Paulista..."
                        className="w-full p-2.5 bg-white border-2 border-ink font-mono text-xs focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-mono font-bold text-[11px] uppercase mb-1">Número *</label>
                      <input
                        type="text"
                        required={hasPetTaxi}
                        value={addressNumber}
                        onChange={(e) => setAddressNumber(e.target.value)}
                        placeholder="123"
                        className="w-full p-2.5 bg-white border-2 border-ink font-mono text-xs focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block font-mono font-bold text-[11px] uppercase mb-1">Bairro *</label>
                      <input
                        type="text"
                        required={hasPetTaxi}
                        value={addressNeighborhood}
                        onChange={(e) => setAddressNeighborhood(e.target.value)}
                        placeholder="Centro"
                        className="w-full p-2.5 bg-white border-2 border-ink font-mono text-xs focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block font-mono font-bold text-[11px] uppercase mb-1">Apto / Bloco</label>
                      <input
                        type="text"
                        value={addressComplement}
                        onChange={(e) => setAddressComplement(e.target.value)}
                        placeholder="Apto 42"
                        className="w-full p-2.5 bg-white border-2 border-ink font-mono text-xs focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-[11px] uppercase mb-1">Ponto de Referência / Instruções de Embarque</label>
                    <textarea
                      value={addressNotes}
                      onChange={(e) => setAddressNotes(e.target.value)}
                      rows={2}
                      placeholder="Ex: Tocar o interfone 42..."
                      className="w-full p-2.5 bg-white border-2 border-ink font-mono text-xs focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="border-2 border-red-600 bg-red-50 p-3 text-xs font-mono text-red-700 font-bold">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-pink-pop hover:bg-ink text-black hover:text-white font-title font-black text-lg border-[3px] border-ink shadow-brutal-lg hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <span>{loading ? "CADASTRANDO..." : "CONCLUIR CADASTRO DO PET"}</span>
                <span className="font-mono text-base">▶</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-zinc-500">// LIVE_TICKET_PREVIEW</span>
            <span className="font-body text-lg text-pink-pop rotate-[-2deg]">Pré-visualização do crachá</span>
          </div>

          <div className="bg-white border-[3px] border-ink shadow-[5px_5px_0px_#EC4899] relative overflow-hidden p-6">
            <div className="absolute -right-6 -bottom-6 text-8xl font-title font-black opacity-5 pointer-events-none select-none">
              PINK
            </div>
            <div className="flex justify-between items-start border-b-2 border-ink pb-4 mb-4">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">PINK DOG HOSPITAL & SPA</div>
                <h3 className="text-2xl font-title font-black text-black">{petName.toUpperCase() || "NOME DO PET"}</h3>
                <p className="text-xs font-mono text-zinc-600">{speciesLabel} • {petBreed || "Raça mista / SRD"}</p>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 text-xs font-mono font-bold border-2 border-ink inline-block ${
                  sector === "SPA" ? "bg-pink-200 text-pink-900" : "bg-sky-200 text-sky-950"
                }`}>
                  {sector === "SPA" ? "SPA & BANHO" : "CLÍNICA VET"}
                </span>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">TAG #{tagId}</div>
              </div>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-zinc-50 p-2.5 border-2 border-ink">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">// TUTOR RESPONSÁVEL</span>
                <div className="font-bold text-zinc-900 text-sm">{tutorName || "Aguardando preenchimento..."}</div>
                <div className="text-zinc-600">{tutorPhone || "—"}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-50 p-2 border-2 border-ink">
                  <span className="text-[10px] text-zinc-400 uppercase block font-bold">PORTE</span>
                  <span className="font-bold text-zinc-800">{petSize}</span>
                </div>
                <div className="bg-zinc-50 p-2 border-2 border-ink">
                  <span className="text-[10px] text-zinc-400 uppercase block font-bold">IDADE</span>
                  <span className="font-bold text-zinc-800">{petAge || "—"}</span>
                </div>
              </div>
              <div className={`p-3 border-2 border-ink ${hasPetTaxi ? "bg-yellow-100" : "bg-zinc-100 border-dashed"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500">// SERVIÇO DE TRANSPORTE</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold ${
                    hasPetTaxi ? "bg-yellow-400 text-black border-2 border-ink" : "bg-zinc-300 text-zinc-700"
                  }`}>
                    {hasPetTaxi ? "🚐 ROTA CONFIRMADA" : "DISPENSADO"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  {hasPetTaxi
                    ? (addressStreet
                        ? `Coleta agendada em: ${addressStreet}, nº ${addressNumber || "S/N"} — ${addressNeighborhood || "Bairro"}`
                        : "Informe o endereço de coleta no formulário...")
                    : "O tutor fará a entrega e retirada diretamente na unidade."}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-ink flex justify-between items-center">
              <div className="font-mono text-[9px] text-zinc-500">
                EMISSÃO DIGITAL // PINK DOG SYSTEM<br />
                SISTEMA INTEGRADO DE CADASTRO
              </div>
              <div className="font-mono text-xl tracking-widest font-black select-none">||| | |||| | ||</div>
            </div>
          </div>

          <div className="p-4 bg-yellow-200/80 border-[3px] border-ink shadow-brutal-sm font-mono text-xs">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-yellow-950">
              <span>🚐</span>
              <span>COMO FUNCIONA O PET TÁXI:</span>
            </div>
            <ul className="space-y-1 text-zinc-800 text-[11px]">
              <li>• O motorista envia notificação no WhatsApp 15 minutos antes de chegar.</li>
              <li>• Rotas organizadas por proximidade para evitar estresse ao animal.</li>
              <li>• Sanitização entre viagens com laudo veterinário.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
