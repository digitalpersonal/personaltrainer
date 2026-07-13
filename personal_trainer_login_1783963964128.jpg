import React, { useState } from "react";
import { Plano, PersonalTrainerConfig } from "../types";
import { Save, Plus, Trash2 } from "lucide-react";

interface TrainerSettingsProps {
  planos: Plano[];
  config: PersonalTrainerConfig;
  onUpdatePlano: (plano: Plano) => void;
  onAddPlano: (plano: Plano) => void;
  onDeletePlano: (planoId: string) => void;
  onUpdateConfig: (config: PersonalTrainerConfig) => void;
}

export default function TrainerSettings({
  planos,
  config,
  onUpdatePlano,
  onAddPlano,
  onDeletePlano,
  onUpdateConfig
}: TrainerSettingsProps) {
  const [editingConfig, setEditingConfig] = useState<PersonalTrainerConfig>(config);

  const handleUpdateConfig = () => {
    onUpdateConfig(editingConfig);
    alert("Dados do professor atualizados!");
  };

  return (
    <div className="space-y-6">
      {/* Edit Config */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">Dados do Professor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={editingConfig.nome}
            onChange={e => setEditingConfig({ ...editingConfig, nome: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-100"
            placeholder="Nome"
          />
          <input
            type="text"
            value={editingConfig.cref}
            onChange={e => setEditingConfig({ ...editingConfig, cref: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-100"
            placeholder="CREF"
          />
        </div>
        <button
          onClick={handleUpdateConfig}
          className="mt-4 flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          <Save className="w-3.5 h-3.5" /> Salvar Configurações
        </button>
      </div>

      {/* Edit Plans */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">Planos Mensais</h3>
        <div className="space-y-3">
          {planos.map(plano => (
            <div key={plano.id} className="flex items-center gap-3 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800">
              <input
                type="text"
                value={plano.nome}
                onChange={e => onUpdatePlano({ ...plano, nome: e.target.value })}
                className="flex-1 bg-transparent border-none text-sm font-semibold text-zinc-100"
              />
              <input
                type="number"
                value={plano.valor}
                onChange={e => onUpdatePlano({ ...plano, valor: parseFloat(e.target.value) })}
                className="w-20 bg-transparent border-none text-sm text-emerald-400 font-bold"
              />
              <button onClick={() => onDeletePlano(plano.id)} className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onAddPlano({ id: "plano_" + Date.now(), nome: "Novo Plano", valor: 0, sessoesInclusas: 0, descricao: "" })}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Plano
          </button>
        </div>
      </div>
    </div>
  );
}
