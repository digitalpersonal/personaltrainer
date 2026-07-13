import React, { useState, useMemo } from "react";
import { Aluno, AvaliacaoFisica } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import {
  TrendingUp,
  Ruler,
  Percent,
  Calendar,
  Layers,
  ChevronRight,
  User,
  ArrowRight,
  Plus,
  Scale
} from "lucide-react";

interface TrainerAnalyticsProps {
  alunos: Aluno[];
  avaliacoes: AvaliacaoFisica[];
  initialSelectedStudentId?: string | null;
}

export default function TrainerAnalytics({
  alunos,
  avaliacoes,
  initialSelectedStudentId
}: TrainerAnalyticsProps) {
  // Manage selected student in analytics tab
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialSelectedStudentId || (alunos[0]?.id || "")
  );

  // Active chart category: "peso_imc" | "circunferencias" | "composicao"
  const [activeChartTab, setActiveChartTab] = useState<"peso_imc" | "circunferencias" | "composicao">("peso_imc");

  // Selected student object
  const currentStudent = useMemo(() => {
    return alunos.find(a => a.id === selectedStudentId);
  }, [alunos, selectedStudentId]);

  // Selected student evaluations
  const studentAssessments = useMemo(() => {
    return avaliacoes
      .filter(av => av.alunoId === selectedStudentId)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [avaliacoes, selectedStudentId]);

  // Checkboxes for body circumferences to plot in chart
  const [selectedCircs, setSelectedCircs] = useState<Record<string, boolean>>({
    cintura: true,
    abdômen: true,
    quadril: true,
    braçoDireito: true,
    braçoEsquerdo: false,
    coxaDireita: true,
    coxaEsquerda: false,
    panturrilhaDireita: false,
    panturrilhaEsquerda: false
  });

  const toggleCirc = (key: string) => {
    setSelectedCircs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Convert assessments for chart feeding
  const chartData = useMemo(() => {
    return studentAssessments.map(av => {
      const dataObj = new Date(av.data + "T00:00:00");
      const label = dataObj.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      return {
        data: label,
        dataCompleta: av.data,
        peso: av.peso,
        imc: parseFloat(av.imc.toFixed(1)),
        gordura: av.percentualGordura,
        massaMagra: parseFloat(av.massaMagra.toFixed(1)),
        massaGorda: parseFloat(av.massaGorda.toFixed(1)),
        // Circumferences
        cintura: av.medidas.cintura,
        abdômen: av.medidas.abdômen || av.medidas.cintura + 2,
        quadril: av.medidas.quadril,
        braçoDireito: av.medidas.braçoDireito,
        braçoEsquerdo: av.medidas.braçoEsquerdo,
        coxaDireita: av.medidas.coxaDireita,
        coxaEsquerda: av.medidas.coxaEsquerda,
        panturrilhaDireita: av.medidas.panturrilhaDireita,
        panturrilhaEsquerda: av.medidas.panturrilhaEsquerda
      };
    });
  }, [studentAssessments]);

  // Metrics summary
  const summary = useMemo(() => {
    if (studentAssessments.length === 0) return null;
    const primeira = studentAssessments[0];
    const ultima = studentAssessments[studentAssessments.length - 1];

    const deltaPeso = ultima.peso - primeira.peso;
    const deltaGordura = ultima.percentualGordura - primeira.percentualGordura;
    const deltaCintura = ultima.medidas.cintura - primeira.medidas.cintura;
    const deltaMassaMagra = ultima.massaMagra - primeira.massaMagra;

    return {
      primeira,
      ultima,
      deltaPeso,
      deltaGordura,
      deltaCintura,
      deltaMassaMagra
    };
  }, [studentAssessments]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Top Selector Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Painel de Evolução Corporal dos Alunos
          </h2>
          <p className="text-xs text-zinc-500">Monitore o progresso de peso, IMC e perímetria de fitômetro através de gráficos dinâmicos do Recharts</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="student-selector" className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">Aluno:</label>
          <select
            id="student-selector"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer outline-none min-w-[200px]"
          >
            {alunos.map(a => (
              <option key={a.id} value={a.id}>
                {a.nome} ({a.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {studentAssessments.length === 0 ? (
        <div className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Scale className="w-12 h-12 text-zinc-700 animate-pulse" />
          <h3 className="text-sm font-bold text-zinc-300">Nenhum Registro de Evolução</h3>
          <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
            O aluno <strong className="text-zinc-300">{currentStudent?.nome}</strong> ainda não possui avaliações físicas gravadas no sistema. Acesse o Diretório, selecione este aluno e clique em &quot;Adicionar Avaliação&quot; para registrar a pesagem inicial e as circunferências de fita métrica.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Key Metrics Indicators comparison */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Peso Indicator */}
              <div className="bg-zinc-950/50 border border-zinc-850 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Peso Corporal</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-zinc-200">{summary.ultima.peso} kg</span>
                    <span className={`text-[11px] font-bold ${summary.deltaPeso <= 0 ? "text-emerald-400" : "text-amber-500"}`}>
                      {summary.deltaPeso > 0 ? `+${summary.deltaPeso.toFixed(1)}` : summary.deltaPeso.toFixed(1)} kg
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-500 block">Inicial: {summary.primeira.peso} kg</span>
                </div>
              </div>

              {/* Gordura % Indicator */}
              <div className="bg-zinc-950/50 border border-zinc-850 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Gordura Estimada</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-zinc-200">{summary.ultima.percentualGordura}%</span>
                    <span className={`text-[11px] font-bold ${summary.deltaGordura <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {summary.deltaGordura > 0 ? `+${summary.deltaGordura.toFixed(1)}` : summary.deltaGordura.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-500 block">Inicial: {summary.primeira.percentualGordura}%</span>
                </div>
              </div>

              {/* Cintura Indicator */}
              <div className="bg-zinc-950/50 border border-zinc-850 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Perímetro Cintura</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-zinc-200">{summary.ultima.medidas.cintura} cm</span>
                    <span className={`text-[11px] font-bold ${summary.deltaCintura <= 0 ? "text-emerald-400" : "text-amber-500"}`}>
                      {summary.deltaCintura > 0 ? `+${summary.deltaCintura.toFixed(1)}` : summary.deltaCintura.toFixed(1)} cm
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-500 block">Inicial: {summary.primeira.medidas.cintura} cm</span>
                </div>
              </div>

              {/* Massa Magra Indicator */}
              <div className="bg-zinc-950/50 border border-zinc-850 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Massa Magra</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-zinc-200">{summary.ultima.massaMagra.toFixed(1)} kg</span>
                    <span className={`text-[11px] font-bold ${summary.deltaMassaMagra >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {summary.deltaMassaMagra > 0 ? `+${summary.deltaMassaMagra.toFixed(1)}` : summary.deltaMassaMagra.toFixed(1)} kg
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-500 block">Inicial: {summary.primeira.massaMagra.toFixed(1)} kg</span>
                </div>
              </div>

            </div>
          )}

          {/* Interactive Chart Container */}
          <div className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-5 space-y-4">
            
            {/* Chart Sub-Tabs */}
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="flex gap-1 bg-zinc-950 border border-zinc-850 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveChartTab("peso_imc")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeChartTab === "peso_imc"
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/5"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Peso & IMC
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab("circunferencias")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeChartTab === "circunferencias"
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/5"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Circunferências (Fitômetro)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab("composicao")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeChartTab === "composicao"
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/5"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Composição Corporal (kg)
                </button>
              </div>

              <div className="text-[10px] text-zinc-500 font-medium">
                Última atualização em: <strong className="text-zinc-400 font-mono">{summary?.ultima.data ? new Date(summary.ultima.data + "T00:00:00").toLocaleDateString("pt-BR") : "---"}</strong>
              </div>
            </div>

            {/* TAB CONTENT 1: Weight & BMI */}
            {activeChartTab === "peso_imc" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className="md:col-span-3 h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                        <XAxis dataKey="data" stroke="#71717a" fontSize={11} tickLine={false} />
                        <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft', style: { fill: '#10b981', fontSize: 10, fontWeight: 'bold' } }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={11} tickLine={false} label={{ value: 'IMC', angle: 90, position: 'insideRight', style: { fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' } }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5", fontSize: 12 }}
                          formatter={(value: any, name: any) => [
                            `${value} ${name === "peso" ? "kg" : ""}`,
                            name === "peso" ? "Peso" : "IMC"
                          ]}
                        />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="peso"
                          name="peso"
                          stroke="#10b981"
                          strokeWidth={3}
                          activeDot={{ r: 6 }}
                          dot={{ stroke: "#09090b", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="imc"
                          name="imc"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          dot={{ stroke: "#09090b", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4 space-y-3 text-xs">
                    <h4 className="font-bold text-zinc-300">Análise Peso / IMC</h4>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Este gráfico exibe a curva ponderal histórica pareada com o Índice de Massa Corporal (IMC).
                    </p>
                    <div className="border-t border-zinc-800 pt-2 space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Peso Inicial:</span>
                        <span className="font-bold text-zinc-300">{summary?.primeira.peso} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Peso Atual:</span>
                        <span className="font-bold text-emerald-400">{summary?.ultima.peso} kg</span>
                      </div>
                      <div className="flex justify-between border-t border-zinc-850 pt-1.5">
                        <span className="text-zinc-500">IMC Inicial:</span>
                        <span className="font-bold text-zinc-300">{summary?.primeira.imc.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">IMC Atual:</span>
                        <span className="font-bold text-zinc-300">{summary?.ultima.imc.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Circumferences Checklist & Chart */}
            {activeChartTab === "circunferencias" && (
              <div className="space-y-4">
                
                {/* Checkboxes control bar */}
                <div className="flex flex-wrap items-center gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mr-2 block w-full md:w-auto">Traçar Medidas:</span>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.keys(selectedCircs).map(key => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleCirc(key)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                          selectedCircs[key]
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedCircs[key] ? "bg-emerald-400" : "bg-zinc-700"}`}></span>
                        {key === "braçoDireito" ? "Braço D" :
                         key === "braçoEsquerdo" ? "Braço E" :
                         key === "coxaDireita" ? "Coxa D" :
                         key === "coxaEsquerda" ? "Coxa E" :
                         key === "panturrilhaDireita" ? "Panturrilha D" :
                         key === "panturrilhaEsquerda" ? "Panturrilha E" :
                         key.charAt(0).toUpperCase() + key.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className="md:col-span-3 h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                        <XAxis dataKey="data" stroke="#71717a" fontSize={11} tickLine={false} />
                        <YAxis stroke="#71717a" fontSize={11} tickLine={false} domain={['auto', 'auto']} label={{ value: 'Medidas (cm)', angle: -90, position: 'insideLeft', style: { fill: '#71717a', fontSize: 10, fontWeight: 'bold' } }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5", fontSize: 12 }}
                          formatter={(value: any) => [`${value} cm`]}
                        />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                        
                        {selectedCircs.cintura && <Line type="monotone" dataKey="cintura" name="Cintura" stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 5 }} />}
                        {selectedCircs.abdômen && <Line type="monotone" dataKey="abdômen" name="Abdômen" stroke="#ef4444" strokeWidth={2.5} />}
                        {selectedCircs.quadril && <Line type="monotone" dataKey="quadril" name="Quadril" stroke="#c084fc" strokeWidth={2.5} />}
                        {selectedCircs.braçoDireito && <Line type="monotone" dataKey="braçoDireito" name="Braço D" stroke="#3b82f6" strokeWidth={2} />}
                        {selectedCircs.braçoEsquerdo && <Line type="monotone" dataKey="braçoEsquerdo" name="Braço E" stroke="#06b6d4" strokeWidth={2} />}
                        {selectedCircs.coxaDireita && <Line type="monotone" dataKey="coxaDireita" name="Coxa D" stroke="#ec4899" strokeWidth={2} />}
                        {selectedCircs.coxaEsquerda && <Line type="monotone" dataKey="coxaEsquerda" name="Coxa E" stroke="#f43f5e" strokeWidth={2} />}
                        {selectedCircs.panturrilhaDireita && <Line type="monotone" dataKey="panturrilhaDireita" name="Panturrilha D" stroke="#10b981" strokeWidth={1.5} />}
                        {selectedCircs.panturrilhaEsquerda && <Line type="monotone" dataKey="panturrilhaEsquerda" name="Panturrilha E" stroke="#a3e635" strokeWidth={1.5} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4 space-y-3 text-xs">
                    <h4 className="font-bold text-zinc-300">Análise de Perímetros</h4>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Acompanhe as mudanças nas circunferências para estimar perda de gordura localizada ou ganho hipertrófico.
                    </p>
                    <div className="border-t border-zinc-800 pt-2 space-y-1.5 text-[11px] overflow-y-auto max-h-[140px] pr-1">
                      {summary && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Cintura Atual:</span>
                            <span className="font-bold text-zinc-300">{summary.ultima.medidas.cintura} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Abdômen Atual:</span>
                            <span className="font-bold text-zinc-300">{summary.ultima.medidas.abdômen || "---"} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Quadril Atual:</span>
                            <span className="font-bold text-zinc-300">{summary.ultima.medidas.quadril} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Braço D Atual:</span>
                            <span className="font-bold text-zinc-300">{summary.ultima.medidas.braçoDireito} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Coxa D Atual:</span>
                            <span className="font-bold text-zinc-300">{summary.ultima.medidas.coxaDireita} cm</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Body Composition AreaChart */}
            {activeChartTab === "composicao" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className="md:col-span-3 h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="composicaoMassaMagra" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="composicaoMassaGorda" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                        <XAxis dataKey="data" stroke="#71717a" fontSize={11} tickLine={false} />
                        <YAxis stroke="#71717a" fontSize={11} tickLine={false} label={{ value: 'Massa (kg)', angle: -90, position: 'insideLeft', style: { fill: '#71717a', fontSize: 10, fontWeight: 'bold' } }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5", fontSize: 12 }}
                          formatter={(value: any) => [`${value} kg`]}
                        />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                        <Area
                          type="monotone"
                          dataKey="massaMagra"
                          name="Massa Magra (kg)"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#composicaoMassaMagra)"
                        />
                        <Area
                          type="monotone"
                          dataKey="massaGorda"
                          name="Massa Gorda (kg)"
                          stroke="#ef4444"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#composicaoMassaGorda)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4 space-y-3 text-xs">
                    <h4 className="font-bold text-zinc-300">Análise de Composição</h4>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Compare a quantidade absoluta de tecido muscular vs adiposo. O objetivo saudável costuma ser a preservação ou ganho de massa magra combinada à redução de gordura.
                    </p>
                    <div className="border-t border-zinc-800 pt-2 space-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b border-zinc-850 pb-1 flex-col">
                        <span className="text-zinc-500">Gasto/Perda de Gordura:</span>
                        <span className={`font-bold ${summary && summary.deltaGordura <= 0 ? "text-emerald-400" : "text-amber-500"}`}>
                          {summary && summary.deltaGordura <= 0 ? "Eficiente" : "Estável / Ganho"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Massa Gorda Inicial:</span>
                        <span className="font-bold text-zinc-300">{summary?.primeira.massaGorda.toFixed(1)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Massa Gorda Atual:</span>
                        <span className="font-bold text-red-400">{summary?.ultima.massaGorda.toFixed(1)} kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Historical Data Table */}
          <div className="bg-zinc-950/20 border border-zinc-850 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Tabela de Histórico de Avaliações
            </h3>
            <div className="overflow-x-auto rounded-xl border border-zinc-850">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase">
                    <th className="p-3">Data</th>
                    <th className="p-3">Peso (kg)</th>
                    <th className="p-3">IMC</th>
                    <th className="p-3">% Gordura</th>
                    <th className="p-3">Massa Magra</th>
                    <th className="p-3">Massa Gorda</th>
                    <th className="p-3">Cintura</th>
                    <th className="p-3">Quadril</th>
                    <th className="p-3">Braço (D/E)</th>
                    <th className="p-3">Coxa (D/E)</th>
                    <th className="p-3">Panturrilha (D/E)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300 font-medium">
                  {studentAssessments.map(av => (
                    <tr key={av.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3 text-zinc-400 font-mono">
                        {new Date(av.data + "T00:00:00").toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3 font-bold">{av.peso} kg</td>
                      <td className="p-3 text-zinc-400">{av.imc.toFixed(1)}</td>
                      <td className="p-3 text-emerald-400 font-bold">{av.percentualGordura}%</td>
                      <td className="p-3">{av.massaMagra.toFixed(1)} kg</td>
                      <td className="p-3 text-red-400/90">{av.massaGorda.toFixed(1)} kg</td>
                      <td className="p-3">{av.medidas.cintura} cm</td>
                      <td className="p-3">{av.medidas.quadril} cm</td>
                      <td className="p-3 text-zinc-400">{av.medidas.braçoDireito}/{av.medidas.braçoEsquerdo} cm</td>
                      <td className="p-3 text-zinc-400">{av.medidas.coxaDireita}/{av.medidas.coxaEsquerda} cm</td>
                      <td className="p-3 text-zinc-400">{av.medidas.panturrilhaDireita}/{av.medidas.panturrilhaEsquerda} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
