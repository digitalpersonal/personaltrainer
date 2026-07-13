import React, { useState } from "react";
import { Aluno, Anamnese, ProgramaTreinos, Exercicio, TreinoItem, ExercicioTreino } from "../types";
import { EXERCICIOS_PADRAO } from "../data";
import { Plus, Trash2, Sparkles, AlertCircle, Dumbbell, Save, RefreshCw, HelpCircle } from "lucide-react";
import VideoUploadWidget from "./VideoUploadWidget";

interface WorkoutConstructorProps {
  aluno: Aluno;
  anamnese?: Anamnese;
  programaParaEditar?: ProgramaTreinos;
  onSave: (programa: ProgramaTreinos) => void;
  onCancel: () => void;
}

export default function WorkoutConstructor({ aluno, anamnese, programaParaEditar, onSave, onCancel }: WorkoutConstructorProps) {
  const [titulo, setTitulo] = useState(programaParaEditar?.titulo || `Treino Personalizado - ${aluno.nome}`);
  const [divisao, setDivisao] = useState(programaParaEditar?.divisao || "A/B");
  const [dataInicio, setDataInicio] = useState(programaParaEditar?.dataInicio || new Date().toISOString().split("T")[0]);
  const [dataTermino, setDataTermino] = useState(programaParaEditar?.dataTermino || (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2); // default 2 months
    return d.toISOString().split("T")[0];
  })());
  const [notasMotivacionais, setNotasMotivacionais] = useState(programaParaEditar?.notasMotivacionais || "");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState("");

  // Workouts State representing each division (e.g., A, B)
  const [treinos, setTreinos] = useState<TreinoItem[]>(programaParaEditar?.treinos || [
    { id: "A", titulo: "Treino A - Membros Superiores", foco: "Hipertrofia Superior", duracaoEstimada: "50 min", exercicios: [] },
    { id: "B", titulo: "Treino B - Membros Inferiores", foco: "Hipertrofia Inferior", duracaoEstimada: "50 min", exercicios: [] }
  ]);

  // Handle Division Changes to setup empty layouts
  const handleDivisionChange = (div: string) => {
    setDivisao(div);
    if (div === "A/B") {
      setTreinos([
        { id: "A", titulo: "Treino A - Superior", foco: "Membros Superiores", duracaoEstimada: "50 min", exercicios: [] },
        { id: "B", titulo: "Treino B - Inferior", foco: "Membros Inferiores", duracaoEstimada: "50 min", exercicios: [] }
      ]);
    } else if (div === "A/B/C") {
      setTreinos([
        { id: "A", titulo: "Treino A - Peito, Tríceps e Ombro", foco: "Membros Superiores Empurrar", duracaoEstimada: "50 min", exercicios: [] },
        { id: "B", titulo: "Treino B - Costas e Bíceps", foco: "Membros Superiores Puxar", duracaoEstimada: "50 min", exercicios: [] },
        { id: "C", titulo: "Treino C - Pernas e Abdômen", foco: "Membros Inferiores e Core", duracaoEstimada: "55 min", exercicios: [] }
      ]);
    } else {
      setTreinos([
        { id: "Full", titulo: "Treino Full Body - Corpo Todo", foco: "Acondicionamento Geral", duracaoEstimada: "60 min", exercicios: [] }
      ]);
    }
  };

  // Add exercise to division
  const addExercise = (treinoId: string, templateEx?: Exercicio) => {
    const defaultEx: ExercicioTreino = {
      nome: templateEx?.nome || "Novo Exercício",
      grupoMuscular: templateEx?.grupoMuscular || "Geral",
      series: "4",
      repeticoes: "10 a 12",
      descanso: "60 segundos",
      cargaSugerida: "Carga moderada",
      metodo: "Direto",
      dicaExecucao: templateEx?.descricao ? templateEx.descricao.slice(0, 100) + "..." : "Mantenha a coluna ereta e movimento controlado."
    };

    setTreinos(prev =>
      prev.map(t => (t.id === treinoId ? { ...t, exercicios: [...t.exercicios, defaultEx] } : t))
    );
  };

  // Remove exercise
  const removeExercise = (treinoId: string, idx: number) => {
    setTreinos(prev =>
      prev.map(t =>
        t.id === treinoId
          ? { ...t, exercicios: t.exercicios.filter((_, i) => i !== idx) }
          : t
      )
    );
  };

  // Update specific exercise field in division
  const updateExerciseField = (treinoId: string, idx: number, field: keyof ExercicioTreino, val: string) => {
    setTreinos(prev =>
      prev.map(t => {
        if (t.id === treinoId) {
          const updated = [...t.exercicios];
          updated[idx] = { ...updated[idx], [field]: val };
          return { ...t, exercicios: updated };
        }
        return t;
      })
    );
  };

  // Update division level fields
  const updateTreinoField = (treinoId: string, field: "titulo" | "foco" | "duracaoEstimada", val: string) => {
    setTreinos(prev =>
      prev.map(t => (t.id === treinoId ? { ...t, [field]: val } : t))
    );
  };

  // Call Server-Side Gemini API to generate custom program
  const generateAIWorkout = async () => {
    if (!anamnese) {
      setAiError("Não é possível gerar o treino com IA porque este aluno não possui uma Anamnese cadastrada!");
      return;
    }

    setIsLoadingAI(true);
    setAiError("");

    try {
      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anamnese: {
            objetivoPrincipal: anamnese.objetivoPrincipal,
            experiencia: anamnese.experienciaMusculacao,
            lesoes: anamnese.lesoes,
            disponibilidade: anamnese.disponibilidadeSemanal.join(", "),
            estresse: anamnese.nivelEstresse,
            pesoAtual: anamnese.pesoAtual,
            altura: anamnese.altura
          },
          division: divisao,
          notes: notasMotivacionais
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro desconhecido ao chamar API.");
      }

      const data = await response.json();
      if (data.treinos && Array.isArray(data.treinos)) {
        setTreinos(data.treinos);
        if (data.focoGeral) {
          setTitulo(`Programa IA: ${data.focoGeral} - ${aluno.nome}`);
        }
        if (data.observacoesGerais) {
          setNotasMotivacionais(data.observacoesGerais);
        }
      } else {
        throw new Error("Formato de resposta da IA inválido.");
      }

    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Falha na conexão com o servidor. Verifique suas chaves de API.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSave = () => {
    if (treinos.some(t => t.exercicios.length === 0)) {
      alert("Atenção: Por favor, adicione pelo menos 1 exercício em cada treino da sua divisão!");
      return;
    }

    const programa: ProgramaTreinos = {
      id: programaParaEditar?.id || "prog_" + Math.random().toString(36).substr(2, 9),
      alunoId: aluno.id,
      titulo,
      divisao,
      dataInicio,
      dataTermino,
      notasMotivacionais,
      status: programaParaEditar?.status || "Ativo",
      treinos
    };

    onSave(programa);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-zinc-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            Construtor de Treino Personalizado
          </h2>
          <p className="text-xs text-zinc-400">
            Montando programa para o aluno: <strong className="text-zinc-200">{aluno.nome}</strong>
          </p>
        </div>

        {/* AI Generator Button */}
        <div className="flex gap-2 w-full md:w-auto">
          {anamnese ? (
            <button
              type="button"
              onClick={generateAIWorkout}
              disabled={isLoadingAI}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50"
            >
              {isLoadingAI ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Gerando com Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" /> Gerar Treino Inteligente com IA
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-[10px] text-amber-500">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              AI indisponível: Anamnese pendente
            </div>
          )}
        </div>
      </div>

      {/* AI Error Warning */}
      {aiError && (
        <div className="mb-6 bg-red-950/40 border border-red-900 text-red-300 p-4 rounded-xl flex items-start gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold">Falha na Inteligência Artificial:</span> {aiError}
            <p className="mt-1 text-[10px] text-red-400/80">O construtor manual continua disponível. Se necessário, preencha os campos abaixo.</p>
          </div>
        </div>
      )}

      {/* Basic Setup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-xs text-zinc-400 mb-1">Título do Programa de Treinos</label>
          <input
            type="text"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-200"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Divisão de Treinos</label>
          <select
            value={divisao}
            onChange={e => handleDivisionChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm focus:outline-none text-zinc-200"
          >
            <option value="A/B">A/B (Duas Divisões)</option>
            <option value="A/B/C">A/B/C (Três Divisões)</option>
            <option value="Fullbody">Full Body (Corpo Inteiro)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Duração do Programa (Datas)</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={dataInicio}
              onChange={e => setDataInicio(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs w-full text-zinc-300 focus:outline-none"
            />
            <input
              type="date"
              value={dataTermino}
              onChange={e => setDataTermino(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs w-full text-zinc-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs text-zinc-400 mb-1">Notas, Instruções Especiais ou Avisos Motivacionais</label>
          <textarea
            rows={2}
            value={notasMotivacionais}
            placeholder="Ex: Cuidado com o alinhamento da coluna no agachamento. Beba água!"
            onChange={e => setNotasMotivacionais(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs focus:outline-none text-zinc-200"
          />
        </div>
      </div>

      {/* Split Divisions (A, B, C...) Builders */}
      <div className="space-y-6">
        {treinos.map(t => (
          <div key={t.id} className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-4">
            
            {/* Division Card Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-zinc-800 pb-3 mb-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={t.titulo}
                  onChange={e => updateTreinoField(t.id, "titulo", e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs font-bold text-emerald-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={t.foco}
                  placeholder="Foco muscular (ex: Costas)"
                  onChange={e => updateTreinoField(t.id, "foco", e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-zinc-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={t.duracaoEstimada}
                  placeholder="Duração estimada (ex: 50 min)"
                  onChange={e => updateTreinoField(t.id, "duracaoEstimada", e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs text-zinc-400 focus:outline-none"
                />
              </div>

              {/* Add Exercise template picker */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-medium">Add rápido:</span>
                <select
                  onChange={e => {
                    const exId = e.target.value;
                    const matched = EXERCICIOS_PADRAO.find(item => item.id === exId);
                    if (matched) addExercise(t.id, matched);
                    e.target.value = ""; // Reset picker
                  }}
                  className="bg-zinc-850 border border-zinc-700 text-xs rounded p-1 text-zinc-300 focus:outline-none"
                >
                  <option value="">-- Escolha um Exercício --</option>
                  {EXERCICIOS_PADRAO.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.nome} ({ex.grupoMuscular})</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addExercise(t.id)}
                  className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-black px-2 py-1 rounded text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                >
                  <Plus className="w-3.5 h-3.5" /> Criar Customizado
                </button>
              </div>
            </div>

            {/* Exercises List inside division */}
            {t.exercicios.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 italic text-xs">
                Nenhum exercício adicionado a este treino. Utilize os botões acima para cadastrar.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] font-bold text-zinc-500 uppercase px-2">
                  <div className="col-span-3">Nome do Exercício</div>
                  <div className="col-span-2">Grupo Muscular</div>
                  <div className="col-span-1">Séries</div>
                  <div className="col-span-1">Repetições</div>
                  <div className="col-span-1.5">Descanso</div>
                  <div className="col-span-1.5">Carga</div>
                  <div className="col-span-1">Método</div>
                  <div className="col-span-1 text-right">Ação</div>
                </div>

                {t.exercicios.map((ex, idx) => (
                  <div key={idx} className="bg-zinc-950/40 border border-zinc-800 rounded-lg p-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-2.5 items-start md:items-center transition-all hover:border-zinc-750">
                    <div className="col-span-1 md:col-span-3">
                      <label className="md:hidden text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Nome do Exercício</label>
                      <input
                        type="text"
                        value={ex.nome}
                        onChange={e => updateExerciseField(t.id, idx, "nome", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 md:p-1 text-xs text-zinc-200"
                        placeholder="Ex: Puxada alta"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="md:hidden text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Grupo Muscular</label>
                      <input
                        type="text"
                        value={ex.grupoMuscular}
                        onChange={e => updateExerciseField(t.id, idx, "grupoMuscular", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 md:p-1 text-xs text-zinc-300"
                        placeholder="Dorsais"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-2">
                      <div>
                        <label className="md:hidden text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Séries</label>
                        <input
                          type="text"
                          value={ex.series}
                          onChange={e => updateExerciseField(t.id, idx, "series", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 md:p-1 text-xs text-center font-semibold text-emerald-400"
                          placeholder="4"
                        />
                      </div>
                      <div className="md:hidden">
                        <label className="md:hidden text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Repetições</label>
                        <input
                          type="text"
                          value={ex.repeticoes}
                          onChange={e => updateExerciseField(t.id, idx, "repeticoes", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 md:p-1 text-xs text-center"
                          placeholder="10 a 12"
                        />
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-1">
                      <input
                        type="text"
                        value={ex.repeticoes}
                        onChange={e => updateExerciseField(t.id, idx, "repeticoes", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-1 text-xs text-center"
                        placeholder="10 a 12"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-1.5 grid grid-cols-2 md:grid-cols-1 gap-2">
                      <div>
                        <label className="md:hidden text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Descanso</label>
                        <input
                          type="text"
                          value={ex.descanso}
                          onChange={e => updateExerciseField(t.id, idx, "descanso", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 md:p-1 text-xs text-center text-zinc-400"
                          placeholder="60 seg"
                        />
                      </div>
                      <div className="md:hidden">
                        <label className="md:hidden text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Carga</label>
                        <input
                          type="text"
                          value={ex.cargaSugerida}
                          onChange={e => updateExerciseField(t.id, idx, "cargaSugerida", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 md:p-1 text-xs text-zinc-300 text-center"
                          placeholder="Carga moderada"
                        />
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-1.5">
                      <input
                        type="text"
                        value={ex.cargaSugerida}
                        onChange={e => updateExerciseField(t.id, idx, "cargaSugerida", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-1 text-xs text-zinc-300"
                        placeholder="Carga moderada"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-1 flex items-end gap-2 md:block">
                      <div className="flex-1">
                        <label className="md:hidden text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Método</label>
                        <input
                          type="text"
                          value={ex.metodo}
                          onChange={e => updateExerciseField(t.id, idx, "metodo", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 md:p-1 text-xs text-zinc-300"
                          placeholder="Direto"
                        />
                      </div>
                      <div className="md:hidden">
                        <button
                          type="button"
                          onClick={() => removeExercise(t.id, idx)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded transition-all duration-300 hover:scale-[1.1] active:scale-[0.9] cursor-pointer h-full border border-red-500/20"
                          title="Excluir exercício"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="hidden md:flex md:col-span-1 justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => removeExercise(t.id, idx)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1 rounded transition-all duration-300 hover:scale-[1.1] active:scale-[0.9] cursor-pointer"
                        title="Excluir exercício"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="col-span-1 md:col-span-12 mt-2 md:mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800/60 pt-4 md:pt-2.5">
                      <div>
                        <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">Dica de Execução Técnica / Segurança</label>
                        <textarea
                          rows={4}
                          value={ex.dicaExecucao}
                          onChange={e => updateExerciseField(t.id, idx, "dicaExecucao", e.target.value)}
                          className="w-full bg-zinc-900/40 border border-zinc-850 rounded px-2 py-2 md:py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                          placeholder="Evite trancos, retraia escápulas na puxada e mantenha o abdômen contraído..."
                        />
                      </div>
                      <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/80 md:bg-transparent md:p-0 md:border-none">
                        <VideoUploadWidget
                          videoUrl={ex.videoUrl}
                          videoFileName={ex.videoFileName}
                          onVideoUploaded={(url, fileName) => {
                            updateExerciseField(t.id, idx, "videoUrl", url);
                            updateExerciseField(t.id, idx, "videoFileName", fileName);
                          }}
                          onVideoRemoved={() => {
                            updateExerciseField(t.id, idx, "videoUrl", "");
                            updateExerciseField(t.id, idx, "videoFileName", "");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions Footer */}
      <div className="flex justify-end gap-3 mt-8 border-t border-zinc-800 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
        >
          <Save className="w-4 h-4" /> Salvar Programa de Treinos
        </button>
      </div>
    </div>
  );
}
