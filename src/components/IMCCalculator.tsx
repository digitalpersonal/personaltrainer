import React, { useState, useEffect } from "react";
import { Aluno, Anamnese, AvaliacaoFisica } from "../types";
import { Calculator, Scale, Ruler, Activity, Info, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

interface IMCCalculatorProps {
  aluno: Aluno;
  anamnese?: Anamnese;
  avaliacoes: AvaliacaoFisica[];
  lastAddedAssessment: AvaliacaoFisica | null;
}

export default function IMCCalculator({
  aluno,
  anamnese,
  avaliacoes,
  lastAddedAssessment
}: IMCCalculatorProps) {
  // Try to find default values from aluno record
  const latestAssessment = avaliacoes.length > 0 ? avaliacoes[avaliacoes.length - 1] : null;
  const initialWeight = latestAssessment?.peso || anamnese?.pesoAtual || 70;
  const initialHeight = latestAssessment?.altura || anamnese?.altura || 170; // in cm

  const [weight, setWeight] = useState<number>(initialWeight);
  const [height, setHeight] = useState<number>(initialHeight);
  const [showAutoResultAlert, setShowAutoResultAlert] = useState(false);

  // Sync state with selected student when they change
  useEffect(() => {
    const latest = avaliacoes.length > 0 ? avaliacoes[avaliacoes.length - 1] : null;
    setWeight(latest?.peso || anamnese?.pesoAtual || 70);
    setHeight(latest?.altura || anamnese?.altura || 170);
    setShowAutoResultAlert(false);
  }, [aluno, anamnese, avaliacoes]);

  // If a new assessment was added, update weights/heights and trigger automatic result alert
  useEffect(() => {
    if (lastAddedAssessment && lastAddedAssessment.alunoId === aluno.id) {
      setWeight(lastAddedAssessment.peso);
      setHeight(lastAddedAssessment.altura);
      setShowAutoResultAlert(true);
      // Auto-hide the alert after 8 seconds
      const timer = setTimeout(() => {
        setShowAutoResultAlert(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedAssessment, aluno.id]);

  const heightInMeters = height / 100;
  const imc = heightInMeters > 0 ? parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1)) : 0;

  // Get classification info
  const getClassification = (val: number) => {
    if (val < 18.5) {
      return {
        label: "Abaixo do peso",
        color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
        barColor: "bg-zinc-500",
        desc: "Atenção: Procure orientação médica para avaliar a composição corporal.",
        tip: "Foque em um superávit calórico limpo com aporte proteico adequado."
      };
    } else if (val >= 18.5 && val < 25) {
      return {
        label: "Peso normal",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        barColor: "bg-emerald-500",
        desc: "Excelente! Peso ideal para a estatura corporativa.",
        tip: "Mantenha a rotina saudável de força e condicionamento aeróbico regular."
      };
    } else if (val >= 25 && val < 30) {
      return {
        label: "Sobrepeso",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        barColor: "bg-amber-500",
        desc: "Sinal de Alerta: Grau leve de acúmulo de tecido adiposo.",
        tip: "Ajuste o déficit calórico moderado e eleve a intensidade dos treinos."
      };
    } else if (val >= 30 && val < 35) {
      return {
        label: "Obesidade Grau I",
        color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        barColor: "bg-orange-500",
        desc: "Atenção: Aumento de risco cardiovascular e metabólico.",
        tip: "Combinação obrigatória de musculação intensa e aeróbicos constantes."
      };
    } else if (val >= 35 && val < 40) {
      return {
        label: "Obesidade Grau II",
        color: "text-red-400 bg-red-500/10 border-red-500/20",
        barColor: "bg-red-500",
        desc: "Alto Risco: Risco severo de desenvolvimento de comorbidades.",
        tip: "Recomenda-se acompanhamento nutricional estrito aliado ao plano de treino."
      };
    } else {
      return {
        label: "Obesidade Grau III",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        barColor: "bg-rose-500",
        desc: "Risco Extremo: Risco muito alto de doenças crônicas graves.",
        tip: "Intervenção multidisciplinar urgente (médica, nutricional e física)."
      };
    }
  };

  const classification = getClassification(imc);

  const handleResetToRegistered = () => {
    const latest = avaliacoes.length > 0 ? avaliacoes[avaliacoes.length - 1] : null;
    setWeight(latest?.peso || anamnese?.pesoAtual || 70);
    setHeight(latest?.altura || anamnese?.altura || 170);
    setShowAutoResultAlert(false);
  };

  // Helper to check if inputs differ from saved student records
  const isModified = () => {
    const latest = avaliacoes.length > 0 ? avaliacoes[avaliacoes.length - 1] : null;
    const savedW = latest?.peso || anamnese?.pesoAtual || 70;
    const savedH = latest?.altura || anamnese?.altura || 170;
    return weight !== savedW || height !== savedH;
  };

  return (
    <div id="imc-calculator-card" className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-4.5 space-y-4">
      
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
        <div className="flex items-center gap-2">
          <Calculator id="imc-calc-icon" className="w-4 h-4 text-emerald-400" />
          <h5 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider">Calculadora Rápida de IMC</h5>
        </div>
        
        {isModified() && (
          <button
            id="imc-reset-button"
            type="button"
            onClick={handleResetToRegistered}
            className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded cursor-pointer transition-all duration-300"
            title="Sincronizar de volta com o Prontuário do Aluno"
          >
            <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" /> Reverter ao Registro
          </button>
        )}
      </div>

      {/* Automatic notification alert on newly added evaluation */}
      {showAutoResultAlert && lastAddedAssessment && (
        <div id="imc-success-alert" className="bg-emerald-500/10 border border-emerald-500/35 rounded-xl p-3 flex items-start gap-2.5 animate-bounce-short">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight space-y-0.5 text-zinc-200">
            <span className="font-extrabold text-emerald-400 block">Nova Avaliação Lançada!</span>
            <p>O peso de <strong>{lastAddedAssessment.peso} kg</strong> e a altura de <strong>{lastAddedAssessment.altura} cm</strong> foram processados.</p>
            <p className="mt-1">Novo IMC recalculado automaticamente: <strong className="text-emerald-300">{lastAddedAssessment.imc.toFixed(1)}</strong> (<span className="font-bold underline">{getClassification(lastAddedAssessment.imc).label}</span>)</p>
          </div>
        </div>
      )}

      {/* Calculator simulation inputs */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Weight Control */}
        <div id="imc-weight-input-container" className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="imc-weight-slider" className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide flex items-center gap-1">
              <Scale className="w-3 h-3 text-zinc-500" /> Peso (kg)
            </label>
            <span className="text-[11px] font-mono font-extrabold text-zinc-300">{weight} kg</span>
          </div>
          <input
            id="imc-weight-slider"
            type="range"
            min="30"
            max="200"
            step="0.5"
            value={weight}
            onChange={(e) => {
              setWeight(parseFloat(e.target.value));
              setShowAutoResultAlert(false);
            }}
            className="w-full accent-emerald-500 bg-zinc-900 cursor-pointer h-1 rounded"
          />
          <div className="flex justify-between text-[8px] text-zinc-600 font-mono">
            <span>30kg</span>
            <span>200kg</span>
          </div>
        </div>

        {/* Height Control */}
        <div id="imc-height-input-container" className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="imc-height-slider" className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide flex items-center gap-1">
              <Ruler className="w-3 h-3 text-zinc-500" /> Altura (cm)
            </label>
            <span className="text-[11px] font-mono font-extrabold text-zinc-300">{height} cm</span>
          </div>
          <input
            id="imc-height-slider"
            type="range"
            min="100"
            max="230"
            step="1"
            value={height}
            onChange={(e) => {
              setHeight(parseInt(e.target.value));
              setShowAutoResultAlert(false);
            }}
            className="w-full accent-emerald-500 bg-zinc-900 cursor-pointer h-1 rounded"
          />
          <div className="flex justify-between text-[8px] text-zinc-600 font-mono">
            <span>100cm</span>
            <span>230cm</span>
          </div>
        </div>

      </div>

      {/* Live Calculated Metric Details */}
      <div id="imc-display-results" className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* IMC Badge */}
        <div className="text-center md:text-left">
          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Valor Calculado</span>
          <div className="flex items-baseline gap-1 justify-center md:justify-start">
            <span id="imc-numerical-result" className="text-3xl font-black text-white leading-none tracking-tight">{imc}</span>
            <span className="text-xs text-zinc-400 font-semibold">kg/m²</span>
          </div>
        </div>

        {/* Classification Tag */}
        <div className="text-center md:text-right space-y-1">
          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Classificação OMS</span>
          <span
            id="imc-classification-badge"
            className={`inline-block px-3 py-1 rounded-xl text-xs font-black border uppercase tracking-wider ${classification.color}`}
          >
            {classification.label}
          </span>
        </div>

      </div>

      {/* Visual Level Bar Indicator */}
      <div id="imc-progress-bar-container" className="space-y-1.5">
        <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
          <span>Abaixo (18.5)</span>
          <span>Normal (24.9)</span>
          <span>Sobrepeso (29.9)</span>
          <span>Obesidade (30+)</span>
        </div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex">
          <div className="h-full bg-zinc-500" style={{ width: "18.5%" }} title="Abaixo do peso" />
          <div className="h-full bg-emerald-500" style={{ width: "32.5%" }} title="Peso Normal" />
          <div className="h-full bg-amber-500" style={{ width: "25%" }} title="Sobrepeso" />
          <div className="h-full bg-red-500 flex-1" title="Obesidade" />
        </div>
        {/* Pointer marker based on calculated IMC (mapped between 15 and 45) */}
        <div className="relative h-1">
          <div
            id="imc-pointer"
            className="absolute top-[-4px] w-2.5 h-2.5 bg-white border border-black rounded-full shadow transition-all duration-500 ease-out"
            style={{
              left: `${Math.min(Math.max(((imc - 15) / 30) * 100, 2), 98)}%`,
              transform: "translateX(-50%)"
            }}
          />
        </div>
      </div>

      {/* Clinical Notes & Tips */}
      <div id="imc-tips-container" className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 text-[11px] leading-relaxed text-zinc-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p id="imc-classification-desc">
            <strong>Diagnóstico:</strong> {classification.desc}
          </p>
          <p id="imc-classification-tip" className="text-zinc-300">
            <Sparkles className="w-3 h-3 text-emerald-400 inline mr-1" />
            <strong>Dica do Coach:</strong> {classification.tip}
          </p>
        </div>
      </div>

    </div>
  );
}
