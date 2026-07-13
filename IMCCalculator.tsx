import React, { useState } from "react";
import { Aluno, Anamnese, ProgramaTreinos, Pagamento, SessaoAgendamento, AvaliacaoFisica, ProgressPhoto, Plano, PersonalTrainerConfig } from "../types";
import { Users, TrendingUp, AlertTriangle, Calendar, UserPlus, FileText, Dumbbell, Activity, ShieldAlert, Sparkles, Plus, Play, BarChart2, Settings } from "lucide-react";
import EvolutionCharts from "./EvolutionCharts";
import TrainerAnalytics from "./TrainerAnalytics";
import TrainerSettings from "./TrainerSettings";
import IMCCalculator from "./IMCCalculator";
import ProgressPhotoGallery from "./ProgressPhotoGallery";
import { generateStudentReportPDF } from "../utils/pdfGenerator";

interface DashboardTrainerProps {
  alunos: Aluno[];
  anamneses: Anamnese[];
  programas: ProgramaTreinos[];
  pagamentos: Pagamento[];
  agendamentos: SessaoAgendamento[];
  avaliacoes: AvaliacaoFisica[];
  progressPhotos: ProgressPhoto[];
  planos: Plano[];
  config: PersonalTrainerConfig;
  onAddProgressPhoto: (photo: ProgressPhoto) => void;
  onDeleteProgressPhoto: (photoId: string) => void;
  onOpenAnamnese: (student: Aluno) => void;
  onOpenWorkoutBuilder: (student: Aluno) => void;
  onAddAluno: (nome: string, email: string, telefone: string, planoId: string) => void;
  onAddAvaliacao: (av: AvaliacaoFisica) => void;
  onUpdatePlano: (plano: Plano) => void;
  onAddPlano: (plano: Plano) => void;
  onDeletePlano: (planoId: string) => void;
  onUpdateConfig: (config: PersonalTrainerConfig) => void;
}

export default function DashboardTrainer({
  alunos,
  anamneses,
  programas,
  pagamentos,
  agendamentos,
  avaliacoes,
  progressPhotos,
  planos,
  config,
  onAddProgressPhoto,
  onDeleteProgressPhoto,
  onOpenAnamnese,
  onOpenWorkoutBuilder,
  onAddAluno,
  onAddAvaliacao,
  onUpdatePlano,
  onAddPlano,
  onDeletePlano,
  onUpdateConfig
}: DashboardTrainerProps) {
  
  // Tab/Search filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "Ativo" | "Congelado" | "Inadimplente">("todos");
  const [trainerMode, setTrainerMode] = useState<"directory" | "analytics" | "settings">("directory");
  
  // Selected student to view full details panel
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [lastAddedAssessment, setLastAddedAssessment] = useState<AvaliacaoFisica | null>(null);

  // New Student registration states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPlano, setNewPlano] = useState("plano_mensal");

  // New Physical Assessment modal states
  const [showAddAvModal, setShowAddAvModal] = useState(false);
  const [avWeight, setAvWeight] = useState(70);
  const [avFat, setAvFat] = useState(15);
  const [avCintura, setAvCintura] = useState(80);
  const [avQuadril, setAvQuadril] = useState(90);
  const [avBraco, setAvBraco] = useState(30);
  const [avCoxa, setAvCoxa] = useState(50);
  const [avFlexoes, setAvFlexoes] = useState(25);
  const [avAgachamento, setAvAgachamento] = useState(40);
  const [avPrancha, setAvPrancha] = useState(60);
  const [avCorrida, setAvCorrida] = useState(2000);

  // High-Level Administrative counts
  const totalStudents = alunos.length;
  const activeStudents = alunos.filter(a => a.status === "Ativo").length;
  const frozenStudents = alunos.filter(a => a.status === "Congelado").length;
  
  // Calculate students in debt (at least one overdue invoice)
  const debtsAlunosIds = new Set(pagamentos.filter(p => p.status === "Atrasado").map(p => p.alunoId));
  const unpaidStudentsCount = debtsAlunosIds.size;

  // Find students at risk of drop-out (evasão): 3 or more consecutive absences (status = 'Falta Sem Justificativa')
  const evasaoRiskStudents = alunos.filter(student => {
    const studentSess = agendamentos
      .filter(s => s.alunoId === student.id)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()) // latest first
      .slice(0, 3);
    
    if (studentSess.length >= 3 && studentSess.every(s => s.status === "Falta Sem Justificativa")) {
      return true;
    }
    return false;
  });

  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    onAddAluno(newName, newEmail, newPhone, newPlano);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setShowAddStudent(false);
  };

  const handleCreateAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    // BMI Calculation
    const selectedStudent = alunos.find(a => a.id === selectedStudentId);
    const studentAnamnese = anamneses.find(an => an.nomeCompleto.toLowerCase().includes(selectedStudent?.nome?.toLowerCase() || ""));
    const heightCm = studentAnamnese?.altura || 175;
    const heightMeters = heightCm / 100;
    const imc = avWeight / (heightMeters * heightMeters);

    // Fat mass calculations
    const massaGorda = avWeight * (avFat / 100);
    const massaMagra = avWeight - massaGorda;

    const newAv: AvaliacaoFisica = {
      id: "av_" + Math.random().toString(36).substr(2, 9),
      alunoId: selectedStudentId,
      data: new Date().toISOString().split("T")[0],
      peso: avWeight,
      altura: heightCm,
      percentualGordura: avFat,
      imc,
      massaMagra,
      massaGorda,
      medidas: {
        pescoço: 38,
        ombro: 110,
        peito: 100,
        cintura: avCintura,
        abdômen: avCintura + 2,
        quadril: avQuadril,
        braçoDireito: avBraco,
        braçoEsquerdo: avBraco,
        coxaDireita: avCoxa,
        coxaEsquerda: avCoxa,
        panturrilhaDireita: 35,
        panturrilhaEsquerda: 35
      },
      performance: {
        flexoes: avFlexoes,
        agachamento: avAgachamento,
        pranchaSegundos: avPrancha,
        corridaDistancia: avCorrida
      },
      observacoes: "Avaliação periódica para recalibragem de cargas e acompanhamento do progresso de metas físicas."
    };

    onAddAvaliacao(newAv);
    setLastAddedAssessment(newAv);
    setShowAddAvModal(false);
  };

  // Filter students based on selection
  const filteredAlunos = alunos.filter(a => {
    const matchesSearch = a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "todos") return matchesSearch;
    if (statusFilter === "Ativo") return matchesSearch && a.status === "Ativo";
    if (statusFilter === "Congelado") return matchesSearch && a.status === "Congelado";
    if (statusFilter === "Inadimplente") return matchesSearch && debtsAlunosIds.has(a.id);
    return matchesSearch;
  });

  const selectedStudent = alunos.find(a => a.id === selectedStudentId);
  const selectedStudentAnamnese = anamneses.find(an => an.nomeCompleto.toLowerCase().includes(selectedStudent?.nome.toLowerCase() || "___"));
  const selectedStudentWorkout = programas.find(p => p.alunoId === selectedStudentId && p.status === "Ativo");
  const selectedStudentAssessments = avaliacoes.filter(av => av.alunoId === selectedStudentId);

  return (
    <div className="space-y-6">
      
      {/* 1. Administrative Metric Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Total de Alunos</span>
            <span className="text-xl font-bold text-zinc-200">{totalStudents} matriculados</span>
            <span className="text-[10px] text-emerald-400 block font-medium">{activeStudents} ativos em treinamento</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Acessos Congelados</span>
            <span className="text-xl font-bold text-zinc-200">{frozenStudents} congelados</span>
            <span className="text-[10px] text-zinc-500 block">Férias / suspensões temporárias</span>
          </div>
        </div>

        {/* Unpaid / Billing Warnings Alert block */}
        <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-md ${unpaidStudentsCount > 0 ? "ring-2 ring-red-950 bg-red-950/5" : ""}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${unpaidStudentsCount > 0 ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-400"}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Inadimplência Crítica</span>
            <span className="text-xl font-bold text-zinc-200">{unpaidStudentsCount} alunos em atraso</span>
            <span className="text-[10px] text-red-400 block font-semibold">{unpaidStudentsCount > 0 ? "Recomenda-se congelar acesso" : "Nenhum atraso"}</span>
          </div>
        </div>

        {/* Evasão drop-out risk alerts */}
        <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-md ${evasaoRiskStudents.length > 0 ? "ring-2 ring-amber-950 bg-amber-950/5" : ""}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${evasaoRiskStudents.length > 0 ? "bg-amber-500/20 text-amber-400 animate-pulse" : "bg-zinc-800 text-zinc-400"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Risco de Evasão (Faltas)</span>
            <span className="text-xl font-bold text-zinc-200">{evasaoRiskStudents.length} alunos sob alerta</span>
            <span className="text-[10px] text-amber-400 block font-semibold">{evasaoRiskStudents.length > 0 ? "3 faltas consecutivas!" : "Excelente frequência"}</span>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex border-b border-zinc-800 pb-1">
        <button
          onClick={() => setTrainerMode("directory")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all duration-300 relative cursor-pointer ${
            trainerMode === "directory"
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Users className="w-4 h-4" />
          Gerenciar Alunos & Prontuários
          {trainerMode === "directory" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => setTrainerMode("analytics")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all duration-300 relative cursor-pointer ${
            trainerMode === "analytics"
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Módulo de Evolução Corporal (Recharts)
          {trainerMode === "analytics" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => setTrainerMode("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all duration-300 relative cursor-pointer ${
            trainerMode === "settings"
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Settings className="w-4 h-4" />
          Configurações
          {trainerMode === "settings" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>
      </div>

      {trainerMode === "directory" ? (
        /* 2. Main Workspace (Directory + Full Details Panel) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Student Directory (Filters & Search) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Diretório de Alunos</h3>
              <p className="text-[10px] text-zinc-500">Gestão integrada de prontuários, treinos e saúde</p>
            </div>
            <button
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" /> Cadastrar Aluno
            </button>
          </div>

          {/* Quick inline registration panel */}
          {showAddStudent && (
            <form onSubmit={handleCreateStudentSubmit} className="bg-zinc-950/40 border border-zinc-800 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-400">Pré-Cadastro de Novo Aluno</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nome Completo"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-zinc-200 w-full"
                />
                <input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-zinc-200 w-full"
                />
                <input
                  type="text"
                  placeholder="Telefone"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-zinc-200 w-full"
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-medium">Plano Inicial:</span>
                  <select
                    value={newPlano}
                    onChange={e => setNewPlano(e.target.value)}
                    className="bg-zinc-900 text-xs border border-zinc-850 p-1 rounded"
                  >
                    {planos.map(plano => (
                      <option key={plano.id} value={plano.id}>{plano.nome} (R$ {plano.valor}/mês)</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    className="bg-zinc-800 hover:bg-zinc-750 text-[10px] text-zinc-400 px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] px-4 py-1.5 rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  >
                    Salvar Aluno
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Filters Area */}
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Buscar aluno por nome ou email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-xs rounded-xl px-3 py-2 text-zinc-200 flex-1 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-1">
              {(["todos", "Ativo", "Congelado", "Inadimplente"] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                    statusFilter === f
                      ? "bg-emerald-500 text-black"
                      : "bg-zinc-950 text-zinc-500 border border-zinc-800 hover:text-zinc-300"
                  }`}
                >
                  {f === "todos" ? "Todos" : f}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Listings */}
          <div className="divide-y divide-zinc-850">
            {filteredAlunos.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 italic text-xs">
                Nenhum aluno correspondente aos filtros foi encontrado.
              </div>
            ) : (
              filteredAlunos.map(a => {
                const anamnese = anamneses.find(an => an.nomeCompleto.toLowerCase().includes(a.nome.toLowerCase()));
                const activeProg = programas.find(p => p.alunoId === a.id && p.status === "Ativo");
                const isLateInDebt = debtsAlunosIds.has(a.id);
                const isRisk = evasaoRiskStudents.some(s => s.id === a.id);

                return (
                  <div
                    key={a.id}
                    className={`py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 cursor-pointer transition-all hover:bg-zinc-850/20 px-2 rounded-xl ${
                      selectedStudentId === a.id ? "bg-emerald-500/5 ring-1 ring-emerald-500/20" : ""
                    }`}
                    onClick={() => {
                      setSelectedStudentId(a.id);
                      setLastAddedAssessment(null);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={a.fotoUrl}
                        alt={a.nome}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl border border-zinc-800 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-zinc-100">{a.nome}</h4>
                          {isLateInDebt && (
                            <span className="bg-red-500/15 text-red-400 border border-red-950 text-[8px] font-bold uppercase px-1 rounded">
                              Inadimplente
                            </span>
                          )}
                          {isRisk && (
                            <span className="bg-zinc-950mber-500/20 text-amber-400 border border-amber-950 text-[8px] font-bold uppercase px-1 rounded animate-pulse">
                              Risco Evasão
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{a.email}</p>
                        <div className="flex gap-2 items-center mt-1">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                              anamnese?.status === "Completa"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-950"
                                : "bg-zinc-950 text-zinc-500 border border-zinc-850"
                            }`}
                          >
                            Anamnese: {anamnese ? anamnese.status : "Pendente"}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                              activeProg
                                ? "bg-blue-500/10 text-blue-400 border border-blue-950"
                                : "bg-zinc-950 text-zinc-500 border border-zinc-850"
                            }`}
                          >
                            Treino: {activeProg ? "Ativo" : "Pendente"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 w-full md:w-auto justify-end" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenAnamnese(a)}
                        className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 text-zinc-300 px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                        title="Acessar/Preencher Anamnese"
                      >
                        <FileText className="w-3 h-3 inline mr-1 text-zinc-400" /> Anamnese
                      </button>
                      <button
                        onClick={() => onOpenWorkoutBuilder(a)}
                        className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 text-zinc-300 px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                        title="Montar Programa de Treinos"
                      >
                        <Dumbbell className="w-3 h-3 inline mr-1 text-zinc-400" /> Prescrever/Editar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detailed Student File / Interactive metrics */}
        <div className="lg:col-span-5">
          {selectedStudent ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-6">
              
              {/* Profile header */}
              <div className="flex justify-between items-start border-b border-zinc-850 pb-4">
                <div className="flex gap-3">
                  <img
                    src={selectedStudent.fotoUrl}
                    alt={selectedStudent.nome}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-zinc-200">{selectedStudent.nome}</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{selectedStudent.email}</p>
                    <p className="text-[10px] text-zinc-400 font-medium mt-1">Celular: {selectedStudent.telefone || "Não cadastrado"}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedStudent.status === "Ativo"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-950"
                        : "bg-zinc-950 text-zinc-500 border border-zinc-850"
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                  <button
                    id="export-student-report-pdf-btn"
                    type="button"
                    onClick={() => generateStudentReportPDF(selectedStudent, selectedStudentAnamnese, selectedStudentWorkout, selectedStudentAssessments)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 text-[10px] font-bold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                    title="Exportar Relatório PDF Completo"
                  >
                    <FileText className="w-3.5 h-3.5" /> Exportar Relatório
                  </button>
                </div>
              </div>

              {/* Anamnese Overview & Health metrics inside student file */}
              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5">Diagnóstico Clínico (Anamnese)</h4>
                {selectedStudentAnamnese ? (
                  <div className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-xl space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-zinc-500">Objetivo:</span> <strong className="text-emerald-400">{selectedStudentAnamnese.objetivoPrincipal}</strong></div>
                      <div><span className="text-zinc-500">Experiência:</span> <strong className="text-zinc-300 capitalize">{selectedStudentAnamnese.experienciaMusculacao}</strong></div>
                      <div className="col-span-2 border-t border-zinc-900 pt-1.5">
                        <span className="text-zinc-500">Lesões / Restrições:</span>{" "}
                        <strong className="text-amber-500">{selectedStudentAnamnese.lesoes || "Nenhuma relatada"}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-zinc-500">Condições Médicas:</span>{" "}
                        <strong className="text-red-400">{selectedStudentAnamnese.condicoesMedicas.join(", ") || "Nenhuma"}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-950/20 border border-zinc-850 border-dashed p-3 rounded-xl text-center text-xs italic text-zinc-500">
                    Nenhuma anamnese digital associada. Peça ao aluno para preenchê-la.
                  </div>
                )}
              </div>

              {/* Physical Evaluation progress block */}
              <div className="border-t border-zinc-850 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Métricas de Avaliação Corporal</h4>
                  <button
                    onClick={() => setShowAddAvModal(true)}
                    className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Avaliação
                  </button>
                </div>

                {/* IMCCalculator Widget */}
                <IMCCalculator
                  aluno={selectedStudent}
                  anamnese={selectedStudentAnamnese}
                  avaliacoes={selectedStudentAssessments}
                  lastAddedAssessment={lastAddedAssessment}
                />

                {selectedStudentAssessments.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-zinc-950/40 p-2 rounded-lg border border-zinc-850">
                        <span className="text-[10px] text-zinc-500 block uppercase">Último Peso</span>
                        <span className="font-bold text-zinc-200">{selectedStudentAssessments[selectedStudentAssessments.length - 1].peso} kg</span>
                      </div>
                      <div className="bg-zinc-950/40 p-2 rounded-lg border border-zinc-850">
                        <span className="text-[10px] text-zinc-500 block uppercase">Gordura %</span>
                        <span className="font-bold text-emerald-400">{selectedStudentAssessments[selectedStudentAssessments.length - 1].percentualGordura}%</span>
                      </div>
                      <div className="bg-zinc-950/40 p-2 rounded-lg border border-zinc-850">
                        <span className="text-[10px] text-zinc-500 block uppercase">Massa Magra</span>
                        <span className="font-bold text-zinc-200">{selectedStudentAssessments[selectedStudentAssessments.length - 1].massaMagra.toFixed(1)} kg</span>
                      </div>
                    </div>

                    {/* Renders Recharts Charts for the specific student */}
                    <div className="border border-zinc-850 p-2 rounded-xl bg-zinc-950/10">
                      <h5 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Gráfico de Evolução de Resultados</h5>
                      <EvolutionCharts aluno={selectedStudent} avaliacoes={selectedStudentAssessments} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-950/20 border border-zinc-850 border-dashed p-3 rounded-xl text-center text-xs italic text-zinc-500">
                    Ainda não há avaliações corporais gravadas. Clique em &quot;Adicionar Avaliação&quot; acima para registrar as primeiras medições de fitômetro e balança.
                  </div>
                )}
              </div>

              {/* Progress Photo Gallery block */}
              <div className="border-t border-zinc-850 pt-4">
                <ProgressPhotoGallery
                  aluno={selectedStudent}
                  photos={progressPhotos}
                  onAddPhoto={onAddProgressPhoto}
                  onDeletePhoto={onDeleteProgressPhoto}
                  isTrainer={true}
                />
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-850 border-dashed rounded-2xl p-10 text-center italic text-zinc-500 text-xs h-full flex flex-col items-center justify-center space-y-2">
              <Activity className="w-10 h-10 text-zinc-600 animate-pulse" />
              <span>Selecione um aluno na lista ao lado para acessar a ficha clínica de prontuário, avaliar evolução física em gráficos de Recharts, e registrar pesagens mensais.</span>
            </div>
          )}
        </div>
      </div>
      ) : trainerMode === "analytics" ? (
        <TrainerAnalytics
          alunos={alunos}
          avaliacoes={avaliacoes}
          initialSelectedStudentId={selectedStudentId}
        />
      ) : (
        <TrainerSettings
          planos={planos}
          config={config}
          onUpdatePlano={onUpdatePlano}
          onAddPlano={onAddPlano}
          onDeletePlano={onDeletePlano}
          onUpdateConfig={onUpdateConfig}
        />
      )}

      {/* MODAL: ADD PHYSICAL EVALUATION ASSESSMENT */}
      {showAddAvModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-zinc-200">
            <h3 className="text-base font-bold text-emerald-400 mb-2">Lançar Nova Avaliação Física Corporal</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Aluno: <strong className="text-zinc-200">{selectedStudent?.nome}</strong>
            </p>

            <form onSubmit={handleCreateAssessmentSubmit} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Peso Corporal (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={avWeight}
                    onChange={e => setAvWeight(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Gordura Estimada (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={avFat}
                    onChange={e => setAvFat(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Circ. Cintura (cm)</label>
                  <input
                    type="number"
                    required
                    value={avCintura}
                    onChange={e => setAvCintura(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Circ. Quadril (cm)</label>
                  <input
                    type="number"
                    required
                    value={avQuadril}
                    onChange={e => setAvQuadril(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Circ. Braço (cm)</label>
                  <input
                    type="number"
                    required
                    value={avBraco}
                    onChange={e => setAvBraco(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Circ. Coxa (cm)</label>
                  <input
                    type="number"
                    required
                    value={avCoxa}
                    onChange={e => setAvCoxa(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2">Testes de Desempenho Físico (Capacidade)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-400 mb-1">Flexões (Repet.)</label>
                    <input
                      type="number"
                      required
                      value={avFlexoes}
                      onChange={e => setAvFlexoes(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-400 mb-1">Agachamento (Repet.)</label>
                    <input
                      type="number"
                      required
                      value={avAgachamento}
                      onChange={e => setAvAgachamento(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-400 mb-1">Prancha (Segundos)</label>
                    <input
                      type="number"
                      required
                      value={avPrancha}
                      onChange={e => setAvPrancha(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-400 mb-1">Corrida de 12min (m)</label>
                    <input
                      type="number"
                      required
                      value={avCorrida}
                      onChange={e => setAvCorrida(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddAvModal(false)}
                  className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                >
                  Confirmar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
