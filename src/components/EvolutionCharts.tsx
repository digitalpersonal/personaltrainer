import React from "react";
import { AvaliacaoFisica, Aluno } from "../types";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar
} from "recharts";
import { TrendingUp, Award, Ruler, Percent, Swords } from "lucide-react";

interface EvolutionChartsProps {
  aluno: Aluno;
  avaliacoes: AvaliacaoFisica[];
}

export default function EvolutionCharts({ aluno, avaliacoes }: EvolutionChartsProps) {
  if (avaliacoes.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center italic text-zinc-400 text-sm">
        Nenhuma avaliação física encontrada para este aluno. Cadastre a primeira avaliação mensal para visualizar os gráficos de evolução de resultados.
      </div>
    );
  }

  // Sort assessments chronologically
  const sortedAvaliacoes = [...avaliacoes].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  // Prepare standard chronological data
  const dataGeral = sortedAvaliacoes.map(av => {
    const dataObj = new Date(av.data);
    const labelData = dataObj.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    return {
      data: labelData,
      peso: av.peso,
      imc: parseFloat(av.imc.toFixed(1)),
      gordura: av.percentualGordura,
      massaMagra: parseFloat(av.massaMagra.toFixed(1)),
      massaGorda: parseFloat(av.massaGorda.toFixed(1)),
      cintura: av.medidas.cintura,
      quadril: av.medidas.quadril,
      braco: av.medidas.braçoDireito || av.medidas.braçoEsquerdo,
      coxa: av.medidas.coxaDireita || av.medidas.coxaEsquerda,
      panturrilha: av.medidas.panturrilhaDireita || av.medidas.panturrilhaEsquerda
    };
  });

  // Prepare radar chart data comparing first and latest assessment
  const primeira = sortedAvaliacoes[0];
  const ultima = sortedAvaliacoes[sortedAvaliacoes.length - 1];

  const radarData = [
    { item: "Flexões", A: primeira.performance.flexoes, B: ultima.performance.flexoes, fullMark: 50 },
    { item: "Agachamento", A: primeira.performance.agachamento, B: ultima.performance.agachamento, fullMark: 100 },
    { item: "Prancha (s)", A: primeira.performance.pranchaSegundos, B: ultima.performance.pranchaSegundos, fullMark: 180 },
    { item: "Corrida (m)", A: primeira.performance.corridaDistancia / 50, B: ultima.performance.corridaDistancia / 50, fullMark: 3000 / 50 } // scale for radar
  ];

  return (
    <div className="space-y-6">
      
      {/* Visual Header / Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Variação de Peso</span>
            <span className="text-lg font-bold text-zinc-100">
              {ultima.peso} kg{" "}
              <span className={`text-xs font-semibold ${ultima.peso - primeira.peso <= 0 ? "text-emerald-400" : "text-amber-500"}`}>
                ({(ultima.peso - primeira.peso).toFixed(1)} kg)
              </span>
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Gordura Corporal</span>
            <span className="text-lg font-bold text-zinc-100">
              {ultima.percentualGordura}%{" "}
              <span className={`text-xs font-semibold ${ultima.percentualGordura - primeira.percentualGordura <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                ({(ultima.percentualGordura - primeira.percentualGordura).toFixed(1)}%)
              </span>
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Redução de Cintura</span>
            <span className="text-lg font-bold text-zinc-100">
              {ultima.medidas.cintura} cm{" "}
              <span className={`text-xs font-semibold ${ultima.medidas.cintura - primeira.medidas.cintura <= 0 ? "text-emerald-400" : "text-amber-500"}`}>
                ({(ultima.medidas.cintura - primeira.medidas.cintura).toFixed(1)} cm)
              </span>
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Performance Geral</span>
            <span className="text-lg font-bold text-zinc-100 text-emerald-400">
              +{(((ultima.performance.flexoes + ultima.performance.agachamento) / (primeira.performance.flexoes + primeira.performance.agachamento) - 1) * 100).toFixed(0)}% Força
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Peso & IMC */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Evolução de Peso e IMC Corporal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataGeral} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="data" stroke="#737373" fontSize={10} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", color: "#f5f5f5", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="peso" name="Peso (kg)" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="imc" name="IMC" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Composição Corporal */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-400" /> Massa Magra vs Massa Gorda (kg)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataGeral} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMassaMagra" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorMassaGorda" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="data" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", color: "#f5f5f5", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="massaMagra" name="Massa Magra (kg)" stroke="#10b981" fillOpacity={1} fill="url(#colorMassaMagra)" />
                <Area type="monotone" dataKey="massaGorda" name="Massa Gorda (kg)" stroke="#ef4444" fillOpacity={1} fill="url(#colorMassaGorda)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Circunferências Corporais */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-emerald-400" /> Histórico de Medidas (cm)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataGeral} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="data" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", color: "#f5f5f5", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="cintura" name="Cintura" stroke="#fbbf24" strokeWidth={1.5} />
                <Line type="monotone" dataKey="quadril" name="Quadril" stroke="#c084fc" strokeWidth={1.5} />
                <Line type="monotone" dataKey="braco" name="Braço" stroke="#38bdf8" strokeWidth={1.5} />
                <Line type="monotone" dataKey="coxa" name="Coxa" stroke="#f472b6" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Radar de Performance Desportiva */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
            <Swords className="w-4 h-4 text-emerald-400" /> Comparativo de Performance (1º Mês vs Atual)
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#262626" />
                <PolarAngleAxis dataKey="item" stroke="#a3a3a3" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#404040" fontSize={8} />
                <Radar name="Primeira Avaliação" dataKey="A" stroke="#fb7185" fill="#fb7185" fillOpacity={0.25} />
                <Radar name="Avaliação Atual" dataKey="B" stroke="#34d399" fill="#34d399" fillOpacity={0.35} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", color: "#f5f5f5", fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
