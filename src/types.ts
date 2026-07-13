export interface ContactoEmergencia {
  nome: string;
  telefone: string;
  parentesco: string;
}

export interface Anamnese {
  // Etapa 1: Dados Pessoais
  nomeCompleto: string;
  dataNascimento: string;
  genero: string;
  estadoCivil: string;
  telefone: string;
  email: string;
  endereco: string;
  profissao: string;
  horarioTrabalho: string;
  nivelEstresse: number; // 1-10

  // Etapa 2: Histórico Médico
  condicoesMedicas: string[]; // checkboxes: hipertensão, diabetes, asma, cardiaco, etc.
  cirurgiasAnteriores: string;
  medicacoesContinuas: string;
  alergias: string;
  lesoes: string;
  restricoesMedicas: string;
  contatoEmergencia: ContactoEmergencia;

  // Etapa 3: Histórico Atividade Física
  praticaAtividade: boolean;
  detalheAtividade: string;
  atividadesAnteriores: string;
  esportesPraticados: string;
  experienciaMusculacao: 'iniciante' | 'intermediario' | 'avancado';
  preferenciasHorario: string;
  disponibilidadeSemanal: string[]; // Segunda, Terça, etc.

  // Etapa 4: Objetivos e Hábitos
  objetivoPrincipal: string; // emagrecimento, hipertrofia, condicionamento, reabilitacao, performance
  objetivosSecundarios: string;
  pesoAtual: number;
  pesoDesejado: number;
  altura: number; // em cm
  circunferencias: {
    cintura: number;
    quadril: number;
    braço: number;
    coxa: number;
    panturrilha: number;
  };
  gorduraEstimada?: number;
  refeicoesDia: number;
  consumoAgua: number; // litros
  sonoHoras: number;
  sonoDificuldade: boolean;
  alcoolTabaco: string;
  nivelMotivacao: number; // 1-10

  // Etapa 5: Termos e Assinatura
  termoResponsabilidadeAceito: boolean;
  termoImagemAceito: boolean;
  assinaturaDigital: string; // base64 do canvas ou desenho string
  dataPreenchimento: string;
  status: 'Pendente' | 'Completa' | 'Revisada';
  ultimaRevisao: string;
}

export interface Exercicio {
  id: string;
  nome: string;
  grupoMuscular: string;
  equipamento: string;
  dificuldade: 'Iniciante' | 'Intermediário' | 'Avançado';
  descricao: string;
  dicasSeguranca: string;
  videoUrl?: string; // link de demonstração
  fotoUrl?: string;
  variacoes?: string;
}

export interface ExercicioTreino {
  nome: string;
  grupoMuscular: string;
  series: string;
  repeticoes: string;
  descanso: string;
  cargaSugerida: string;
  metodo: string;
  dicaExecucao: string;
  videoUrl?: string; // Link ou Base64 do vídeo de demonstração
  videoFileName?: string; // Nome do arquivo de vídeo carregado
}

export interface TreinoItem {
  id: string; // A, B, C...
  titulo: string;
  foco: string;
  duracaoEstimada: string;
  exercicios: ExercicioTreino[];
}

export interface ProgramaTreinos {
  id: string;
  alunoId: string;
  titulo: string;
  divisao: string; // A/B, A/B/C, Fullbody
  dataInicio: string;
  dataTermino: string;
  notasMotivacionais?: string;
  status: 'Ativo' | 'Concluido' | 'Substituido';
  treinos: TreinoItem[];
}

export interface FotosEvolucao {
  frente?: string;
  lateral?: string;
  costas?: string;
}

export interface AvaliacaoFisica {
  id: string;
  alunoId: string;
  data: string;
  peso: number;
  altura: number;
  imc: number;
  percentualGordura: number; // dobras ou bioimpedancia
  massaMagra: number; // kg
  massaGorda: number; // kg
  // Circunferências completas
  medidas: {
    pescoço: number;
    ombro: number;
    peito: number;
    cintura: number;
    abdômen: number;
    quadril: number;
    braçoDireito: number;
    braçoEsquerdo: number;
    coxaDireita: number;
    coxaEsquerda: number;
    panturrilhaDireita: number;
    panturrilhaEsquerda: number;
  };
  performance: {
    flexoes: number;
    agachamento: number;
    pranchaSegundos: number;
    corridaDistancia: number; // metros em 12min ou similar
  };
  observacoes: string;
}

export interface MetaAluno {
  id: string;
  alunoId: string;
  titulo: string;
  valorAlvo: number;
  valorAtual: number;
  unidade: string;
  prazo: string;
  status: 'Em progresso' | 'Atingida' | 'Nao atingida';
  tipo: 'peso' | 'gordura' | 'medida' | 'performance';
}

export interface Plano {
  id: string;
  nome: string; // Mensal, Trimestral, Semestral, Anual
  valor: number;
  sessoesInclusas: number;
  descricao: string;
}

export interface Pagamento {
  id: string;
  alunoId: string;
  planoId: string;
  valor: number;
  dataPagamento?: string;
  dataVencimento: string;
  formaPagamento?: 'Dinheiro' | 'Pix' | 'Cartao' | 'Transferencia';
  mesReferencia: string;
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado';
  comprovanteUrl?: string;
  reciboUrl?: string;
}

export interface SessaoAgendamento {
  id: string;
  alunoId: string;
  alunoNome: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  duracao: number; // minutos
  tipo: 'Presencial' | 'Online';
  status: 'Agendado' | 'Realizado' | 'Falta Justificada' | 'Falta Sem Justificativa' | 'Cancelado';
  justificativa?: string;
  feedback?: string;
}

export interface VideoTreino {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  dataEnvio: string;
  alunoId: string; // 'todos' ou ID específico
  url: string;
  tipo: 'exercicio_padrao' | 'correcao_personalizada' | 'motivacional';
  assistido: boolean;
}

export interface Mensagem {
  id: string;
  remetenteId: string; // 'personal' ou alunoId
  destinatarioId: string; // alunoId ou 'personal'
  texto: string;
  data: string; // timestamp ISO
  tipo: 'texto' | 'imagem' | 'audio';
  midiaUrl?: string;
}

export interface CheckInTreino {
  id: string;
  alunoId: string;
  treinoId: string; // ex: A, B
  data: string;
  duracaoMinutos: number;
  sensacaoPosTreino: number; // 1-10
  cargasRegistradas: Record<string, string>; // exercicioNome -> carga registrada
  observacoes: string;
}

export interface DiarioTreino {
  id: string;
  alunoId: string;
  data: string;
  nota: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  fotoUrl: string;
  status: 'Ativo' | 'Inativo' | 'Congelado' | 'Trial';
  planoAtivoId: string;
  dataCadastro: string;
  ultimoAcesso?: string;
  contatoEmergencia: ContactoEmergencia;
  anamneseCompleta: boolean;
}

export interface PersonalTrainerConfig {
  nome: string;
  cref: string;
  especializacoes: string[];
  fotoUrl: string;
  logoUrl?: string;
  corPrimaria: string; // hex
  corSecundaria: string; // hex
  modoEscuro: boolean;
  notificacoes: {
    whatsapp: boolean;
    email: boolean;
    push: boolean;
  };
  lembretesAutomaticos: boolean;
}

export interface ProgressPhoto {
  id: string;
  alunoId: string;
  data: string; // YYYY-MM-DD
  legenda: string; // "Antes", "Depois", "Mês 1", "Mês 2", etc.
  url: string; // base64 or Unsplash url
  categoria: "Frente" | "Lateral" | "Costas" | "Livre";
}
