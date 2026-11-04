"use client";
import { useEffect, useState } from "react";

export default function HrPage() {
  const [view, setView] = useState<'staff' | 'clients'>('staff');
  const [staff, setStaff] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalStaff, setModalStaff] = useState<any>(null);
  const [modalVisits, setModalVisits] = useState<any>(null);

  useEffect(() => {
    fetch('/api/staff').then(r => r.json()).then(setStaff);
    fetch('/api/clients').then(r => r.json()).then(setClients);
  }, []);

  const filteredClients = clients.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.pets?.some((p: any) => p.name.toLowerCase().includes(search.toLowerCase()))
  );

  async function saveRoleChanges(e: React.FormEvent) {
    e.preventDefault();
    if (!modalStaff) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const body = {
      id: modalStaff.id,
      sector: fd.get('sector'),
      roleTitle: fd.get('roleTitle'),
      crmv: fd.get('crmv'),
      permAdvanceStages: fd.get('permAdvanceStages') === 'on',
      permEditRecords: fd.get('permEditRecords') === 'on',
      permFinancial: fd.get('permFinancial') === 'on',
    };
    await fetch('/api/staff', { method: 'PATCH', body: JSON.stringify(body) });
    setModalStaff(null);
    fetch('/api/staff').then(r => r.json()).then(setStaff);
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto mb-6 bg-white border-[3px] border-[#18181B] shadow-[5px_5px_0px_#18181B] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F472B6] border-[3px] border-[#18181B] flex items-center justify-center font-bold text-2xl text-white">PD</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5">// ADMIN_HR_CLIENTS</span>
              <span className="text-xs font-mono text-zinc-500">PAINEL GERENCIAL</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">GESTÃO DE CARGOS & CLIENTES</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-100 p-1 border-[3px] border-[#18181B]">
          <button onClick={() => setView('staff')} className={`px-4 py-2 text-xs md:text-sm font-mono font-bold transition-all ${view === 'staff' ? 'bg-black text-white' : 'text-zinc-600 hover:text-black'}`}>
            👔 FUNCIONÁRIOS & CARGOS
          </button>
          <button onClick={() => setView('clients')} className={`px-4 py-2 text-xs md:text-sm font-mono font-bold transition-all ${view === 'clients' ? 'bg-black text-white' : 'text-zinc-600 hover:text-black'}`}>
            🐾 CLIENTES & PETS
          </button>
        </div>
      </header>

      {/* STAFF VIEW */}
      {view === 'staff' && (
        <section className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-[3px] border-[#18181B] shadow-[3px_3px_0px_#18181B]">
            <div>
              <h2 className="text-xl font-bold">QUADRO DE COLABORADORES</h2>
              <p className="text-xs font-mono text-zinc-500">Defina setores (SPA / Veterinária), cargos técnicos e permissões operacionais.</p>
            </div>
            <button className="px-4 py-2 bg-[#F472B6] text-black text-xs font-mono font-bold border-[3px] border-[#18181B] shadow-[3px_3px_0px_#18181B] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
              + NOVO COLABORADOR
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {staff.map((member: any) => {
              const isSpa = member.sector === 'SPA';
              const isVet = member.sector === 'VET';
              const badgeBg = isSpa ? 'bg-pink-100 text-pink-800 border-pink-400' : isVet ? 'bg-sky-100 text-sky-800 border-sky-400' : 'bg-amber-100 text-amber-900 border-amber-400';
              const sectorTag = isSpa ? 'SPA & ESTÉTICA' : isVet ? 'CLÍNICA VETERINÁRIA' : 'ADMINISTRAÇÃO';

              return (
                <div key={member.id} className="bg-white border-[3px] border-[#18181B] shadow-[3px_3px_0px_#18181B] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border-[3px] border-[#18181B] ${badgeBg}`}>{sectorTag}</span>
                      <span className="text-xs font-mono font-bold text-zinc-400">{member.id.slice(0,8)}</span>
                    </div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <div className="mt-2 p-2 bg-zinc-50 border-[3px] border-[#18181B] font-mono">
                      <div className="text-[10px] text-zinc-400 uppercase font-bold">// CARGO ATUAL</div>
                      <div className="text-xs font-bold text-zinc-900">{member.roleTitle}</div>
                      {member.crmv && member.crmv !== '—' && <div className="text-[11px] text-sky-700 mt-0.5 font-semibold">{member.crmv}</div>}
                    </div>
                    <div className="mt-3 font-mono text-[11px] space-y-1 text-zinc-600">
                      <div className="flex items-center gap-1.5">
                        <span className={member.permAdvanceStages ? 'text-green-600 font-bold' : 'text-zinc-300 font-bold'}>●</span>
                        <span>Painel Operacional: {member.permAdvanceStages ? 'Habilitado' : 'Sem acesso'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={member.permEditRecords ? 'text-green-600 font-bold' : 'text-zinc-300 font-bold'}>●</span>
                        <span>Edição de Prontuários: {member.permEditRecords ? 'Liberado' : 'Bloqueado'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t-2 border-zinc-100 flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">STATUS: {member.status}</span>
                    <button onClick={() => setModalStaff(member)} className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black font-mono font-bold text-xs border-[3px] border-[#18181B] transition-colors">
                      ⚙ EDITAR CARGO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CLIENTS VIEW */}
      {view === 'clients' && (
        <section className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 border-[3px] border-[#18181B] shadow-[3px_3px_0px_#18181B]">
            <div>
              <h2 className="text-xl font-bold">FICHA CADASTRAL DE TUTORES & PETS</h2>
              <p className="text-xs font-mono text-zinc-500">Histórico de frequência, datas de atendimento e contato rápido.</p>
            </div>
            <div className="flex items-center gap-3">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtrar tutor, telefone ou pet..." className="px-3 py-2 bg-zinc-50 border-[3px] border-[#18181B] text-xs font-mono w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#F472B6]" />
              <button className="px-4 py-2 bg-sky-300 text-black text-xs font-mono font-bold border-[3px] border-[#18181B] shadow-[3px_3px_0px_#18181B] hover:bg-sky-400 whitespace-nowrap">+ NOVO CLIENTE</button>
            </div>
          </div>

          <div className="bg-white border-[3px] border-[#18181B] shadow-[5px_5px_0px_#18181B] overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm font-mono">
              <thead>
                <tr className="bg-zinc-100 border-b-[3px] border-black text-xs uppercase text-zinc-600">
                  <th className="p-4">Nome do Cliente (Tutor)</th>
                  <th className="p-4">Telefone</th>
                  <th className="p-4">Pet (Espécie/Raça)</th>
                  <th className="p-4 text-center">Visitas</th>
                  <th className="p-4">Último Atendimento</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredClients.map((cli: any) => (
                  <tr key={cli.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-zinc-900">{cli.name}</div>
                      <div className="text-[11px] text-zinc-400">{cli.id.slice(0,8)}</div>
                    </td>
                    <td className="p-4">
                      <a href={`https://wa.me/55${cli.phone.replace(/\\D/g, '')}`} target="_blank" className="text-zinc-800 hover:text-pink-600 font-bold underline decoration-pink-300">{cli.phone}</a>
                    </td>
                    <td className="p-4">
                      {cli.pets?.map((p: any) => (
                        <div key={p.id}>
                          <div className="font-bold text-pink-700">🐶 {p.name}</div>
                          <div className="text-xs text-zinc-500">{p.breed}</div>
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 bg-yellow-100 text-yellow-900 font-bold text-xs border-[3px] border-[#18181B]">
                        {cli.pets?.reduce((acc: number, p: any) => acc + (p.appointments?.length || 0), 0)} visitas
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-zinc-800">{cli.updatedAt ? new Date(cli.updatedAt).toLocaleDateString('pt-BR') : '-'}</div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setModalVisits(cli)} className="px-3 py-1 bg-white border-[3px] border-[#18181B] text-xs font-bold hover:bg-black hover:text-white transition-colors">HISTÓRICO COMPLETO ↗</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal Editar Cargo */}
      {modalStaff && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-[3px] border-[#18181B] shadow-[8px_8px_0px_#18181B] w-full max-w-lg p-6 relative">
            <button onClick={() => setModalStaff(null)} className="absolute top-4 right-4 w-8 h-8 bg-zinc-100 border-[3px] border-[#18181B] font-bold flex items-center justify-center hover:bg-black hover:text-white">✕</button>
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-wider">EDIT_ROLE_WORKFLOW</span>
            <h3 className="text-2xl font-bold mt-2">Alterar Cargo & Setor</h3>
            <p className="text-xs font-mono text-zinc-500 mb-6">Atualize as atribuições e o nível de autorização do colaborador.</p>
            <form onSubmit={saveRoleChanges} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Nome do Colaborador</label>
                <input defaultValue={modalStaff.name} disabled className="w-full bg-zinc-100 p-2.5 border-[3px] border-[#18181B] cursor-not-allowed text-zinc-500 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Setor Alocado</label>
                  <select name="sector" defaultValue={modalStaff.sector} className="w-full bg-white p-2.5 border-[3px] border-[#18181B] focus:ring-2 focus:ring-[#F472B6]">
                    <option value="SPA">SPA & Estética</option>
                    <option value="VET">Clínica Veterinária</option>
                    <option value="GERAL">Administração Geral</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Novo Cargo</label>
                  <input name="roleTitle" defaultValue={modalStaff.roleTitle} className="w-full bg-white p-2.5 border-[3px] border-[#18181B]" />
                </div>
              </div>
              {modalStaff.sector === 'VET' && (
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Registro Profissional (CRMV)</label>
                  <input name="crmv" defaultValue={modalStaff.crmv || ''} placeholder="Ex: CRMV-SP 44.912" className="w-full bg-white p-2.5 border-[3px] border-[#18181B]" />
                </div>
              )}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Permissões de Acesso</label>
                <div className="space-y-2 p-3 bg-zinc-50 border-[3px] border-[#18181B]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="permAdvanceStages" defaultChecked={modalStaff.permAdvanceStages} className="w-4 h-4 accent-pink-500" />
                    <span>Avançar etapas operacionais no Painel Staff</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="permEditRecords" defaultChecked={modalStaff.permEditRecords} className="w-4 h-4 accent-pink-500" />
                    <span>Editar prontuários e fichas médicas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="permFinancial" defaultChecked={modalStaff.permFinancial} className="w-4 h-4 accent-pink-500" />
                    <span>Acessar relatórios financeiros e faturamento</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t-2 border-zinc-200">
                <button type="button" onClick={() => setModalStaff(null)} className="px-4 py-2 bg-zinc-200 border-[3px] border-[#18181B] font-bold">CANCELAR</button>
                <button type="submit" className="px-5 py-2 bg-[#F472B6] text-black font-bold border-[3px] border-[#18181B] hover:bg-pink-500">SALVAR CARGO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Histórico de Visitas */}
      {modalVisits && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-[3px] border-[#18181B] shadow-[8px_8px_0px_#18181B] w-full max-w-xl p-6 relative">
            <button onClick={() => setModalVisits(null)} className="absolute top-4 right-4 w-8 h-8 bg-zinc-100 border-[3px] border-[#18181B] font-bold flex items-center justify-center hover:bg-black hover:text-white">✕</button>
            <span className="px-2 py-0.5 bg-yellow-300 text-black text-[10px] font-mono font-bold uppercase tracking-wider border-[3px] border-[#18181B]">HISTÓRICO_ATENDIMENTO</span>
            <h3 className="text-2xl font-bold mt-2">Histórico — {modalVisits.pets?.[0]?.name || 'Pet'}</h3>
            <p className="text-xs font-mono text-zinc-500 mb-4">Tutor: {modalVisits.name} • {modalVisits.phone}</p>
            <div className="border-[3px] border-[#18181B] max-h-60 overflow-y-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-zinc-100 border-b border-black">
                  <tr><th className="p-2.5">Data</th><th className="p-2.5">Setor</th><th className="p-2.5">Procedimento</th><th className="p-2.5 text-right">Profissional</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {modalVisits.pets?.flatMap((p: any) => p.appointments || []).map((v: any, i: number) => (
                    <tr key={i}>
                      <td className="p-2.5 font-bold">{new Date(v.date).toLocaleDateString('pt-BR')}</td>
                      <td className="p-2.5"><span className={`px-1.5 py-0.5 text-[10px] font-bold ${v.service?.category === 'BATH' || v.service?.category === 'GROOMING' ? 'bg-pink-100 text-pink-800' : 'bg-sky-100 text-sky-800'}`}>{v.service?.category}</span></td>
                      <td className="p-2.5 text-zinc-700">{v.service?.name}</td>
                      <td className="p-2.5 text-right font-semibold text-zinc-600">{v.vet?.name || v.groomer?.name || '-'}</td>
                    </tr>
                  ))}
                  {(!modalVisits.pets || modalVisits.pets.every((p: any) => !p.appointments?.length)) && (
                    <tr><td colSpan={4} className="p-4 text-center text-zinc-400">Nenhum histórico encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setModalVisits(null)} className="px-5 py-2 bg-black text-white font-mono text-xs font-bold border-[3px] border-[#18181B]">FECHAR</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
