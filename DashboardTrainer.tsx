import React, { useState, useRef, useEffect } from "react";
import { Anamnese } from "../types";
import { FileText, User, Heart, Activity, Target, Shield, Check, Printer, AlertTriangle } from "lucide-react";

interface AnamneseWizardProps {
  initialData?: Anamnese;
  onSave: (data: Anamnese) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

const emptyAnamnese = (nome?: string): Anamnese => ({
  nomeCompleto: nome || "",
  dataNascimento: "",
  genero: "Masculino",
  estadoCivil: "Solteiro",
  telefone: "",
  email: "",
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
  dataPreenchimento: new Date().toISOString().split("T")[0],
  status: "Pendente",
  ultimaRevisao: new Date().toISOString().split("T")[0]
});

export default function AnamneseWizard({ initialData, onSave, onCancel, readOnly = false, studentName }: AnamneseWizardProps & { studentName?: string }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Anamnese>(initialData || emptyAnamnese(studentName));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Signature canvas handlers
  useEffect(() => {
    if (step === 5 && canvasRef.current && !readOnly) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    }
  }, [step, readOnly]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || readOnly) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (readOnly) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.beginPath();
      // Save signature to state
      const sigData = canvas.toDataURL();
      setData(prev => ({ ...prev, assinaturaDigital: sigData }));
    }
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setData(prev => ({ ...prev, assinaturaDigital: "" }));
      }
    }
  };

  const handleCheckboxChange = (field: keyof Anamnese, value: string) => {
    if (readOnly) return;
    const currentArray = (data[field] as string[]) || [];
    const updated = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    setData(prev => ({ ...prev, [field]: updated }));
  };

  const handleNestedCircunferencias = (key: keyof Anamnese["circunferencias"], val: number) => {
    if (readOnly) return;
    setData(prev => ({
      ...prev,
      circunferencias: {
        ...prev.circunferencias,
        [key]: val
      }
    }));
  };

  const handleNestedEmergencia = (key: keyof Anamnese["contatoEmergencia"], val: string) => {
    if (readOnly) return;
    setData(prev => ({
      ...prev,
      contatoEmergencia: {
        ...prev.contatoEmergencia,
        [key]: val
      }
    }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    if (readOnly) return;
    // Health validation business rule: BMI should not go below 18.5
    const heightMeters = data.altura / 100;
    if (data.altura > 0 && data.pesoDesejado > 0) {
      const targetBMI = data.pesoDesejado / (heightMeters * heightMeters);
      if (targetBMI < 18.5) {
        alert("Atenção: A meta de peso informada resulta em um IMC menor que 18.5 (Abaixo do Peso Saudável). Por motivos de saúde e segurança física, recomendamos reajustar o peso desejado!");
        return;
      }
    }

    const finalData: Anamnese = {
      ...data,
      status: "Completa",
      ultimaRevisao: new Date().toISOString().split("T")[0]
    };
    onSave(finalData);
  };

  const handlePrint = () => {
    window.print();
  };

  const stepsHeader = [
    { num: 1, label: "Pessoais", icon: User },
    { num: 2, label: "Médico", icon: Heart },
    { num: 3, label: "Atividade", icon: Activity },
    { num: 4, label: "Metas & Hábitos", icon: Target },
    { num: 5, label: "Assinatura", icon: Shield }
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-6 max-w-4xl mx-auto shadow-2xl relative text-zinc-200 print:bg-white print:text-black print:border-none print:p-0 print:shadow-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-emerald-500 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Anamnese Digital Profissional
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {readOnly ? "Visualização completa dos dados do aluno" : "Preenchimento obrigatório para liberação de treinos"}
          </p>
        </div>
        <div className="flex gap-2">
          {readOnly && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              <Printer className="w-4 h-4" /> Exportar / Imprimir
            </button>
          )}
          <button
            onClick={onCancel}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Progress Stepper - Hidden in Print */}
      <div className="flex justify-between items-center mb-8 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 print:hidden overflow-x-auto">
        {stepsHeader.map((s, idx) => {
          const IconComponent = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <React.Fragment key={s.num}>
              <div
                onClick={() => setStep(s.num)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all flex-1 min-w-[70px] ${
                  isActive ? "scale-105" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone
                      ? "bg-emerald-500 text-black"
                      : isActive
                      ? "bg-emerald-400 text-black ring-4 ring-emerald-950"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-emerald-400" : isDone ? "text-emerald-500" : "text-zinc-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < stepsHeader.length - 1 && (
                <div
                  className={`h-[1px] flex-1 bg-zinc-800 ${
                    step > s.num ? "bg-emerald-600" : "bg-zinc-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Printable version cover (visible ONLY during print) */}
      <div className="hidden print:block mb-8">
        <div className="text-center border-b-2 border-zinc-300 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-black">Relatório de Anamnese Física</h1>
          <p className="text-sm font-semibold text-zinc-600 mt-1">SISTEMA INTEGRADO DE TREINO - FELIPE PERSONAL</p>
          <div className="grid grid-cols-2 text-left mt-4 text-xs gap-2">
            <div><strong>Aluno:</strong> {data.nomeCompleto}</div>
            <div><strong>Data de Preenchimento:</strong> {data.dataPreenchimento}</div>
            <div><strong>Status do Registro:</strong> {data.status}</div>
            <div><strong>Última Revisão:</strong> {data.ultimaRevisao}</div>
          </div>
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="min-h-[350px] bg-zinc-950/40 border border-zinc-800 p-6 rounded-xl print:border-none print:p-0">
        
        {/* STEP 1: DADOS PESSOAIS */}
        {(step === 1 || readOnly) && (
          <div className={`${readOnly ? "mb-8 pb-8 border-b border-zinc-800" : ""}`}>
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <User className="w-4 h-4 text-emerald-400" />
              Etapa 1 — Dados Pessoais e Profissionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.nomeCompleto}
                  onChange={e => setData({ ...data, nomeCompleto: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  disabled={readOnly}
                  value={data.dataNascimento}
                  onChange={e => setData({ ...data, dataNascimento: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Gênero</label>
                <select
                  disabled={readOnly}
                  value={data.genero}
                  onChange={e => setData({ ...data, genero: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Estado Civil</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.estadoCivil}
                  onChange={e => setData({ ...data, estadoCivil: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Telefone</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.telefone}
                  placeholder="(11) 99999-9999"
                  onChange={e => setData({ ...data, telefone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">E-mail</label>
                <input
                  type="email"
                  disabled={readOnly}
                  value={data.email}
                  placeholder="exemplo@gmail.com"
                  onChange={e => setData({ ...data, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-zinc-400 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.endereco}
                  onChange={e => setData({ ...data, endereco: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Profissão</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.profissao}
                  onChange={e => setData({ ...data, profissao: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Horário de Trabalho</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.horarioTrabalho}
                  placeholder="ex: 09:00 às 18:00"
                  onChange={e => setData({ ...data, horarioTrabalho: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Nível de Estresse Diário (1 a 10)</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    disabled={readOnly}
                    value={data.nivelEstresse}
                    onChange={e => setData({ ...data, nivelEstresse: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-bold text-emerald-400 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded text-sm">
                    {data.nivelEstresse}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: HISTÓRICO MÉDICO */}
        {(step === 2 || readOnly) && (
          <div className={`${readOnly ? "mb-8 pb-8 border-b border-zinc-800" : ""}`}>
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Heart className="w-4 h-4 text-emerald-400" />
              Etapa 2 — Histórico Clínico e Médico
            </h3>
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-2">Condições Médicas Atuais ou Pre-existentes</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["Hipertensão", "Diabetes", "Asma/Bronquite", "Problemas Cardíacos", "Colesterol Alto", "Hérnia de Disco", "Labirintite", "Artrite/Artrose"].map(c => {
                  const isChecked = data.condicoesMedicas.includes(c) || data.condicoesMedicas.some(val => val.toLowerCase().includes(c.toLowerCase()));
                  return (
                    <label key={c} className="flex items-center gap-2 bg-zinc-900/60 hover:bg-zinc-900 p-2 rounded-lg border border-zinc-800/80 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={readOnly}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange("condicoesMedicas", c)}
                        className="rounded accent-emerald-500 text-black"
                      />
                      <span>{c}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Cirurgias Anteriores (com data aproximada)</label>
                <textarea
                  disabled={readOnly}
                  rows={2}
                  value={data.cirurgiasAnteriores}
                  placeholder="ex: Artroscopia joelho esquerdo em 2021"
                  onChange={e => setData({ ...data, cirurgiasAnteriores: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Medicações em Uso Contínuo</label>
                <textarea
                  disabled={readOnly}
                  rows={2}
                  value={data.medicacoesContinuas}
                  placeholder="ex: Remédio para pressão"
                  onChange={e => setData({ ...data, medicacoesContinuas: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Alergias Alimentares ou Medicamentosas</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.alergias}
                  placeholder="ex: Dipirona, Corantes"
                  onChange={e => setData({ ...data, alergias: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Lesões Osteoarticulares Recentes ou Atuais</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.lesoes}
                  placeholder="ex: Condromalácia patelar, dores lombares"
                  onChange={e => setData({ ...data, lesoes: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Restrições Médicas Específicas para Exercícios</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.restricoesMedicas}
                  placeholder="ex: Evitar saltos/impactos"
                  onChange={e => setData({ ...data, restricoesMedicas: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-zinc-300 mb-3 uppercase tracking-wider">Contato de Emergência</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Nome do Contato</label>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={data.contatoEmergencia.nome}
                    onChange={e => handleNestedEmergencia("nome", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Telefone de Emergência</label>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={data.contatoEmergencia.telefone}
                    onChange={e => handleNestedEmergencia("telefone", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Parentesco / Relação</label>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={data.contatoEmergencia.parentesco}
                    placeholder="ex: Mãe, Cônjuge, Irmão"
                    onChange={e => handleNestedEmergencia("parentesco", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: HISTÓRICO DE ATIVIDADE FÍSICA */}
        {(step === 3 || readOnly) && (
          <div className={`${readOnly ? "mb-8 pb-8 border-b border-zinc-800" : ""}`}>
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Etapa 3 — Histórico Desportivo e Atividades Atuais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Pratica alguma atividade física atualmente?</label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => setData({ ...data, praticaAtividade: true })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      data.praticaAtividade
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => setData({ ...data, praticaAtividade: false, detalheAtividade: "" })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      !data.praticaAtividade
                        ? "bg-red-500/10 border-red-900 text-red-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>

              {data.praticaAtividade && (
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Se sim: Qual, frequência, duração e há quanto tempo?</label>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={data.detalheAtividade}
                    placeholder="ex: Corrida, 2x por semana, 40 min, há 3 meses"
                    onChange={e => setData({ ...data, detalheAtividade: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Atividades desportivas anteriores ou musculação nos últimos 5 anos?</label>
                <textarea
                  disabled={readOnly}
                  rows={2}
                  value={data.atividadesAnteriores}
                  placeholder="Conte-nos o histórico do que costumava praticar..."
                  onChange={e => setData({ ...data, atividadesAnteriores: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Nível de Experiência com Musculação</label>
                <select
                  disabled={readOnly}
                  value={data.experienciaMusculacao}
                  onChange={e => setData({ ...data, experienciaMusculacao: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="iniciante">Iniciante (Nunca fiz ou treinei muito pouco)</option>
                  <option value="intermediario">Intermediário (Treino regular com intervalos, conheço posturas)</option>
                  <option value="avancado">Avançado (Mais de 2 anos de musculação focada)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Horário de Preferência para Treinar</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.preferenciasHorario}
                  placeholder="ex: Manhã (07:00), Noite (19:30)"
                  onChange={e => setData({ ...data, preferenciasHorario: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-zinc-400 mb-2">Disponibilidade Semanal de Dias</label>
                <div className="flex flex-wrap gap-2">
                  {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map(dia => {
                    const isSelected = data.disponibilidadeSemanal.includes(dia);
                    return (
                      <button
                        key={dia}
                        type="button"
                        disabled={readOnly}
                        onClick={() => handleCheckboxChange("disponibilidadeSemanal", dia)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {dia}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: OBJETIVOS E HÁBITOS */}
        {(step === 4 || readOnly) && (
          <div className={`${readOnly ? "mb-8 pb-8 border-b border-zinc-800" : ""}`}>
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Etapa 4 — Objetivos, Hábitos e Composição Corporal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Objetivo Primário do Treino</label>
                <select
                  disabled={readOnly}
                  value={data.objetivoPrincipal}
                  onChange={e => setData({ ...data, objetivoPrincipal: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                >
                  <option value="Hipertrofia">Hipertrofia (Ganho de Massa Magra)</option>
                  <option value="Emagrecimento">Emagrecimento (Perda de Gordura)</option>
                  <option value="Condicionamento">Condicionamento Físico Geral</option>
                  <option value="Reabilitação">Reabilitação / Prevenção de Dores</option>
                  <option value="Performance">Performance Desportiva</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Objetivos Secundários</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.objetivosSecundarios}
                  placeholder="ex: Reduzir dores no ombro, melhorar fôlego"
                  onChange={e => setData({ ...data, objetivosSecundarios: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Altura (em cm)</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={data.altura || ""}
                  placeholder="ex: 175"
                  onChange={e => setData({ ...data, altura: parseFloat(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Peso Atual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={readOnly}
                  value={data.pesoAtual || ""}
                  placeholder="ex: 78.5"
                  onChange={e => setData({ ...data, pesoAtual: parseFloat(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Peso Desejado / Meta (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={readOnly}
                  value={data.pesoDesejado || ""}
                  placeholder="ex: 82.0"
                  onChange={e => setData({ ...data, pesoDesejado: parseFloat(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Gordura Estimada % (Se souber)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={readOnly}
                  value={data.gorduraEstimada || ""}
                  placeholder="ex: 18.5"
                  onChange={e => setData({ ...data, gorduraEstimada: parseFloat(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/80 p-4 rounded-xl mb-4">
              <h4 className="text-xs font-bold text-zinc-300 mb-3 uppercase tracking-wider">Circunferências Iniciais (cm)</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["cintura", "quadril", "braço", "coxa", "panturrilha"].map(key => {
                  return (
                    <div key={key}>
                      <label className="block text-[10px] text-zinc-400 capitalize mb-1">{key}</label>
                      <input
                        type="number"
                        step="0.1"
                        disabled={readOnly}
                        value={(data.circunferencias as any)[key] || ""}
                        placeholder="0.0"
                        onChange={e => handleNestedCircunferencias(key as any, parseFloat(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Quantas refeições faz por dia?</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={data.refeicoesDia}
                  onChange={e => setData({ ...data, refeicoesDia: parseInt(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Consumo de água estimado (L/dia)</label>
                <input
                  type="number"
                  step="0.5"
                  disabled={readOnly}
                  value={data.consumoAgua}
                  onChange={e => setData({ ...data, consumoAgua: parseFloat(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Qualidade de Sono (Horas por Noite)</label>
                <input
                  type="number"
                  step="0.5"
                  disabled={readOnly}
                  value={data.sonoHoras}
                  onChange={e => setData({ ...data, sonoHoras: parseFloat(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Dificuldade para dormir / Insônia?</label>
                <div className="flex gap-4 mt-1">
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => setData({ ...data, sonoDificuldade: true })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      data.sonoDificuldade
                        ? "bg-red-500/15 border-red-900 text-red-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => setData({ ...data, sonoDificuldade: false })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      !data.sonoDificuldade
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Consumo de Álcool e Tabaco</label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={data.alcoolTabaco}
                  placeholder="ex: Fumo socialmente, não bebo"
                  onChange={e => setData({ ...data, alcoolTabaco: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Nível de Motivação (1 a 10)</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    disabled={readOnly}
                    value={data.nivelMotivacao}
                    onChange={e => setData({ ...data, nivelMotivacao: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-bold text-emerald-400 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded text-sm">
                    {data.nivelMotivacao}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: TERMOS E ASSINATURA */}
        {(step === 5 || readOnly) && (
          <div>
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Etapa 5 — Isenção de Responsabilidade, Termos e Assinatura
            </h3>

            <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl text-xs space-y-3 mb-6 max-h-[160px] overflow-y-auto">
              <p className="font-bold text-zinc-300 uppercase tracking-wider">Declaração de Isenção de Responsabilidade Médica:</p>
              <p className="text-zinc-400 leading-relaxed">
                1. Declaro que as respostas fornecidas nesta anamnese são totalmente verdadeiras e completas. Reconheço que a precisão destas informações é vital para a elaboração de programas de exercícios físicos seguros e eficientes adaptados ao meu perfil biológico.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                2. Estou ciente de que a atividade física possui riscos inerentes de fadiga muscular, dores temporárias e acidentes. Comprometo-me a reportar imediatamente qualquer dor incomum, tontura ou mal-estar ao meu Personal Trainer e interromper o exercício.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                3. Autorizo expressamente o uso das minhas fotos de progresso (resguardando a identidade do rosto se solicitado) única e exclusivamente para acompanhamento da linha de tempo do meu painel individual.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-2.5 text-xs cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  checked={data.termoResponsabilidadeAceito}
                  onChange={e => setData({ ...data, termoResponsabilidadeAceito: e.target.checked })}
                  className="mt-0.5 rounded accent-emerald-500"
                />
                <span>Aceito os termos de responsabilidade médica e declaro aptidão inicial para exercícios.</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  checked={data.termoImagemAceito}
                  onChange={e => setData({ ...data, termoImagemAceito: e.target.checked })}
                  className="mt-0.5 rounded accent-emerald-500"
                />
                <span>Autorizo o uso de imagens de evolução no meu acompanhamento visual privado.</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Canvas Signature Pad */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Assinatura Digital (Toque ou Mouse no quadro escuro)
                </label>
                {readOnly ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-center min-h-[140px]">
                    {data.assinaturaDigital ? (
                      <img src={data.assinaturaDigital} alt="Assinatura" className="max-h-[120px] bg-zinc-950/60 p-2 rounded border border-zinc-800" />
                    ) : (
                      <span className="text-xs text-zinc-500 italic">Nenhuma assinatura digital salva</span>
                    )}
                  </div>
                ) : (
                  <div>
                    <canvas
                      ref={canvasRef}
                      width={380}
                      height={140}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl cursor-crosshair w-full"
                    />
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                      >
                        Limpar Desenho
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Data do Registro</label>
                <input
                  type="date"
                  disabled={readOnly}
                  value={data.dataPreenchimento}
                  onChange={e => setData({ ...data, dataPreenchimento: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons - Hidden in Print */}
      <div className="flex justify-between items-center mt-6 border-t border-zinc-800 pt-4 print:hidden">
        <div>
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Anterior
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {!readOnly && step < 5 && (
            <button
              onClick={handleNext}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1.5"
            >
              Próximo Passo
            </button>
          )}
          {!readOnly && step === 5 && (
            <button
              onClick={handleFinish}
              disabled={!data.termoResponsabilidadeAceito}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Concluir e Salvar Anamnese
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
