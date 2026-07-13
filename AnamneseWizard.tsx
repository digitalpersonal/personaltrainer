import React, { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { Aluno, Anamnese, ProgramaTreinos, Pagamento, SessaoAgendamento, AvaliacaoFisica, Mensagem, ProgressPhoto, Plano, PersonalTrainerConfig } from "./types";
import { db, auth } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Component imports
import DashboardTrainer from "./components/DashboardTrainer";
import DashboardStudent from "./components/DashboardStudent";
import FinanceModule from "./components/FinanceModule";
import CalendarScheduler from "./components/CalendarScheduler";
import AnamneseWizard from "./components/AnamneseWizard";
import WorkoutConstructor from "./components/WorkoutConstructor";
import Login from "./components/Login";
// ... (rest of imports remain the same)
import {
  Dumbbell,
  Users,
  DollarSign,
  Calendar,
  LogOut,
  Sparkles,
  ShieldAlert,
  Menu,
  Activity,
  Award,
  MessageCircle,
  ExternalLink
} from "lucide-react";

export default function App() {
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Core application state
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [anamneses, setAnamneses] = useState<Anamnese[]>([]);
  const [programas, setProgramas] = useState<ProgramaTreinos[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [agendamentos, setAgendamentos] = useState<SessaoAgendamento[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([
    { id: "plano_mensal", nome: "Mensal", valor: 150, sessoesInclusas: 12, descricao: "" },
    { id: "plano_trimestral", nome: "Trimestral", valor: 400, sessoesInclusas: 36, descricao: "" }
  ]);
  const [config, setConfig] = useState<PersonalTrainerConfig>({
    nome: "Felipe",
    cref: "123456-G/SP",
    especializacoes: ["Hipertrofia", "Emagrecimento"],
    fotoUrl: "",
    corPrimaria: "#10b981",
    corSecundaria: "#000000",
    modoEscuro: true,
    notificacoes: { whatsapp: true, email: false, push: false },
    lembretesAutomaticos: true
  });

  // Alunos ordenados alfabeticamente
  const sortedAlunos = [...alunos].sort((a, b) => a.nome.localeCompare(b.nome));

  useEffect(() => {
    if (loading || !user) return;
    const fetchData = async () => {
      const alunosSnapshot = await getDocs(collection(db, "alunos"));
      setAlunos(alunosSnapshot.docs.map(doc => doc.data() as Aluno));
      
      const anamnesesSnapshot = await getDocs(collection(db, "anamneses"));
      setAnamneses(anamnesesSnapshot.docs.map(doc => doc.data() as Anamnese));
      
      const programasSnapshot = await getDocs(collection(db, "programas"));
      setProgramas(programasSnapshot.docs.map(doc => doc.data() as ProgramaTreinos));
      
      const pagamentosSnapshot = await getDocs(collection(db, "pagamentos"));
      setPagamentos(pagamentosSnapshot.docs.map(doc => doc.data() as Pagamento));
      
      const agendamentosSnapshot = await getDocs(collection(db, "agendamentos"));
      setAgendamentos(agendamentosSnapshot.docs.map(doc => doc.data() as SessaoAgendamento));
      
      const avaliacoesSnapshot = await getDocs(collection(db, "avaliacoes"));
      setAvaliacoes(avaliacoesSnapshot.docs.map(doc => doc.data() as AvaliacaoFisica));
      
      const progressPhotosSnapshot = await getDocs(collection(db, "progressPhotos"));
      setProgressPhotos(progressPhotosSnapshot.docs.map(doc => doc.data() as ProgressPhoto));
    };
    fetchData();
  }, [user, loading]);

  // Active Admin Tab (for Personal Trainer)
  const [activeAdminTab, setActiveAdminTab] = useState<"dashboard" | "finance" | "calendar">("dashboard");

  // Secondary sub-views (overlay wizard / program builders)
  const [activeBuilderStudent, setActiveBuilderStudent] = useState<Aluno | null>(null);
  const [activeAnamneseStudent, setActiveAnamneseStudent] = useState<Aluno | null>(null);

  // Quick State Modifiers (Callbacks passed to sub-components)
  
  const handleAddAluno = (nome: string, email: string, telefone: string, planoId: string) => {
    const newStudent: Aluno = {
      id: "aluno_" + (alunos.length + 1),
      nome,
      email,
      telefone,
      fotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
      status: "Ativo",
      planoAtivoId: planoId,
      dataCadastro: new Date().toISOString().split("T")[0],
      ultimoAcesso: new Date().toISOString(),
      contatoEmergencia: { nome: "Não informado", telefone: "", parentesco: "" },
      anamneseCompleta: false
    };

    // Pre-create pending anamnese
    const newAnamnese: Anamnese = {
      nomeCompleto: nome,
      dataNascimento: "",
      genero: "Masculino",
      estadoCivil: "Solteiro",
      telefone,
      email,
      endereco: "",
      profissao: "",
      horarioTrabalho: "",
      nivelEstresse: 5,
      condicoesMedicas: [],
      cirurgiasAnteriores: "",
      medicacoesContinuas: "",
      alergias: "",
      lesoes: "",
      restricoesMedicas: "",
      contatoEmergencia: { nome: "", telefone: "", parentesco: "" },
      praticaAtividade: false,
      detalheAtividade: "",
      atividadesAnteriores: "",
      esportesPraticados: "",
      experienciaMusculacao: "iniciante",
      preferenciasHorario: "",
      disponibilidadeSemanal: [],
      objetivoPrincipal: "Hipertrofia",
      objetivosSecundarios: "",
      pesoAtual: 0,
      pesoDesejado: 0,
      altura: 0,
      circunferencias: { cintura: 0, quadril: 0, braço: 0, coxa: 0, panturrilha: 0 },
      gorduraEstimada: 0,
      refeicoesDia: 3,
      consumoAgua: 2,
      sonoHoras: 7,
      sonoDificuldade: false,
      alcoolTabaco: "",
      nivelMotivacao: 8,
      termoResponsabilidadeAceito: false,
      termoImagemAceito: false,
      assinaturaDigital: "",
      dataPreenchimento: "",
      status: "Pendente",
      ultimaRevisao: ""
    };

    // Add first month pending payment log
    const newPay: Pagamento = {
      id: "pag_auto_" + Math.random().toString(36).substr(2, 9),
      alunoId: newStudent.id,
      planoId,
      valor: planoId === "plano_mensal" ? 150 : planoId === "plano_trimestral" ? 400 : 750,
      dataVencimento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days from now
      mesReferencia: "Mês Inicial/2026",
      status: "Pendente"
    };

    setAlunos(prev => [...prev, newStudent]);
    setAnamneses(prev => [...prev, newAnamnese]);
    setPagamentos(prev => [...prev, newPay]);
    alert(`Aluno(a) ${nome} cadastrado com sucesso! Um faturamento pendente foi gerado automaticamente.`);
  };

  const handleSaveAnamnese = (data: Anamnese) => {
    setAnamneses(prev => {
      const idx = prev.findIndex(an => an.nomeCompleto.toLowerCase() === data.nomeCompleto.toLowerCase());
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = data;
        return updated;
      }
      return [...prev, data];
    });

    // Mark student anamnese as complete in student record
    setAlunos(prev =>
      prev.map(a =>
        a.nome.toLowerCase() === data.nomeCompleto.toLowerCase() ? { ...a, anamneseCompleta: true } : a
      )
    );
    setActiveAnamneseStudent(null);
  };

  const handleSaveWorkoutProgram = (programa: ProgramaTreinos) => {
    // Check if student has complete anamnese
    const student = alunos.find(a => a.id === programa.alunoId);
    const anamnese = anamneses.find(an => an.nomeCompleto.toLowerCase() === student?.nome.toLowerCase());
    
    if (anamnese?.status !== "Completa") {
      alert("Atenção: Por razões de saúde e responsabilidade médica, é proibido prescrever treinos para alunos com Anamnese Pendente! Favor preencher primeiro.");
      return;
    }

    setProgramas(prev => {
      // Invalidate existing active programs for this student
      const deactivated = prev.map(p => p.alunoId === programa.alunoId ? { ...p, status: "Concluido" as const } : p);
      return [...deactivated, programa];
    });
    setActiveBuilderStudent(null);
    alert(`Novo programa de treino "${programa.titulo}" salvo com sucesso para o aluno!`);
  };

  const handleAddPayment = (newPag: Pagamento) => {
    setPagamentos(prev => [...prev, newPag]);
  };

  const handleUpdatePaymentStatus = (id: string, status: Pagamento["status"]) => {
    setPagamentos(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status,
              dataPagamento: status === "Pago" ? new Date().toISOString().split("T")[0] : undefined,
              formaPagamento: status === "Pago" ? "Pix" : undefined
            }
          : p
      )
    );
  };

  const handleUpdatePlano = (updated: Plano) => {
    setPlanos(prev => prev.map(p => p.id === updated.id ? updated : p));
  };
  const handleAddPlano = (novo: Plano) => {
    setPlanos(prev => [...prev, novo]);
  };
  const handleDeletePlano = (id: string) => {
    setPlanos(prev => prev.filter(p => p.id !== id));
  };
  const handleUpdateConfig = (newConfig: PersonalTrainerConfig) => {
    setConfig(newConfig);
  };

  const handleFreezeAluno = (alunoId: string, status: Aluno["status"]) => {
    setAlunos(prev => prev.map(a => (a.id === alunoId ? { ...a, status } : a)));
    alert(`O acesso do aluno foi alterado para: ${status.toUpperCase()}!`);
  };

  const handleAddAppointment = (sessao: SessaoAgendamento) => {
    setAgendamentos(prev => [...prev, sessao]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: SessaoAgendamento["status"], justificativa?: string) => {
    setAgendamentos(prev =>
      prev.map(s => (s.id === id ? { ...s, status, justificativa: justificativa || s.justificativa } : s))
    );
  };

  const handleAddAvaliacao = (av: AvaliacaoFisica) => {
    setAvaliacoes(prev => [...prev, av]);
    alert("Avaliação Corporal registrada com sucesso! Gráficos de evolução atualizados.");
  };

  const handleAddProgressPhoto = (photo: ProgressPhoto) => {
    setProgressPhotos(prev => [...prev, photo]);
  };

  const handleDeleteProgressPhoto = (photoId: string) => {
    setProgressPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  // Student Logs a Check-in after completing workout
  const handleStudentCheckIn = (studentId: string, workoutTitle: string) => {
    // Add check-in session directly onto the calendar with completed status
    const newSessao: SessaoAgendamento = {
      id: "ag_checkin_" + Math.random().toString(36).substr(2, 9),
      alunoId: studentId,
      alunoNome: alunos.find(a => a.id === studentId)?.nome || "Aluno",
      data: new Date().toISOString().split("T")[0],
      horario: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      duracao: 45,
      tipo: "Presencial",
      status: "Realizado",
      feedback: `Check-in automático do aluno no treino: ${workoutTitle}`
    };

    setAgendamentos(prev => [...prev, newSessao]);
  };

  // 1. LOGIN PREVIEW SCREEN
  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user) return <Login />;

  // 2. MAIN LOGGED-IN WORKSPACE
  const isPersonal = user.email === "felipe@personaltrainer.com.br";
  const loggedInStudent = alunos.find(a => a.email === user.email);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans print:bg-white print:text-black">
      
      {/* Visual Header bar - Hidden in Print */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-extrabold font-display text-sm">
            PT
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-white font-display">FELIPE</h1>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest font-mono">Personal Trainer Integrado</p>
          </div>
        </div>

        {/* User Badge & Switch Exit controls */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Perfil Logado</span>
            <span className="text-xs font-bold text-zinc-300">
              {isPersonal ? "Administrador (Trainer)" : loggedInStudent?.nome}
            </span>
          </div>

          <button
            onClick={() => auth.signOut()}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-2 rounded-xl text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Sair do Perfil"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* SIDEBAR NAVIGATION PANEL (Visible ONLY for Personal Trainer Trainer Role) - Hidden in Print */}
        {isPersonal && (
          <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-4 space-y-4 print:hidden flex-shrink-0">
            <div className="text-zinc-500 uppercase font-bold tracking-wider text-[9px] px-2 block mb-2 font-mono">Painel Administrativo</div>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveAdminTab("dashboard");
                  setActiveBuilderStudent(null);
                  setActiveAnamneseStudent(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                  activeAdminTab === "dashboard" && !activeBuilderStudent && !activeAnamneseStudent
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10"
                    : "text-zinc-400 hover:bg-zinc-850 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" /> Alunos & Prontuários
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab("finance");
                  setActiveBuilderStudent(null);
                  setActiveAnamneseStudent(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                  activeAdminTab === "finance"
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10"
                    : "text-zinc-400 hover:bg-zinc-850 hover:text-white"
                }`}
              >
                <DollarSign className="w-4 h-4" /> Controle Financeiro
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab("calendar");
                  setActiveBuilderStudent(null);
                  setActiveAnamneseStudent(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                  activeAdminTab === "calendar"
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10"
                    : "text-zinc-400 hover:bg-zinc-850 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4" /> Agenda & Presenças
              </button>
            </nav>
          </aside>
        )}

        {/* CONTENT STAGE / VIEWPORT VIEWPORTS */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full print:p-0 print:max-w-none">
          
          {/* A. PERSONAL TRAINER STAGE VIEWS */}
          {isPersonal && (
            <div className="space-y-6">
              
              {/* Overlay / Nested View A: Workout program constructor */}
              {activeBuilderStudent && (
                <WorkoutConstructor
                  aluno={activeBuilderStudent}
                  anamnese={anamneses.find(an => an.nomeCompleto.toLowerCase().includes(activeBuilderStudent.nome.toLowerCase()))}
                  programaParaEditar={programas.find(p => p.alunoId === activeBuilderStudent.id && p.status === "Ativo")}
                  onSave={handleSaveWorkoutProgram}
                  onCancel={() => setActiveBuilderStudent(null)}
                />
              )}

              {/* Overlay / Nested View B: Anamnese digital wizard (ReadOnly or pre-filled edit) */}
              {activeAnamneseStudent && (
                <AnamneseWizard
                  studentName={activeAnamneseStudent.nome}
                  initialData={anamneses.find(an => an.nomeCompleto.toLowerCase().includes(activeAnamneseStudent.nome.toLowerCase()))}
                  onSave={handleSaveAnamnese}
                  onCancel={() => setActiveAnamneseStudent(null)}
                  readOnly={activeAnamneseStudent.anamneseCompleta}
                />
              )}

              {/* Standard tabs toggling */}
              {!activeBuilderStudent && !activeAnamneseStudent && (
                <>
                  {activeAdminTab === "dashboard" && (
                    <DashboardTrainer
                      alunos={sortedAlunos}
                      anamneses={anamneses}
                      programas={programas}
                      pagamentos={pagamentos}
                      agendamentos={agendamentos}
                      avaliacoes={avaliacoes}
                      progressPhotos={progressPhotos}
                      planos={planos}
                      config={config}
                      onAddProgressPhoto={handleAddProgressPhoto}
                      onDeleteProgressPhoto={handleDeleteProgressPhoto}
                      onOpenAnamnese={(st) => setActiveAnamneseStudent(st)}
                      onOpenWorkoutBuilder={(st) => setActiveBuilderStudent(st)}
                      onAddAluno={handleAddAluno}
                      onAddAvaliacao={handleAddAvaliacao}
                      onUpdatePlano={handleUpdatePlano}
                      onAddPlano={handleAddPlano}
                      onDeletePlano={handleDeletePlano}
                      onUpdateConfig={handleUpdateConfig}
                    />
                  )}

                  {activeAdminTab === "finance" && (
                    <FinanceModule
                      pagamentos={pagamentos}
                      alunos={sortedAlunos}
                      onAddPagamento={handleAddPayment}
                      onUpdatePagamentoStatus={handleUpdatePaymentStatus}
                      onFreezeAluno={handleFreezeAluno}
                    />
                  )}

                  {activeAdminTab === "calendar" && (
                    <CalendarScheduler
                      agendamentos={agendamentos}
                      alunos={sortedAlunos}
                      onAddAgendamento={handleAddAppointment}
                      onUpdateAgendamentoStatus={handleUpdateAppointmentStatus}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* B. STUDENT ROLE PORTAL VIEWPORT */}
          {!isPersonal && loggedInStudent && (
            <div className="space-y-6">
              <DashboardStudent
                aluno={loggedInStudent}
                anamneses={anamneses}
                programas={programas}
                pagamentos={pagamentos}
                agendamentos={agendamentos}
                avaliacoes={avaliacoes}
                progressPhotos={progressPhotos}
                onAddProgressPhoto={handleAddProgressPhoto}
                onDeleteProgressPhoto={handleDeleteProgressPhoto}
                onSaveAnamnese={handleSaveAnamnese}
                onStudentCheckIn={handleStudentCheckIn}
              />

              {/* WhatsApp Support Panel for Students */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                      Suporte Direto com Prof. Felipe
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Todas as suas dúvidas de treinos, agendamentos, envios de feedbacks ou vídeos de execução técnica são resolvidas diretamente via WhatsApp pessoal do professor.
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/5511987654321?text=Ol%C3%A1%20professor%20Felipe%2C%20aqui%20%C3%A9%20o%28a%29%20${encodeURIComponent(loggedInStudent.nome)}!%20Gostaria%20de%20conversar%20sobre%20meu%20treino.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto text-center bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  Fale pelo WhatsApp <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
