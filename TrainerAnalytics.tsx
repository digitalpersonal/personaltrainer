import React, { useState } from "react";
import { Pagamento, Aluno, Plano } from "../types";
import { PLANOS_PADRAO } from "../data";
import { BarChart, Bar, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, Percent, AlertCircle, Calendar, Plus, Printer, CheckCircle, Flame, ShieldAlert, Sparkles, FileSpreadsheet } from "lucide-react";

interface FinanceModuleProps {
  pagamentos: Pagamento[];
  alunos: Aluno[];
  onAddPagamento: (pag: Pagamento) => void;
  onUpdatePagamentoStatus: (id: string, status: Pagamento["status"]) => void;
  onFreezeAluno: (alunoId: string, status: Aluno["status"]) => void;
}

const COLORS = ["#10b981", "#3b82f6", "#fbbf24", "#f472b6", "#ef4444"];

export default function FinanceModule({ pagamentos, alunos, onAddPagamento, onUpdatePagamentoStatus, onFreezeAluno }: FinanceModuleProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Pagamento | null>(null);

  // Form states for manual registration
  const [selectedAlunoId, setSelectedAlunoId] = useState("");
  const [selectedPlanoId, setSelectedPlanoId] = useState("plano_mensal");
  const [valor, setValor] = useState(150);
  const [dataVencimento, setDataVencimento] = useState(new Date().toISOString().split("T")[0]);
  const [mesReferencia, setMesReferencia] = useState("Julho/2026");
  const [formaPagamento, setFormaPagamento] = useState<Pagamento["formaPagamento"]>("Pix");

  // Calculations
  const totalRecebido = pagamentos.filter(p => p.status === "Pago").reduce((acc, curr) => acc + curr.valor, 0);
  const totalPendente = pagamentos.filter(p => p.status === "Pendente").reduce((acc, curr) => acc + curr.valor, 0);
  const totalAtrasado = pagamentos.filter(p => p.status === "Atrasado").reduce((acc, curr) => acc + curr.valor, 0);
  const taxaInadimplencia = pagamentos.length > 0 ? (totalAtrasado / (totalRecebido + totalPendente + totalAtrasado)) * 100 : 0;

  // Recharts: Income by payment method
  const payMethodsData = ["Pix", "Cartao", "Dinheiro", "Transferencia"].map(m => {
    const sum = pagamentos
      .filter(p => p.status === "Pago" && p.formaPagamento === m)
      .reduce((acc, curr) => acc + curr.valor, 0);
    return { name: m === "Cartao" ? "Cartão" : m, value: sum };
  }).filter(item => item.value > 0);

  // Recharts: Income by plan
  const planData = PLANOS_PADRAO.map(pl => {
    const sum = pagamentos
      .filter(p => p.status === "Pago" && p.planoId === pl.id)
      .reduce((acc, curr) => acc + curr.valor, 0);
    return { name: pl.nome, value: sum };
  }).filter(item => item.value > 0);

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlunoId) return;

    const newPag: Pagamento = {
      id: "pag_" + Math.random().toString(36).substr(2, 9),
      alunoId: selectedAlunoId,
      planoId: selectedPlanoId,
      valor: parseFloat(valor.toString()),
      dataVencimento,
      mesReferencia,
      status: "Pendente"
    };

    onAddPagamento(newPag);
    setShowAddModal(false);
    setSelectedAlunoId("");
  };

  const getAlunoName = (id: string) => {
    const found = alunos.find(a => a.id === id);
    return found ? found.nome : "Aluno não encontrado";
  };

  const getPlanoName = (id: string) => {
    const found = PLANOS_PADRAO.find(p => p.id === id);
    return found ? found.nome : "Plano Padrão";
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Finance summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Receita do Mês (Pago)</span>
            <span className="text-xl font-bold text-zinc-100">R$ {totalRecebido.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Previsto (Pendentes)</span>
            <span className="text-xl font-bold text-zinc-100">R$ {totalPendente.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3 border-l-4 border-l-red-600">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-red-400 block uppercase font-bold">Valor em Atraso</span>
            <span className="text-xl font-bold text-red-400">R$ {totalAtrasado.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-950mber-500/10 flex items-center justify-center text-amber-400">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Taxa de Inadimplência</span>
            <span className="text-xl font-bold text-zinc-100">{taxaInadimplencia.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Formas de Pagamento */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-xs font-bold text-zinc-200 mb-4 uppercase tracking-wider">Receita por Forma de Pagamento</h3>
          {payMethodsData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-zinc-500 italic">Sem registros de receitas recebidas ainda.</div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={payMethodsData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">
                    {payMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value}`} contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", color: "#f5f5f5" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart B: Receita por Plano */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-xs font-bold text-zinc-200 mb-4 uppercase tracking-wider">Receita por Tipo de Plano</h3>
          {planData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-zinc-500 italic">Sem registros de receitas recebidas ainda.</div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="name" stroke="#737373" fontSize={10} />
                  <YAxis stroke="#737373" fontSize={10} />
                  <Tooltip formatter={(value) => `R$ ${value}`} contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", color: "#f5f5f5" }} />
                  <Bar dataKey="value" fill="#10b981">
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Main Billing Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Histórico Geral de Faturamento</h3>
            <p className="text-[11px] text-zinc-500">Gestão de cobranças, vencimentos e recibos digitais</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Lançamento
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-950/60 text-zinc-400 font-semibold border-b border-zinc-800 text-[10px] uppercase">
                <th className="p-3">Aluno</th>
                <th className="p-3">Plano</th>
                <th className="p-3">Referência</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Vencimento</th>
                <th className="p-3">Data Pgto</th>
                <th className="p-3">Forma</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {pagamentos.map(pag => {
                const aluno = alunos.find(a => a.id === pag.alunoId);
                const isOverdue = pag.status === "Atrasado";
                return (
                  <tr
                    key={pag.id}
                    className={`hover:bg-zinc-800/30 transition-colors ${
                      isOverdue ? "border-l-2 border-l-red-500 bg-red-950/5" : ""
                    }`}
                  >
                    <td className="p-3 font-semibold text-zinc-200">
                      <div>{getAlunoName(pag.alunoId)}</div>
                      {aluno && aluno.status === "Congelado" && (
                        <span className="text-[9px] bg-sky-950 text-sky-400 border border-sky-900 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          Acesso Congelado
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-zinc-400">{getPlanoName(pag.planoId)}</td>
                    <td className="p-3 text-zinc-400">{pag.mesReferencia}</td>
                    <td className="p-3 font-bold text-zinc-200">R$ {pag.valor.toFixed(2)}</td>
                    <td className="p-3 text-zinc-400">{pag.dataVencimento}</td>
                    <td className="p-3 text-zinc-400">{pag.dataPagamento || "-"}</td>
                    <td className="p-3 text-zinc-400">{pag.formaPagamento || "-"}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                          pag.status === "Pago"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-950"
                            : pag.status === "Pendente"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-950"
                            : "bg-red-500/10 text-red-400 border border-red-950"
                        }`}
                      >
                        {pag.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {pag.status !== "Pago" && (
                        <button
                          onClick={() => {
                            // Quick mark as paid
                            onUpdatePagamentoStatus(pag.id, "Pago");
                          }}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
                        >
                          Confirmar Pago
                        </button>
                      )}
                      
                      {/* Freeze toggler for overdues */}
                      {isOverdue && aluno && aluno.status !== "Congelado" && (
                        <button
                          onClick={() => onFreezeAluno(pag.alunoId, "Congelado")}
                          className="text-[10px] text-sky-400 hover:text-sky-300 font-bold bg-sky-500/10 hover:bg-sky-500/20 px-2 py-1 rounded transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
                          title="Bloqueia acesso do aluno inadimplente"
                        >
                          Congelar Acesso
                        </button>
                      )}
                      {aluno && aluno.status === "Congelado" && (
                        <button
                          onClick={() => onFreezeAluno(pag.alunoId, "Ativo")}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
                        >
                          Reativar Aluno
                        </button>
                      )}

                      <button
                        onClick={() => setReceiptPayment(pag)}
                        className="text-zinc-400 hover:text-zinc-200 p-1 rounded inline-block transition-all duration-300 hover:scale-[1.1] active:scale-[0.9] cursor-pointer"
                        title="Ver Recibo"
                      >
                        <Printer className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PLAN DETAILS LIST OVERVIEW */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">Portfólio de Planos e Sessões</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {PLANOS_PADRAO.map(pl => (
            <div key={pl.id} className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-950 px-2 py-0.5 rounded font-bold uppercase inline-block mb-2">
                  {pl.nome}
                </span>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{pl.descricao}</p>
              </div>
              <div className="border-t border-zinc-800/80 pt-3 mt-4 flex justify-between items-baseline">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">{pl.sessoesInclusas} sessões/mês</span>
                <span className="text-base font-bold text-zinc-100">R$ {pl.valor.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: REGISTER PAYMENT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-zinc-200">
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-emerald-400" /> Registrar Lançamento de Cobrança
            </h3>
            
            <form onSubmit={handleRegisterPayment} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Selecione o Aluno</label>
                <select
                  required
                  value={selectedAlunoId}
                  onChange={e => {
                    const id = e.target.value;
                    setSelectedAlunoId(id);
                    // Match default price
                    const aluno = alunos.find(a => a.id === id);
                    if (aluno) {
                      const plano = PLANOS_PADRAO.find(p => p.id === aluno.planoAtivoId);
                      if (plano) {
                        setValor(plano.valor);
                        setSelectedPlanoId(plano.id);
                      }
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Selecione um Aluno --</option>
                  {alunos.map(a => (
                    <option key={a.id} value={a.id}>{a.nome} (Plano: {getPlanoName(a.planoAtivoId)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Plano Vinculado</label>
                  <select
                    value={selectedPlanoId}
                    onChange={e => {
                      setSelectedPlanoId(e.target.value);
                      const plano = PLANOS_PADRAO.find(p => p.id === e.target.value);
                      if (plano) setValor(plano.valor);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs"
                  >
                    {PLANOS_PADRAO.map(pl => (
                      <option key={pl.id} value={pl.id}>{pl.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Valor do Plano (R$)</label>
                  <input
                    type="number"
                    required
                    value={valor}
                    onChange={e => setValor(parseFloat(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Mês de Referência</label>
                  <input
                    type="text"
                    required
                    value={mesReferencia}
                    onChange={e => setMesReferencia(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs"
                    placeholder="ex: Julho/2026"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={dataVencimento}
                    onChange={e => setDataVencimento(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100"
                  />
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
                  Lançar Cobrança
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT DIALOG: DIGITAL RECEIPT */}
      {receiptPayment && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 print:relative print:bg-white print:p-0">
          <div className="bg-white text-black p-8 rounded-2xl w-full max-w-xl shadow-2xl relative border border-zinc-300 print:border-none print:shadow-none">
            
            {/* Stamp Logo */}
            <div className="flex justify-between items-start border-b border-zinc-300 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-zinc-800">Recibo de Pagamento Digital</h2>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5 uppercase">Felipe Personal Trainer — CREF 012345-G/SP</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded font-bold border border-zinc-200">
                  Nº {receiptPayment.id.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Main receipt text block */}
            <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
              <p>
                Declaramos para os devidos fins de direito que recebemos de{" "}
                <strong className="text-black text-sm">{getAlunoName(receiptPayment.alunoId)}</strong> a importância líquida de{" "}
                <strong className="text-black text-sm">R$ {receiptPayment.valor.toFixed(2)}</strong> (Valor correspondente por extenso), referente ao plano desportivo{" "}
                <strong className="text-black">{getPlanoName(receiptPayment.planoId)}</strong> de treinamento físico personalizado para o período de referência de{" "}
                <strong className="text-black">{receiptPayment.mesReferencia}</strong>.
              </p>

              <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 grid grid-cols-2 gap-2 text-[11px] mt-4">
                <div><strong>Data do Vencimento:</strong> {receiptPayment.dataVencimento}</div>
                <div><strong>Data de Pagamento:</strong> {receiptPayment.dataPagamento || "Pendente"}</div>
                <div><strong>Forma de Pagamento:</strong> {receiptPayment.formaPagamento || "-"}</div>
                <div><strong>Status do Lançamento:</strong> <span className="font-bold text-emerald-600">{receiptPayment.status}</span></div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-12 pt-8 border-t border-zinc-300 grid grid-cols-2 gap-4 text-center text-[10px] text-zinc-500">
              <div>
                <div className="h-8 flex items-end justify-center border-b border-zinc-300 pb-1 italic font-semibold text-zinc-700">
                  {getAlunoName(receiptPayment.alunoId)}
                </div>
                <span className="mt-1 block">Assinatura do Aluno</span>
              </div>
              <div>
                <div className="h-8 flex items-end justify-center border-b border-zinc-300 pb-1 font-bold text-zinc-800">
                  Felipe
                </div>
                <span className="mt-1 block">Assinatura do Personal</span>
              </div>
            </div>

            {/* Print action footer */}
            <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 mt-8 print:hidden">
              <button
                onClick={() => setReceiptPayment(null)}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Imprimir Recibo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
