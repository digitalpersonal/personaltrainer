import { Aluno, Anamnese, Exercicio, ProgramaTreinos, AvaliacaoFisica, Pagamento, Plano, SessaoAgendamento, VideoTreino, Mensagem, MetaAluno, CheckInTreino, PersonalTrainerConfig, ProgressPhoto } from "./types";

// 1. Biblioteca de Exercícios Padrão
export const EXERCICIOS_PADRAO: Exercicio[] = [
  {
    id: "ex_1",
    nome: "Agachamento Livre com Barra",
    grupoMuscular: "Quadríceps / Glúteos",
    equipamento: "Barra e Anilhas",
    dificuldade: "Intermediário",
    descricao: "Posicione a barra sobre os trapézios. Mantenha os pés afastados na largura dos ombros. Flexione os joelhos empurrando o quadril para trás como se fosse sentar em uma cadeira, mantendo a coluna ereta, até formar um ângulo de 90 graus ou mais. Estenda as pernas para retornar à posição inicial.",
    dicasSeguranca: "Não curve a coluna lombar. Evite que os joelhos fiquem direcionados para dentro (valgo dinâmico). Mantenha o abdômen contraído durante todo o movimento.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    fotoUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=300&auto=format&fit=crop",
    variacoes: "Agachamento sumô, agachamento frontal, agachamento búlgaro."
  },
  {
    id: "ex_2",
    nome: "Supino Reto com Barra",
    grupoMuscular: "Peitoral Maior / Tríceps",
    equipamento: "Banco de Supino e Barra",
    dificuldade: "Intermediário",
    descricao: "Deite-se em um banco plano com os pés apoiados firmemente no chão. Segure a barra com pegada pronada um pouco mais larga que os ombros. Retire a barra do suporte e desça controladamente até tocar levemente a linha dos mamilos. Empurre a barra de volta à posição inicial estendendo os cotovelos.",
    dicasSeguranca: "Não retire os glúteos do banco. Mantenha as escápulas retraídas (adução). Use um assistente de segurança se for utilizar cargas muito elevadas.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    fotoUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=300&auto=format&fit=crop",
    variacoes: "Supino com halteres, supino inclinado, supino declinado."
  },
  {
    id: "ex_3",
    nome: "Puxada Frontal na Polia",
    grupoMuscular: "Dorsal / Bíceps",
    equipamento: "Polia Alta (Pulldown)",
    dificuldade: "Iniciante",
    descricao: "Sente-se no aparelho com as coxas bem ajustadas sob o apoio. Segure a barra com as mãos bem afastadas em pegada pronada. Incline ligeiramente o tronco para trás e puxe a barra em direção ao peito, contraindo as escápulas. Retorne lentamente estendendo totalmente os braços.",
    dicasSeguranca: "Evite puxar a barra por trás do pescoço para poupar a articulação dos ombros. Mantenha o movimento controlado e não use o embalo do corpo.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    fotoUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=300&auto=format&fit=crop",
    variacoes: "Puxada fechada com triângulo, puxada supinada."
  },
  {
    id: "ex_4",
    nome: "Cadeira Extensora",
    grupoMuscular: "Quadríceps",
    equipamento: "Aparelho Extensor",
    dificuldade: "Iniciante",
    descricao: "Ajuste o encosto de modo que a dobra do joelho fique no limite do assento e o rolo de espuma fique apoiado sobre o tornozelo. Segure firme nos apoios laterais e estenda completamente os joelhos contraindo as coxas. Retorne controladamente ao ponto de partida.",
    dicasSeguranca: "Evite movimentos bruscos de batida de joelho no final da extensão. Não retire o quadril do banco durante o esforço.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    fotoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
    variacoes: "Extensora unilateral."
  },
  {
    id: "ex_5",
    nome: "Stiff com Halteres",
    grupoMuscular: "Posteriores de Coxa / Glúteos",
    equipamento: "Halteres",
    dificuldade: "Intermediário",
    descricao: "Fique em pé segurando um halter em cada mão à frente das coxas. Com os joelhos semiflexionados (travados), empurre o quadril para trás e flexione o tronco mantendo a coluna totalmente ereta e a barra/halteres próximos às pernas. Desça até sentir alongar os posteriores e volte contraindo glúteos.",
    dicasSeguranca: "Mantenha a coluna neutra. Se a coluna começar a curvar, interrompa a descida. O foco é empurrar o quadril para trás, não descer os braços.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    fotoUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=300&auto=format&fit=crop",
    variacoes: "Stiff com barra, levantamento terra romeno."
  },
  {
    id: "ex_6",
    nome: "Prancha Abdominal Isométrica",
    grupoMuscular: "Core (Abdominal / Lombar)",
    equipamento: "Colchonete",
    dificuldade: "Iniciante",
    descricao: "Deite-se de bruços e apoie os antebraços no chão, mantendo os cotovelos alinhados com os ombros. Apoie a ponta dos pés e eleve o quadril, alinhando o corpo da cabeça aos calcanhares. Mantenha o abdômen contraído firmemente durante o tempo determinado.",
    dicasSeguranca: "Não deixe o quadril cair em direção ao chão e evite empinar o quadril alto demais. Mantenha o pescoço em posição neutra olhando para baixo.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    fotoUrl: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=300&auto=format&fit=crop",
    variacoes: "Prancha lateral, prancha dinâmica com toques."
  }
];

// 2. Planos Padrão
export const PLANOS_PADRAO: Plano[] = [
  { id: "plano_mensal", nome: "Mensal", valor: 150.00, sessoesInclusas: 4, descricao: "Plano mensal padrão com 1 sessão presencial semanal e acompanhamento online." },
  { id: "plano_trimestral", nome: "Trimestral", valor: 400.00, sessoesInclusas: 12, descricao: "Ideal para iniciar com acompanhamento. Parcelas com desconto e avaliações." },
  { id: "plano_semestral", nome: "Semestral", valor: 750.00, sessoesInclusas: 24, descricao: "Excelente custo-benefício. Garante continuidade por 6 meses com suporte diário." },
  { id: "plano_anual", nome: "Anual", valor: 1320.00, sessoesInclusas: 48, descricao: "Foco total a longo prazo. Avaliação gratuita mensal e suporte prioritário no WhatsApp." }
];

// 3. Alunos de Exemplo (Seed Data)
export const ALUNOS_PADRAO: Aluno[] = [
  {
    id: "aluno_1",
    nome: "Lucas Mendes Silva",
    email: "lucasmendes@gmail.com",
    telefone: "(11) 98765-4321",
    fotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    status: "Ativo",
    planoAtivoId: "plano_mensal",
    dataCadastro: "2026-03-10",
    ultimoAcesso: "2026-07-11T10:30:00-07:00",
    contatoEmergencia: { nome: "Maria Mendes (Mãe)", telefone: "(11) 98888-7777", parentesco: "Mãe" },
    anamneseCompleta: true
  },
  {
    id: "aluno_2",
    nome: "Beatriz Santos Souza",
    email: "beatrizsantos@gmail.com",
    telefone: "(11) 97777-6666",
    fotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    status: "Ativo",
    planoAtivoId: "plano_trimestral",
    dataCadastro: "2026-05-15",
    ultimoAcesso: "2026-07-10T18:45:00-07:00",
    contatoEmergencia: { nome: "João Souza (Pai)", telefone: "(11) 99999-5555", parentesco: "Pai" },
    anamneseCompleta: true
  },
  {
    id: "aluno_3",
    nome: "Carlos Eduardo Nogueira",
    email: "carlosedu@gmail.com",
    telefone: "(21) 96666-5555",
    fotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    status: "Ativo",
    // Aluno em atraso > 7 dias (vencimento foi 2026-07-01, hoje é 2026-07-11, status do pagamento atrasado)
    planoAtivoId: "plano_mensal",
    dataCadastro: "2026-01-20",
    ultimoAcesso: "2026-07-02T15:00:00-07:00",
    contatoEmergencia: { nome: "Fernanda Nogueira (Irmã)", telefone: "(21) 98877-6655", parentesco: "Irmã" },
    anamneseCompleta: true
  },
  {
    id: "aluno_4",
    nome: "Juliana Rocha Lima",
    email: "julianarocha@gmail.com",
    telefone: "(11) 95555-4444",
    fotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    status: "Ativo",
    // Aluno com ANAMNESE PENDENTE para testar a regra de negócio que impede atribuição de treino
    planoAtivoId: "plano_mensal",
    dataCadastro: "2026-07-09",
    ultimoAcesso: "2026-07-09T14:00:00-07:00",
    contatoEmergencia: { nome: "Pedro Lima (Cônjuge)", telefone: "(11) 97777-1111", parentesco: "Cônjuge" },
    anamneseCompleta: false
  }
];

// 4. Anamneses correspondentes
export const ANAMNESES_PADRAO: Record<string, Anamnese> = {
  aluno_1: {
    nomeCompleto: "Lucas Mendes Silva",
    dataNascimento: "1994-08-15",
    genero: "Masculino",
    estadoCivil: "Solteiro",
    telefone: "(11) 98765-4321",
    email: "lucasmendes@gmail.com",
    endereco: "Rua das Flores, 123, São Paulo - SP",
    profissao: "Desenvolvedor de Software",
    horarioTrabalho: "09:00 às 18:00 (Sentado)",
    nivelEstresse: 8,
    condicoesMedicas: ["Hipertensão Controlada"],
    cirurgiasAnteriores: "Nenhuma",
    medicacoesContinuas: "Losartana 50mg (1x ao dia)",
    alergias: "Alergia a frutos do mar",
    lesoes: "Leve desconforto no joelho direito ao fazer flexão profunda",
    restricoesMedicas: "Nenhuma restrição formal, liberação cardiológica OK",
    contatoEmergencia: { nome: "Maria Mendes (Mãe)", telefone: "(11) 98888-7777", parentesco: "Mãe" },
    praticaAtividade: true,
    detalheAtividade: "Corrida leve 2x na semana, 30 minutos",
    atividadesAnteriores: "Futebol aos fins de semana, musculação esporádica",
    esportesPraticados: "Corrida, Futebol",
    experienciaMusculacao: "intermediario",
    preferenciasHorario: "A partir das 19:00",
    disponibilidadeSemanal: ["Segunda", "Quarta", "Sexta"],
    objetivoPrincipal: "Hipertrofia",
    objetivosSecundarios: "Melhora da flexibilidade e condicionamento cardiovascular",
    pesoAtual: 78.5,
    pesoDesejado: 83.0,
    altura: 178,
    circunferencias: { cintura: 84, quadril: 98, braço: 32.5, coxa: 56, panturrilha: 37 },
    gorduraEstimada: 18.2,
    refeicoesDia: 4,
    consumoAgua: 2.5,
    sonoHoras: 6.5,
    sonoDificuldade: true,
    alcoolTabaco: "Bebe socialmente (fim de semana). Não fuma.",
    nivelMotivacao: 9,
    termoResponsabilidadeAceito: true,
    termoImagemAceito: true,
    assinaturaDigital: "Lucas Mendes Silva (Assinado via Tela)",
    dataPreenchimento: "2026-03-10",
    status: "Completa",
    ultimaRevisao: "2026-03-10"
  },
  aluno_2: {
    nomeCompleto: "Beatriz Santos Souza",
    dataNascimento: "1998-03-24",
    genero: "Feminino",
    estadoCivil: "Solteira",
    telefone: "(11) 97777-6666",
    email: "beatrizsantos@gmail.com",
    endereco: "Av. Paulista, 1500, São Paulo - SP",
    profissao: "Arquiteta",
    horarioTrabalho: "08:00 às 17:00",
    nivelEstresse: 5,
    condicoesMedicas: [],
    cirurgiasAnteriores: "Nenhuma",
    medicacoesContinuas: "Nenhuma",
    alergias: "Nenhuma",
    lesoes: "Nenhuma",
    restricoesMedicas: "Nenhuma",
    contatoEmergencia: { nome: "João Souza (Pai)", telefone: "(11) 99999-5555", parentesco: "Pai" },
    praticaAtividade: false,
    detalheAtividade: "",
    atividadesAnteriores: "Pilates há 1 ano",
    esportesPraticados: "Nenhum",
    experienciaMusculacao: "iniciante",
    preferenciasHorario: "Manhã (07:00 às 09:00)",
    disponibilidadeSemanal: ["Terça", "Quinta", "Sábado"],
    objetivoPrincipal: "Emagrecimento",
    objetivosSecundarios: "Definição muscular, perda de gordura localizada",
    pesoAtual: 68.0,
    pesoDesejado: 60.0,
    altura: 165,
    circunferencias: { cintura: 76, quadril: 104, braço: 27, coxa: 59, panturrilha: 35 },
    gorduraEstimada: 26.5,
    refeicoesDia: 5,
    consumoAgua: 3.0,
    sonoHoras: 7.5,
    sonoDificuldade: false,
    alcoolTabaco: "Não fuma. Bebe socialmente raramente.",
    nivelMotivacao: 10,
    termoResponsabilidadeAceito: true,
    termoImagemAceito: true,
    assinaturaDigital: "Beatriz S. Souza (Assinado digitalmente)",
    dataPreenchimento: "2026-05-15",
    status: "Completa",
    ultimaRevisao: "2026-05-15"
  },
  aluno_3: {
    nomeCompleto: "Carlos Eduardo Nogueira",
    dataNascimento: "1985-11-02",
    genero: "Masculino",
    estadoCivil: "Casado",
    telefone: "(21) 96666-5555",
    email: "carlosedu@gmail.com",
    endereco: "Rua Barata Ribeiro, Copacabana, Rio de Janeiro - RJ",
    profissao: "Gerente de Banco",
    horarioTrabalho: "08:00 às 19:00 (Alta pressão)",
    nivelEstresse: 9,
    condicoesMedicas: ["Hipertensão", "Colesterol Alto"],
    cirurgiasAnteriores: "Artroscopia joelho esquerdo (2021)",
    medicacoesContinuas: "Estatina 20mg (noite)",
    alergias: "Dipirona",
    lesoes: "Pontadas esporádicas no menisco do joelho esquerdo",
    restricoesMedicas: "Evitar impactos repetitivos no joelho esquerdo",
    contatoEmergencia: { nome: "Fernanda Nogueira (Irmã)", telefone: "(21) 98877-6655", parentesco: "Irmã" },
    praticaAtividade: true,
    detalheAtividade: "Musculação 3x na semana (no passado)",
    atividadesAnteriores: "Musculação e Natação",
    esportesPraticados: "Natação",
    experienciaMusculacao: "avancado",
    preferenciasHorario: "Fim do dia (20:00)",
    disponibilidadeSemanal: ["Segunda", "Terça", "Quinta", "Sexta"],
    objetivoPrincipal: "Condicionamento físico",
    objetivosSecundarios: "Saúde cardiovascular, reabilitação do joelho e alívio do estresse",
    pesoAtual: 92.0,
    pesoDesejado: 84.0,
    altura: 182,
    circunferencias: { cintura: 96, quadril: 105, braço: 37, coxa: 61, panturrilha: 39 },
    gorduraEstimada: 24.1,
    refeicoesDia: 3,
    consumoAgua: 2.0,
    sonoHoras: 5.5,
    sonoDificuldade: true,
    alcoolTabaco: "Bebe cerveja nos finais de semana. Ex-fumante.",
    nivelMotivacao: 7,
    termoResponsabilidadeAceito: true,
    termoImagemAceito: false,
    assinaturaDigital: "Carlos Eduardo N. (Assinado)",
    dataPreenchimento: "2026-01-20",
    status: "Completa",
    ultimaRevisao: "2026-01-20"
  },
  // Aluno 4 tem anamnese PENDENTE
  aluno_4: {
    nomeCompleto: "Juliana Rocha Lima",
    dataNascimento: "1991-05-12",
    genero: "Feminino",
    estadoCivil: "Casada",
    telefone: "(11) 95555-4444",
    email: "julianarocha@gmail.com",
    endereco: "",
    profissao: "",
    horarioTrabalho: "",
    nivelEstresse: 1,
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
    objetivoPrincipal: "Condicionamento físico",
    objetivosSecundarios: "",
    pesoAtual: 0,
    pesoDesejado: 0,
    altura: 0,
    circunferencias: { cintura: 0, quadril: 0, braço: 0, coxa: 0, panturrilha: 0 },
    gorduraEstimada: 0,
    refeicoesDia: 3,
    consumoAgua: 1,
    sonoHoras: 8,
    sonoDificuldade: false,
    alcoolTabaco: "",
    nivelMotivacao: 8,
    termoResponsabilidadeAceito: false,
    termoImagemAceito: false,
    assinaturaDigital: "",
    dataPreenchimento: "",
    status: "Pendente", // Pendente de preenchimento completo!
    ultimaRevisao: ""
  }
};

// 5. Programas de Treino correspondentes (Aluno 1 e Aluno 2, Aluno 3 tem, Aluno 4 NÃO PODE TER pois está pendente!)
export const TREINOS_PADRAO: ProgramaTreinos[] = [
  {
    id: "prog_1",
    alunoId: "aluno_1",
    titulo: "Hipertrofia Clássica - Foco em Pernas e Peito",
    divisao: "A/B",
    dataInicio: "2026-07-01",
    dataTermino: "2026-08-31",
    notasMotivacionais: "Lucas, foco total na cadência e controle da descida (excêntrica) nos agachamentos e supinos! Cuidado com o joelho, respeite o seu limite. Bom treino!",
    status: "Ativo",
    treinos: [
      {
        id: "A",
        titulo: "Treino A - Membros Superiores (Peito, Costas, Ombro e Tríceps)",
        foco: "Hipertrofia Superior Geral",
        duracaoEstimada: "55 min",
        exercicios: [
          {
            nome: "Supino Reto com Barra",
            grupoMuscular: "Peitoral",
            series: "4",
            repeticoes: "8 a 10",
            descanso: "90 segundos",
            cargaSugerida: "25kg de cada lado",
            metodo: "Pirâmide Crescente",
            dicaExecucao: "Retraia as escápulas antes de tirar a barra do suporte. Desça controlando."
          },
          {
            nome: "Puxada Frontal na Polia",
            grupoMuscular: "Dorsais",
            series: "4",
            repeticoes: "10 a 12",
            descanso: "60 segundos",
            cargaSugerida: "45kg no tijolo",
            metodo: "Direto",
            dicaExecucao: "Esfregue os cotovelos nas costelas na descida. Evite balançar o tronco."
          },
          {
            nome: "Desenvolvimento com Halteres",
            grupoMuscular: "Deltoides",
            series: "3",
            repeticoes: "10",
            descanso: "60 segundos",
            cargaSugerida: "14kg cada halter",
            metodo: "Direto",
            dicaExecucao: "Suba os halteres em arco, sem bater um no outro no topo."
          },
          {
            nome: "Tríceps Corda na Polia",
            grupoMuscular: "Tríceps",
            series: "4",
            repeticoes: "12",
            descanso: "45 segundos",
            cargaSugerida: "20kg",
            metodo: "Drop-set na última série",
            dicaExecucao: "Abra a corda embaixo para contrair ao máximo a porção lateral do tríceps."
          }
        ]
      },
      {
        id: "B",
        titulo: "Treino B - Membros Inferiores e Core",
        foco: "Hipertrofia de Quadríceps, Isquiotibiais e Glúteo",
        duracaoEstimada: "50 min",
        exercicios: [
          {
            nome: "Agachamento Livre com Barra",
            grupoMuscular: "Quadríceps / Glúteos",
            series: "4",
            repeticoes: "10",
            descanso: "90 segundos",
            cargaSugerida: "20kg de cada lado",
            metodo: "Direto",
            dicaExecucao: "Joelhos direcionados para fora. Desça até quebrar os 90 graus com segurança."
          },
          {
            nome: "Cadeira Extensora",
            grupoMuscular: "Quadríceps",
            series: "3",
            repeticoes: "12 a 15",
            descanso: "60 segundos",
            cargaSugerida: "40kg",
            metodo: "Rest-pause na última",
            dicaExecucao: "Segure 1 segundo no topo (pico de contração) antes de descer."
          },
          {
            nome: "Stiff com Halteres",
            grupoMuscular: "Posteriores",
            series: "4",
            repeticoes: "10",
            descanso: "60 segundos",
            cargaSugerida: "16kg cada halter",
            metodo: "Direto",
            dicaExecucao: "Coluna reta. Empurre o quadril bem para trás até sentir os isquiotibiais alongarem."
          },
          {
            nome: "Prancha Abdominal Isométrica",
            grupoMuscular: "Core",
            series: "3",
            repeticoes: "45 segundos",
            descanso: "45 segundos",
            cargaSugerida: "Peso corporal",
            metodo: "Isometria",
            dicaExecucao: "Contraia o glúteo e o abdômen fortemente. Não curve a coluna."
          }
        ]
      }
    ]
  },
  {
    id: "prog_2",
    alunoId: "aluno_2",
    titulo: "Emagrecimento e Definição Express",
    divisao: "A/B",
    dataInicio: "2026-05-16",
    dataTermino: "2026-08-15",
    notasMotivacionais: "Bia, vamos focar no gasto energético elevado com descansos curtos. Mantenha-se hidratada durante as sessões!",
    status: "Ativo",
    treinos: [
      {
        id: "A",
        titulo: "Treino A - Inferiores Foco Anterior + Cardio",
        foco: "Gasto calórico e Fortalecimento Inferior",
        duracaoEstimada: "45 min",
        exercicios: [
          {
            nome: "Agachamento Livre com Barra",
            grupoMuscular: "Pernas",
            series: "4",
            repeticoes: "12 a 15",
            descanso: "45 segundos",
            cargaSugerida: "10kg total",
            metodo: "Direto",
            dicaExecucao: "Priorize a amplitude e velocidade controlada."
          },
          {
            nome: "Cadeira Extensora",
            grupoMuscular: "Quadríceps",
            series: "3",
            repeticoes: "15",
            descanso: "30 segundos",
            cargaSugerida: "20kg",
            metodo: "Direto",
            dicaExecucao: "Cadência 2s na subida e 2s na descida."
          },
          {
            nome: "Passadas com Halteres (Afundo)",
            grupoMuscular: "Quadríceps / Glúteo",
            series: "3",
            repeticoes: "20 passos no total",
            descanso: "45 segundos",
            cargaSugerida: "6kg cada halter",
            metodo: "Dinâmico",
            dicaExecucao: "Dê passos firmes e afunde o joelho de trás quase encostando no chão."
          }
        ]
      },
      {
        id: "B",
        titulo: "Treino B - Superiores e Core Intensivo",
        foco: "Tonificação Superior e Fortalecimento Abdominal",
        duracaoEstimada: "45 min",
        exercicios: [
          {
            nome: "Puxada Frontal na Polia",
            grupoMuscular: "Costas",
            series: "4",
            repeticoes: "12",
            descanso: "45 segundos",
            cargaSugerida: "25kg",
            metodo: "Direto",
            dicaExecucao: "Abra bem o peito ao puxar a barra em direção à clavícula."
          },
          {
            nome: "Supino com Halteres (Inclinado)",
            grupoMuscular: "Peito / Ombro",
            series: "3",
            repeticoes: "12",
            descanso: "45 segundos",
            cargaSugerida: "8kg cada halter",
            metodo: "Direto",
            dicaExecucao: "Banco a 30 graus. Movimento controlado na descida."
          },
          {
            nome: "Prancha Abdominal Isométrica",
            grupoMuscular: "Core",
            series: "4",
            repeticoes: "40 segundos",
            descanso: "30 segundos",
            cargaSugerida: "Peso corporal",
            metodo: "Isometria",
            dicaExecucao: "Foco total na respiração calma enquanto mantém o core ativado."
          }
        ]
      }
    ]
  },
  {
    id: "prog_3",
    alunoId: "aluno_3",
    titulo: "Fortalecimento Geral e Cardio Seguro",
    divisao: "Fullbody",
    dataInicio: "2026-01-22",
    dataTermino: "2026-04-22",
    notasMotivacionais: "Carlos, foco total na proteção articular do joelho esquerdo. Sem agachamento livre pesado, faremos movimentos controlados e isométricos.",
    status: "Concluido", // Exemplo de histórico concluído para visualização
    treinos: [
      {
        id: "Full",
        titulo: "Treino Fullbody - Condicionamento Geral",
        foco: "Força Funcional e Saúde Cardiovascular",
        duracaoEstimada: "60 min",
        exercicios: [
          {
            nome: "Cadeira Extensora (Isometria)",
            grupoMuscular: "Quadríceps",
            series: "4",
            repeticoes: "20 segundos holds",
            descanso: "45 segundos",
            cargaSugerida: "30kg",
            metodo: "Isométrico",
            dicaExecucao: "Estenda a perna e segure firme na contração máxima sem trancos."
          },
          {
            nome: "Puxada Frontal na Polia",
            grupoMuscular: "Costas",
            series: "4",
            repeticoes: "12",
            descanso: "60 segundos",
            cargaSugerida: "35kg",
            metodo: "Direto",
            dicaExecucao: "Controle a subida para não estressar os ombros."
          }
        ]
      }
    ]
  }
];

// 6. Avaliações Físicas Históricas (Mensais para Lucas e Bia)
export const AVALIACOES_PADRAO: AvaliacaoFisica[] = [
  // Lucas Mendes - Mês 1 (Cadastro - Março 2026)
  {
    id: "av_1",
    alunoId: "aluno_1",
    data: "2026-03-10",
    peso: 82.0,
    altura: 178,
    imc: 25.8, // 82 / (1.78 * 1.78)
    percentualGordura: 21.0,
    massaMagra: 64.78,
    massaGorda: 17.22,
    medidas: {
      pescoço: 38, ombro: 112, peito: 100, cintura: 88, abdômen: 92, quadril: 102,
      braçoDireito: 31.0, braçoEsquerdo: 30.5, coxaDireita: 54.0, coxaEsquerda: 53.5,
      panturrilhaDireita: 36.0, panturrilhaEsquerda: 35.8
    },
    performance: { flexoes: 15, agachamento: 20, pranchaSegundos: 30, corridaDistancia: 1800 },
    observacoes: "Avaliação inicial. Aluno apresenta leve encurtamento na cadeia posterior e resistência cardiovascular iniciante. Hipertensão controlada por medicação."
  },
  // Lucas Mendes - Mês 2 (Abril 2026)
  {
    id: "av_2",
    alunoId: "aluno_1",
    data: "2026-04-10",
    peso: 80.5,
    altura: 178,
    imc: 25.4,
    percentualGordura: 19.5,
    massaMagra: 64.8,
    massaGorda: 15.7,
    medidas: {
      pescoço: 38, ombro: 113, peito: 100, cintura: 86, abdômen: 90, quadril: 100,
      braçoDireito: 31.5, braçoEsquerdo: 31.2, coxaDireita: 54.5, coxaEsquerda: 54.0,
      panturrilhaDireita: 36.2, panturrilhaEsquerda: 36.0
    },
    performance: { flexoes: 20, agachamento: 25, pranchaSegundos: 45, corridaDistancia: 2000 },
    observacoes: "Boa evolução. Houve perda de gordura abdominal expressiva. Relatou melhora nas dores lombares corporais de trabalho."
  },
  // Lucas Mendes - Mês 3 (Maio 2026)
  {
    id: "av_3",
    alunoId: "aluno_1",
    data: "2026-05-10",
    peso: 79.5,
    altura: 178,
    imc: 25.1,
    percentualGordura: 18.8,
    massaMagra: 64.55,
    massaGorda: 14.95,
    medidas: {
      pescoço: 37.5, ombro: 114, peito: 101, cintura: 85, abdômen: 88, quadril: 99,
      braçoDireito: 32.0, braçoEsquerdo: 31.8, coxaDireita: 55.0, coxaEsquerda: 54.8,
      panturrilhaDireita: 36.5, panturrilhaEsquerda: 36.3
    },
    performance: { flexoes: 24, agachamento: 30, pranchaSegundos: 60, corridaDistancia: 2100 },
    observacoes: "Consistente. Aumento gradual de cargas no supino e agachamento leve."
  },
  // Lucas Mendes - Mês 4 (Maio 2026 -> Julho 2026, Avaliação Recente)
  {
    id: "av_4",
    alunoId: "aluno_1",
    data: "2026-07-10",
    peso: 78.5,
    altura: 178,
    imc: 24.8,
    percentualGordura: 18.2,
    massaMagra: 64.21,
    massaGorda: 14.29,
    medidas: {
      pescoço: 37, ombro: 115, peito: 102, cintura: 84, abdômen: 87, quadril: 98,
      braçoDireito: 32.5, braçoEsquerdo: 32.3, coxaDireita: 56.0, coxaEsquerda: 55.8,
      panturrilhaDireita: 37.0, panturrilhaEsquerda: 36.8
    },
    performance: { flexoes: 30, agachamento: 35, pranchaSegundos: 90, corridaDistancia: 2400 },
    observacoes: "Excelente evolução nos últimos 4 meses. Massa magra estabilizada com redução contínua do percentual de gordura. Dores no joelho sumiram completamente."
  },

  // Beatriz Santos - Mês 1 (Maio 2026)
  {
    id: "av_5",
    alunoId: "aluno_2",
    data: "2026-05-15",
    peso: 70.0,
    altura: 165,
    imc: 25.7,
    percentualGordura: 28.5,
    massaMagra: 50.05,
    massaGorda: 19.95,
    medidas: {
      pescoço: 33, ombro: 98, peito: 88, cintura: 78, abdômen: 84, quadril: 106,
      braçoDireito: 28.0, braçoEsquerdo: 27.8, coxaDireita: 60.5, coxaEsquerda: 60.0,
      panturrilhaDireita: 35.5, panturrilhaEsquerda: 35.3
    },
    performance: { flexoes: 5, agachamento: 15, pranchaSegundos: 20, corridaDistancia: 1200 },
    observacoes: "Avaliação inicial de emagrecimento. Bia está muito motivada. Postura necessita de ajustes de ativação do core."
  },
  // Beatriz Santos - Mês 2 (Junho 2026)
  {
    id: "av_6",
    alunoId: "aluno_2",
    data: "2026-06-15",
    peso: 68.0,
    altura: 165,
    imc: 25.0,
    percentualGordura: 26.5,
    massaMagra: 49.98,
    massaGorda: 18.02,
    medidas: {
      pescoço: 32.5, ombro: 98, peito: 87, cintura: 76, abdômen: 82, quadril: 104,
      braçoDireito: 27.2, braçoEsquerdo: 27.0, coxaDireita: 59.0, coxaEsquerda: 58.8,
      panturrilhaDireita: 35.0, panturrilhaEsquerda: 34.8
    },
    performance: { flexoes: 8, agachamento: 22, pranchaSegundos: 40, corridaDistancia: 1400 },
    observacoes: "Evolução exemplar no primeiro mês. Perdeu 2kg puramente de gordura e reduziu 2cm de abdômen."
  }
];

// 7. Metas por Aluno
export const METAS_PADRAO: MetaAluno[] = [
  { id: "meta_1", alunoId: "aluno_1", titulo: "Reduzir Gordura Corporal", valorAlvo: 15, valorAtual: 18.2, unidade: "%", prazo: "2026-09-30", status: "Em progresso", tipo: "gordura" },
  { id: "meta_2", alunoId: "aluno_1", titulo: "Ganhar Massa Muscular (Peso)", valorAlvo: 82.0, valorAtual: 78.5, unidade: "kg", prazo: "2026-12-31", status: "Em progresso", tipo: "peso" },
  { id: "meta_3", alunoId: "aluno_2", titulo: "Alcançar 60kg no Peso Corporal", valorAlvo: 60.0, valorAtual: 68.0, unidade: "kg", prazo: "2026-10-15", status: "Em progresso", tipo: "peso" },
  { id: "meta_4", alunoId: "aluno_2", titulo: "Sustentar Prancha por 60 segundos", valorAlvo: 60, valorAtual: 40, unidade: "s", prazo: "2026-08-30", status: "Em progresso", tipo: "performance" }
];

// 8. Histórico Financeiro / Pagamentos
// Aluno Carlos (aluno_3) tem um pagamento em ATRASO > 7 dias: vencimento em 2026-07-01 e hoje é 2026-07-11.
export const PAGAMENTOS_PADRAO: Pagamento[] = [
  // Pagamentos Lucas (aluno_1)
  { id: "pag_1", alunoId: "aluno_1", planoId: "plano_mensal", valor: 150.00, dataPagamento: "2026-03-10", dataVencimento: "2026-04-10", formaPagamento: "Pix", mesReferencia: "Março/2026", status: "Pago" },
  { id: "pag_2", alunoId: "aluno_1", planoId: "plano_mensal", valor: 150.00, dataPagamento: "2026-04-09", dataVencimento: "2026-05-10", formaPagamento: "Pix", mesReferencia: "Abril/2026", status: "Pago" },
  { id: "pag_3", alunoId: "aluno_1", planoId: "plano_mensal", valor: 150.00, dataPagamento: "2026-05-10", dataVencimento: "2026-06-10", formaPagamento: "Pix", mesReferencia: "Maio/2026", status: "Pago" },
  { id: "pag_4", alunoId: "aluno_1", planoId: "plano_mensal", valor: 150.00, dataPagamento: "2026-06-08", dataVencimento: "2026-07-10", formaPagamento: "Cartao", mesReferencia: "Junho/2026", status: "Pago" },
  { id: "pag_5", alunoId: "aluno_1", planoId: "plano_mensal", valor: 150.00, dataVencimento: "2026-08-10", status: "Pendente", mesReferencia: "Julho/2026" }, // Próximo vencimento

  // Pagamentos Beatriz (aluno_2) - Trimestral
  { id: "pag_6", alunoId: "aluno_2", planoId: "plano_trimestral", valor: 400.00, dataPagamento: "2026-05-15", dataVencimento: "2026-08-15", formaPagamento: "Cartao", mesReferencia: "Mai-Ago/2026", status: "Pago" },

  // Pagamentos Carlos (aluno_3) - EM ATRASO > 7 DIAS
  { id: "pag_7", alunoId: "aluno_3", planoId: "plano_mensal", valor: 150.00, dataPagamento: "2026-05-20", dataVencimento: "2026-06-20", formaPagamento: "Pix", mesReferencia: "Maio/2026", status: "Pago" },
  { id: "pag_8", alunoId: "aluno_3", planoId: "plano_mensal", valor: 150.00, dataVencimento: "2026-07-01", status: "Atrasado", mesReferencia: "Junho/2026" }, // Vencido há 10 dias! Bloqueia treinos de Carlos!

  // Pagamentos Juliana (aluno_4)
  { id: "pag_9", alunoId: "aluno_4", planoId: "plano_mensal", valor: 150.00, dataPagamento: "2026-07-09", dataVencimento: "2026-08-09", formaPagamento: "Pix", mesReferencia: "Julho/2026", status: "Pago" }
];

// 9. Sessões Agendadas / Calendário (Agendamentos Recentes, Hoje, Futuro)
export const AGENDAMENTOS_PADRAO: SessaoAgendamento[] = [
  // Ontem (10 de Julho)
  { id: "ag_1", alunoId: "aluno_1", alunoNome: "Lucas Mendes Silva", data: "2026-07-10", horario: "19:00", duracao: 60, tipo: "Presencial", status: "Realizado", feedback: "Excelente treino de peitorais e tríceps, mantendo ótimas cargas." },
  { id: "ag_2", alunoId: "aluno_2", alunoNome: "Beatriz Santos Souza", data: "2026-07-10", horario: "08:00", duracao: 60, tipo: "Presencial", status: "Realizado", feedback: "Bia completou os circuitos com muito fôlego." },
  
  // Hoje (11 de Julho de 2026 - Data atual da simulação)
  { id: "ag_3", alunoId: "aluno_1", alunoNome: "Lucas Mendes Silva", data: "2026-07-11", horario: "19:30", duracao: 60, tipo: "Presencial", status: "Agendado" },
  { id: "ag_4", alunoId: "aluno_4", alunoNome: "Juliana Rocha Lima", data: "2026-07-11", horario: "14:00", duracao: 60, tipo: "Presencial", status: "Agendado" },

  // Amanhã em diante
  { id: "ag_5", alunoId: "aluno_2", alunoNome: "Beatriz Santos Souza", data: "2026-07-14", horario: "08:00", duracao: 60, tipo: "Presencial", status: "Agendado" },
  { id: "ag_6", alunoId: "aluno_1", alunoNome: "Lucas Mendes Silva", data: "2026-07-15", horario: "19:00", duracao: 60, tipo: "Presencial", status: "Agendado" },
  { id: "ag_7", alunoId: "aluno_3", alunoNome: "Carlos Eduardo Nogueira", data: "2026-07-16", horario: "20:00", duracao: 60, tipo: "Presencial", status: "Agendado" },

  // Faltas Históricas para testar alertas de evasão (3 faltas sem justificativa geram alerta!)
  { id: "ag_f1", alunoId: "aluno_3", alunoNome: "Carlos Eduardo Nogueira", data: "2026-06-18", horario: "20:00", duracao: 60, tipo: "Presencial", status: "Falta Sem Justificativa", justificativa: "" },
  { id: "ag_f2", alunoId: "aluno_3", alunoNome: "Carlos Eduardo Nogueira", data: "2026-06-25", horario: "20:00", duracao: 60, tipo: "Presencial", status: "Falta Sem Justificativa", justificativa: "" },
  { id: "ag_f3", alunoId: "aluno_3", alunoNome: "Carlos Eduardo Nogueira", data: "2026-07-02", horario: "20:00", duracao: 60, tipo: "Presencial", status: "Falta Sem Justificativa", justificativa: "" } // 3 faltas em 30 dias! Carlos gera alerta de evasão!
];

// 10. Vídeos Enviados por Aluno
export const VIDEOS_PADRAO: VideoTreino[] = [
  { id: "vid_1", titulo: "Execução Correta do Agachamento Livre", descricao: "Tutorial detalhado focado no alinhamento da coluna e quadril.", duracao: "3:45", dataEnvio: "2026-03-12", alunoId: "todos", url: "https://www.w3schools.com/html/mov_bbb.mp4", tipo: "exercicio_padrao", assistido: true },
  { id: "vid_2", titulo: "Correção de Postura no Supino - Lucas", descricao: "Análise de vídeo enviado pelo Lucas para evitar dores no ombro.", duracao: "1:20", dataEnvio: "2026-06-22", alunoId: "aluno_1", url: "https://www.w3schools.com/html/movie.mp4", tipo: "correcao_personalizada", assistido: false },
  { id: "vid_3", titulo: "Feedback de Movimento na Passada - Bia", descricao: "Como manter o alinhamento do joelho durante a passada em deslocamento.", duracao: "2:05", dataEnvio: "2026-06-02", alunoId: "aluno_2", url: "https://www.w3schools.com/html/mov_bbb.mp4", tipo: "correcao_personalizada", assistido: true }
];

// 11. Mensagens / Chats Iniciais
export const CHATS_PADRAO: Mensagem[] = [
  // Conversa com Lucas
  { id: "msg_1", remetenteId: "aluno_1", destinatarioId: "personal", texto: "Professor, meu joelho direito não doeu nada hoje no agachamento!", data: "2026-07-10T19:40:00Z", tipo: "texto" },
  { id: "msg_2", remetenteId: "personal", destinatarioId: "aluno_1", texto: "Maravilhoso Lucas! Isso mostra que sua ativação de glúteo e a retração estão protegendo a articulação. Mantenha essa técnica!", data: "2026-07-10T19:45:00Z", tipo: "texto" },
  { id: "msg_3", remetenteId: "aluno_1", destinatarioId: "personal", texto: "Vou manter sim. O treino novo está ótimo.", data: "2026-07-10T19:50:00Z", tipo: "texto" },
  
  // Conversa com Bia
  { id: "msg_4", remetenteId: "aluno_2", destinatarioId: "personal", texto: "Oi prof! Consegui cumprir toda a meta de água ontem (3 litros).", data: "2026-07-09T10:00:00Z", tipo: "texto" },
  { id: "msg_5", remetenteId: "personal", destinatarioId: "aluno_2", texto: "Show de bola Bia! A hidratação acelera o metabolismo e reduz a retenção. Continue firme!", data: "2026-07-09T10:15:00Z", tipo: "texto" },

  // Conversa com Carlos
  { id: "msg_6", remetenteId: "personal", destinatarioId: "aluno_3", texto: "Carlos, notei sua ausência nas últimas sessões de treino. Está tudo bem por aí?", data: "2026-07-05T14:00:00Z", tipo: "texto" },
  { id: "msg_7", remetenteId: "aluno_3", destinatarioId: "personal", texto: "Olá professor, estou com uma rotina pesada no banco e o joelho voltou a incomodar um pouco. Mas pretendo voltar na semana que vem.", data: "2026-07-05T16:30:00Z", tipo: "texto" }
];

// 12. Check-Ins recentes feitos pelos alunos
export const CHECK_INS_PADRAO: CheckInTreino[] = [
  { id: "ch_1", alunoId: "aluno_1", treinoId: "A", data: "2026-07-08", duracaoMinutos: 52, sensacaoPosTreino: 9, cargasRegistradas: { "Supino Reto com Barra": "25kg/lado", "Tríceps Corda": "20kg" }, observacoes: "Senti o peitoral queimar muito. Ótima sensação." },
  { id: "ch_2", alunoId: "aluno_1", treinoId: "B", data: "2026-07-09", duracaoMinutos: 48, sensacaoPosTreino: 8, cargasRegistradas: { "Agachamento Livre": "20kg/lado", "Stiff com Halteres": "16kg" }, observacoes: "Joelho 100% sem dor hoje." },
  { id: "ch_3", alunoId: "aluno_2", treinoId: "A", data: "2026-07-10", duracaoMinutos: 45, sensacaoPosTreino: 10, cargasRegistradas: { "Agachamento": "12kg total", "Passadas": "6kg/halter" }, observacoes: "Treino foi bem cansativo, mas cumpri as repetições." }
];

// 13. Configurações de Fábrica do Personal Trainer
export const PERSONAL_CONFIG_DEFAULT: PersonalTrainerConfig = {
  nome: "Felipe",
  cref: "012345-G/SP",
  especializacoes: ["Fisiologia do Exercício", "Biomecânica", "Reabilitação de Lesões", "Hipertrofia e Emagrecimento"],
  fotoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=150&auto=format&fit=crop",
  corPrimaria: "#22c55e", // Verde Energia
  corSecundaria: "#1e293b", // Slate
  modoEscuro: true,
  notificacoes: {
    whatsapp: true,
    email: true,
    push: true
  },
  lembretesAutomaticos: true
};

// 14. Fotos de Progresso Padrão
export const FOTOS_PROGRESSO_PADRAO: ProgressPhoto[] = [
  {
    id: "photo_1",
    alunoId: "aluno_1", // Lucas
    data: "2026-03-10",
    legenda: "Início do Acompanhamento (Frente)",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
    categoria: "Frente"
  },
  {
    id: "photo_2",
    alunoId: "aluno_1", // Lucas
    data: "2026-03-10",
    legenda: "Início do Acompanhamento (Lateral)",
    url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop",
    categoria: "Lateral"
  },
  {
    id: "photo_3",
    alunoId: "aluno_1", // Lucas
    data: "2026-05-10",
    legenda: "Evolução 2 Meses (Frente)",
    url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400&auto=format&fit=crop",
    categoria: "Frente"
  },
  {
    id: "photo_4",
    alunoId: "aluno_1", // Lucas
    data: "2026-07-10",
    legenda: "Fase de Definição Atual (Frente)",
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop",
    categoria: "Frente"
  },
  {
    id: "photo_5",
    alunoId: "aluno_1", // Lucas
    data: "2026-07-10",
    legenda: "Fase de Definição Atual (Lateral)",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
    categoria: "Lateral"
  },
  {
    id: "photo_6",
    alunoId: "aluno_2", // Beatriz
    data: "2026-05-15",
    legenda: "Ficha Inicial - Emagrecimento (Frente)",
    url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400&auto=format&fit=crop",
    categoria: "Frente"
  },
  {
    id: "photo_7",
    alunoId: "aluno_2", // Beatriz
    data: "2026-06-15",
    legenda: "Evolução 1 Mês (Frente)",
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop",
    categoria: "Frente"
  }
];
