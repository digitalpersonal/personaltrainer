import React, { useState } from "react";
import { SessaoAgendamento, Aluno } from "../types";
import { Calendar, Clock, Plus, Trash2, CheckCircle, XCircle, AlertCircle, Eye, ArrowRight } from "lucide-react";

interface CalendarSchedulerProps {
  agendamentos: SessaoAgendamento[];
  alunos: Aluno[];
  onAddAgendamento: (sessao: SessaoAgendamento) => void;
  onUpdateAgendamentoStatus: (id: string, status: SessaoAgendamento["status"], justificativa?: string) => void;
}

export default function CalendarScheduler({ agendamentos, alunos, onAddAgendamento, onUpdateAgendamentoStatus }: CalendarSchedulerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSessao, setSelectedSessao] = useState<SessaoAgendamento | null>(null);
  const [justificativaInput, setJustificativaInput] = useState("");

  // Create form states
  const [alunoId, setAlunoId] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [horario, setHorario] = useState("08:00");
  const [duracao, setDuracao] = useState(60);
  const [tipo, setTipo] = useState<SessaoAgendamento["tipo"]>("Presencial");

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoId) return;

    const aluno = alunos.find(a => a.id === alunoId);
    if (!aluno) return;

    const novaSessao: SessaoAgendamento = {
      id: "ag_" + Math.random().toString(36).substr(2, 9),
      alunoId,
      alunoNome: aluno.nome,
      data,
      horario,
      duracao: parseInt(duracao.toString()),
      tipo,
      status: "Agendado"
    };

    onAddAgendamento(novaSessao);
    setShowAddModal(false);
    setAlunoId("");
  };

  const getStatusColor = (status: SessaoAgendamento["status"]) => {
    switch (status) {
      case "Realizado":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-950";
      case "Agendado":
        return "bg-blue-500/10 text-blue-400 border border-blue-950";
      case "Falta Justificada":
        return "bg-zinc-950mber-500/10 text-amber-400 border border-amber-950";
      case "Falta Sem Justificativa":
        return "bg-red-500/10 text-red-400 border border-red-950";
      default:
        return "bg-zinc-800 text-zinc-400 border border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" /> Agenda de Sessões e Personal Trainer
          </h2>
          <p className="text-[11px] text-zinc-500">
            Acompanhamento semanal de agendamentos presenciais, virtuais e controle de evasão por faltas.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Agendar Nova Sessão
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of bookings */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 bg-zinc-950/40 border-b border-zinc-800 flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Histórico de Agendamentos</span>
            <span className="text-[10px] text-zinc-500 font-semibold">{agendamentos.length} sessoes catalogadas</span>
          </div>

          <div className="divide-y divide-zinc-850 max-h-[500px] overflow-y-auto">
            {agendamentos.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 italic text-xs">
                Nenhum agendamento de treino cadastrado na agenda.
              </div>
            ) : (
              [...agendamentos]
                .sort((a, b) => new Date(`${b.data}T${b.horario}`).getTime() - new Date(`${a.data}T${a.horario}`).getTime())
                .map(sessao => (
                  <div
                    key={sessao.id}
                    className={`p-4 hover:bg-zinc-850/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center text-[10px] text-zinc-400 font-bold p-1">
                        <span className="text-emerald-400 text-xs">
                          {sessao.horario}
                        </span>
                        <span>
                          {new Date(`${sessao.data}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">{sessao.alunoNome}</h4>
                        <div className="flex flex-wrap gap-2 items-center mt-1 text-[10px] text-zinc-500 font-medium">
                          <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 text-zinc-400">
                            {sessao.tipo}
                          </span>
                          <span>|</span>
                          <span>Duração: {sessao.duracao} min</span>
                          {sessao.justificativa && (
                            <>
                              <span>|</span>
                              <span className="text-amber-500 italic font-semibold truncate max-w-[150px]">
                                &quot;{sessao.justificativa}&quot;
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(sessao.status)}`}>
                        {sessao.status}
                      </span>
                      
                      <button
                        onClick={() => {
                          setSelectedSessao(sessao);
                          setJustificativaInput(sessao.justificativa || "");
                        }}
                        className="p-1 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 rounded transition-all duration-300 hover:scale-[1.1] active:scale-[0.9] cursor-pointer"
                        title="Registrar Check-In / Presença"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Right Column: Attendance Statistics & Block indicators */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold text-zinc-200 mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Estatísticas de Engajamento
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Total Concluídos</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {agendamentos.filter(s => s.status === "Realizado").length} sessões
                  </span>
                </div>
                <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Inadimplentes (Faltas)</span>
                  <span className="text-lg font-bold text-red-400">
                    {agendamentos.filter(s => s.status === "Falta Sem Justificativa").length} faltas
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Políticas de Ausência (Regras)</h4>
                <div className="bg-zinc-950/40 border border-zinc-800 p-3 rounded-xl text-[11px] text-zinc-400 space-y-2">
                  <p className="flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Limite de Faltas:</strong> Máximo de 3 faltas consecutivas sem justificativa gera alerta visual de <strong>Evasão do Aluno</strong> no perfil administrativo do Personal.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Dica:</strong> Registre justificativas para faltas justificadas de modo a excluir o aluno da estatística de evasão médica.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD APPOINTMENT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-zinc-200">
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-emerald-400" /> Agendar Nova Sessão de Treino
            </h3>
            
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Selecione o Aluno</label>
                <select
                  required
                  value={alunoId}
                  onChange={e => setAlunoId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Selecione o Aluno --</option>
                  {alunos.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Data da Sessão</label>
                  <input
                    type="date"
                    required
                    value={data}
                    onChange={e => setData(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Horário (HH:MM)</label>
                  <input
                    type="time"
                    required
                    value={horario}
                    onChange={e => setHorario(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Duração (Minutos)</label>
                  <input
                    type="number"
                    required
                    value={duracao}
                    onChange={e => setDuracao(parseInt(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Tipo de Aula</label>
                  <select
                    value={tipo}
                    onChange={e => setTipo(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs"
                  >
                    <option value="Presencial">Presencial (Academia/Estúdio)</option>
                    <option value="Online">Online (Videochamada)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MARK PRESENCE / ABSENCE STATUS */}
      {selectedSessao && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-zinc-200">
            <h3 className="text-base font-bold text-emerald-400 mb-2">Registrar Presença / Status da Sessão</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Aluno: <strong className="text-zinc-200">{selectedSessao.alunoNome}</strong> às {selectedSessao.horario} em {selectedSessao.data}
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <button
                type="button"
                onClick={() => {
                  onUpdateAgendamentoStatus(selectedSessao.id, "Realizado");
                  setSelectedSessao(null);
                }}
                className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-950 text-emerald-400 font-bold rounded-xl text-xs flex flex-col items-center gap-1 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Realizado (Presente)
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateAgendamentoStatus(selectedSessao.id, "Falta Sem Justificativa");
                  setSelectedSessao(null);
                }}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-950 text-red-400 font-bold rounded-xl text-xs flex flex-col items-center gap-1 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                <XCircle className="w-5 h-5 text-red-400" />
                Falta (Sem Justificativa)
              </button>
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-3">
              <label className="block text-xs text-zinc-400">Registrar Falta Justificada (Com Motivo)</label>
              <textarea
                rows={2}
                value={justificativaInput}
                onChange={e => setJustificativaInput(e.target.value)}
                placeholder="Ex: Aluno de atestado médico / Viagem de trabalho"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  onUpdateAgendamentoStatus(selectedSessao.id, "Falta Justificada", justificativaInput);
                  setSelectedSessao(null);
                }}
                className="w-full bg-amber-500/10 hover:bg-amber-500/25 border border-amber-950 text-amber-400 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-amber-500" /> Registrar Falta Justificada
              </button>
            </div>

            <div className="flex justify-end mt-6 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setSelectedSessao(null)}
                className="bg-zinc-800 hover:bg-zinc-750 text-zinc-400 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Cancelar / Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
