import React, { useState } from "react";
import { Aluno, Anamnese, ProgramaTreinos, Pagamento, SessaoAgendamento, AvaliacaoFisica, ProgressPhoto } from "../types";
import { Lock, FileText, Dumbbell, Activity, Calendar, ShieldAlert, Sparkles, CheckCircle, RefreshCw, Video } from "lucide-react";
import AnamneseWizard from "./AnamneseWizard";
import EvolutionCharts from "./EvolutionCharts";
import ProgressPhotoGallery from "./ProgressPhotoGallery";

interface DashboardStudentProps {
  aluno: Aluno;
  anamneses: Anamnese[];
  programas: ProgramaTreinos[];
  pagamentos: Pagamento[];
  agendamentos: SessaoAgendamento[];
  avaliacoes: AvaliacaoFisica[];
  progressPhotos: ProgressPhoto[];
  onAddProgressPhoto: (photo: ProgressPhoto) => void;
  onDeleteProgressPhoto: (photoId: string) => void;
  onSaveAnamnese: (data: Anamnese) => void;
  onStudentCheckIn: (alunoId: string, treinoTitulo: string) => void;
}

export default function DashboardStudent({
  aluno,
  anamneses,
  programas,
  pagamentos,
  agendamentos,
  avaliacoes,
  progressPhotos,
  onAddProgressPhoto,
  onDeleteProgressPhoto,
  onSaveAnamnese,
  onStudentCheckIn
}: DashboardStudentProps) {
  const [activeSubTab, setActiveSubTab] = useState<"treino" | "anamnese" | "evolucao" | "calendario">("treino");
  const [showAnamneseWizard, setShowAnamneseWizard] = useState(false);
  const [activeDivisionId, setActiveDivisionId] = useState("A");
  const [expandedVideos, setExpandedVideos] = useState<Record<string, boolean>>({});

  // Business Rule: Check if user is locked because of unpaid balance (Atrasado) or status is Congelado
  const isLateInDebt = pagamentos.some(p => p.alunoId === aluno.id && p.status === "Atrasado");
  const isFrozen = aluno.status === "Congelado";
  const isBlocked = isLateInDebt || isFrozen;

  // Retrieve student specific objects
  const myAnamnese = anamneses.find(an => an.nomeCompleto.toLowerCase().includes(aluno.nome.toLowerCase()));
  const activeProgram = programas.find(p => p.alunoId === aluno.id && p.status === "Ativo");
  const myAssessments = avaliacoes.filter(av => av.alunoId === aluno.id);
  const mySchedule = agendamentos.filter(s => s.alunoId === aluno.id);

  // If user is blocked, lock the entire portal viewport
  if (isBlocked) {
    return (
      <div className="bg-zinc-900 border border-red-900 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl text-center space-y-6 my-10">
        <div className="w-16 h-16 bg-red-950/40 border border-red-800 rounded-2xl flex items-center justify-center text-red-400 mx-auto animate-pulse">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-red-400 uppercase tracking-wide">Acesso Temporariamente Suspenso</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            {isFrozen
              ? "Sua matrícula está congelada temporariamente conforme solicitação de licença/férias. Entre em contato com seu Personal para reativar seu plano."
              : "Detectamos pendências financeiras em aberto com vencimento atrasado de seu plano desportivo. Por motivos administrativos, seu acesso aos treinos foi bloqueado."}
          </p>
        </div>
        <div className="bg-zinc-950/60 p-4 border border-zinc-850 rounded-xl max-w-sm mx-auto text-left space-y-1.5 text-xs">
          <span className="font-bold text-zinc-300 block mb-1">Como resolver este bloqueio:</span>
          <p className="text-zinc-400">• Realize a quitação via PIX direto com o Personal.</p>
          <p className="text-zinc-400">• O Personal validará seu pagamento no painel administrativo.</p>
          <p className="text-zinc-400">• Seu acesso ao cronograma de treinos será restaurado instantaneamente.</p>
        </div>
        <div className="text-[10px] text-zinc-500 font-bold uppercase">SISTEMA INTEGRADO DE TREINO - CREF 012345-G/SP</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Student Top Info Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={aluno.fotoUrl}
            alt={aluno.nome}
            className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
          />
          <div>
            <h2 className="text-base font-bold text-zinc-100">Bem-vindo, {aluno.nome}!</h2>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              Plano de Treinos Ativo • Próximo vencimento: {pagamentos.find(p => p.alunoId === aluno.id && p.status === "Pendente")?.dataVencimento || "Em dia"}
            </p>
          </div>
        </div>

        {/* Inner sub tabs */}
        <div className="flex flex-wrap gap-1 w-full md:w-auto">
          {(["treino", "anamnese", "evolucao", "calendario"] as const).map(tab => {
            const label = tab === "treino" ? "Meus Treinos" : tab === "anamnese" ? "Ficha Anamnese" : tab === "evolucao" ? "Evolução Corporal" : "Meus Agendamentos";
            const Icon = tab === "treino" ? Dumbbell : tab === "anamnese" ? FileText : tab === "evolucao" ? Activity : Calendar;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveSubTab(tab);
                  setShowAnamneseWizard(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                  activeSubTab === tab && !showAnamneseWizard
                    ? "bg-emerald-500 text-black"
                    : "bg-zinc-950 text-zinc-400 border border-zinc-850 hover:text-zinc-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: WORKOUT FILE WITH DIRECT CHECK-IN */}
      {activeSubTab === "treino" && !showAnamneseWizard && (
        <div className="space-y-6">
          {activeProgram ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-6">
              
              {/* Active Program Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">{activeProgram.titulo}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1">Vigência: {activeProgram.dataInicio} até {activeProgram.dataTermino}</p>
                  {activeProgram.notasMotivacionais && (
                    <p className="text-xs text-emerald-400 italic mt-2 font-medium bg-emerald-500/5 border border-emerald-950/40 p-2.5 rounded-xl">
                      &ldquo;{activeProgram.notasMotivacionais}&rdquo;
                    </p>
                  )}
                </div>

                {/* Division Toggles */}
                <div className="flex gap-1.5">
                  {activeProgram.treinos.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveDivisionId(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                        activeDivisionId === t.id
                          ? "bg-emerald-500/25 border border-emerald-500 text-emerald-400"
                          : "bg-zinc-950 text-zinc-400 border border-zinc-850"
                      }`}
                    >
                      Treino {t.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercises in active Division */}
              {activeProgram.treinos.filter(t => t.id === activeDivisionId).map(t => (
                <div key={t.id} className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-zinc-950/60 p-4 border border-zinc-800 rounded-xl">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t.titulo}</h4>
                      <div className="flex gap-4 text-[10px] text-zinc-400 mt-1">
                        <span>Foco: <strong>{t.foco}</strong></span>
                        <span>|</span>
                        <span>Duração Prevista: <strong>{t.duracaoEstimada}</strong></span>
                      </div>
                    </div>

                    {/* Quick Daily Check-In button */}
                    <button
                      onClick={() => {
                        onStudentCheckIn(aluno.id, t.titulo);
                        alert(`Check-in confirmado com sucesso para o ${t.titulo}! Excelente treino!`);
                      }}
                      className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" /> Marcar Check-In Concluído
                    </button>
                  </div>

                  {/* Exercises Details Table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.exercicios.map((ex, idx) => (
                      <div key={idx} className="bg-zinc-950/40 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold uppercase">
                              {ex.grupoMuscular}
                            </span>
                            <h5 className="text-xs font-bold text-zinc-100 mt-1.5">{ex.nome}</h5>
                          </div>
                          <span className="text-lg font-extrabold text-emerald-400 tracking-wider">
                            {ex.series} <span className="text-[10px] text-zinc-500 font-semibold uppercase">Séries</span>
                          </span>
                        </div>

                        {/* Grid parameters */}
                        <div className="grid grid-cols-3 gap-2 bg-zinc-900/60 p-2 border border-zinc-850 rounded-lg text-center text-[10px]">
                          <div>
                            <span className="text-zinc-500 block uppercase font-bold text-[8px]">Repetições</span>
                            <span className="font-semibold text-zinc-200">{ex.repeticoes}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block uppercase font-bold text-[8px]">Descanso</span>
                            <span className="font-semibold text-zinc-200">{ex.descanso}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block uppercase font-bold text-[8px]">Carga</span>
                            <span className="font-semibold text-zinc-200">{ex.cargaSugerida}</span>
                          </div>
                        </div>

                        {ex.dicaExecucao && (
                          <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-850/50">
                            <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider block">Dica Técnica do Treinador:</span>
                            <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{ex.dicaExecucao}</p>
                          </div>
                        )}

                        {ex.videoUrl && (
                          <div className="mt-1 space-y-2">
                            <button
                              type="button"
                              onClick={() => {
                                setExpandedVideos(prev => ({
                                  ...prev,
                                  [`${t.id}_${idx}`]: !prev[`${t.id}_${idx}`]
                                }));
                              }}
                              className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5" />
                              {expandedVideos[`${t.id}_${idx}`] ? "Ocultar Vídeo Demonstrativo" : "Ver Vídeo Demonstrativo"}
                            </button>
                            
                            {expandedVideos[`${t.id}_${idx}`] && (
                              <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden aspect-video">
                                <video
                                  src={ex.videoUrl}
                                  className="w-full h-full object-cover"
                                  controls
                                  playsInline
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl p-10 text-center italic text-zinc-500 text-xs">
              Seu Personal ainda não disponibilizou seu programa de treinos inicial. Solicite a criação ou verifique o preenchimento da sua ficha de Anamnese.
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ANAMNESE FILLING & SIGNATURE */}
      {activeSubTab === "anamnese" && (
        <div className="space-y-6">
          {showAnamneseWizard ? (
            <AnamneseWizard
              initialData={myAnamnese}
              studentName={aluno.nome}
              onSave={(finalData) => {
                onSaveAnamnese(finalData);
                setShowAnamneseWizard(false);
                alert("Sua Anamnese Digital foi arquivada com sucesso! Seu Personal receberá um alerta.");
              }}
              onCancel={() => setShowAnamneseWizard(false)}
            />
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Ficha Cadastral e Anamnese de Saúde</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Manter sua ficha de anamnese atualizada é indispensável para que possamos monitorar restrições médicas, lesões anteriores, alergias e garantir treinos 100% seguros focados nas suas reais necessidades físicas.
              </p>

              {myAnamnese ? (
                <div className="border border-zinc-800 rounded-xl overflow-hidden text-xs">
                  <div className="bg-zinc-950/40 p-4 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-emerald-400">Anamnese Concluída</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Atualizada em: {myAnamnese.ultimaRevisao}</p>
                    </div>
                    <button
                      onClick={() => setShowAnamneseWizard(true)}
                      className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                    >
                      Editar Ficha / Refazer
                    </button>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-300">
                    <div><strong>Nome Completo:</strong> {myAnamnese.nomeCompleto}</div>
                    <div><strong>Gênero:</strong> {myAnamnese.genero}</div>
                    <div><strong>Objetivo Principal:</strong> {myAnamnese.objetivoPrincipal}</div>
                    <div><strong>Lesões osteoarticulares:</strong> {myAnamnese.lesoes || "Nenhuma"}</div>
                    <div><strong>Doenças pre-existentes:</strong> {myAnamnese.condicoesMedicas.join(", ") || "Nenhuma"}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950/40 border border-zinc-800 p-6 rounded-xl text-center space-y-4">
                  <div className="text-xs text-zinc-400 italic">Você ainda não preencheu sua anamnese inicial de saúde.</div>
                  <button
                    onClick={() => setShowAnamneseWizard(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  >
                    Preencher Minha Anamnese Digital Agora
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: PHYSICAL ASSESSMENT CHARTS */}
      {activeSubTab === "evolucao" && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">Linha do Tempo de Resultados</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Aqui você confere o progresso das suas avaliações físicas mensais (peso, gordura estimada, circunferências e performance desportiva nos testes de resistência) geradas pelo seu Personal Trainer.
            </p>

            <EvolutionCharts aluno={aluno} avaliacoes={myAssessments} />
          </div>

          <ProgressPhotoGallery
            aluno={aluno}
            photos={progressPhotos}
            onAddPhoto={onAddProgressPhoto}
            onDeletePhoto={onDeleteProgressPhoto}
            isTrainer={false}
          />
        </div>
      )}

      {/* SUB-TAB 4: MY SCHEDULED HOURS & BOOKINGS */}
      {activeSubTab === "calendario" && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-3">Minha Agenda de Treinos</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Confira abaixo seus horários agendados de aulas presenciais ou virtuais. Lembre-se de avisar com antecedência caso precise desmarcar de modo a justificar sua falta.
            </p>

            <div className="space-y-3">
              {mySchedule.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 italic text-xs">
                  Nenhum horário agendado no seu cronograma esta semana.
                </div>
              ) : (
                mySchedule.map(s => (
                  <div key={s.id} className="bg-zinc-950/40 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center font-bold text-[10px]">
                        <span className="text-emerald-400 text-xs">{s.horario}</span>
                        <span className="text-zinc-500">{s.data.split("-")[2]}/{s.data.split("-")[1]}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">{s.tipo} Personalizado</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Duração: {s.duracao} minutos</p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        s.status === "Realizado"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-950"
                          : s.status === "Agendado"
                          ? "bg-blue-500/10 text-blue-400 border-blue-950"
                          : "bg-red-500/10 text-red-400 border-red-950"
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
