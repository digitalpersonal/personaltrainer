import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to generate custom workout using server-side Gemini API
  app.post("/api/generate-workout", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY_MISSING",
          message: "A chave API do Gemini não foi encontrada no servidor. Configure-a em Configurações > Secrets."
        });
      }

      const { anamnese, division, notes } = req.body;
      if (!anamnese) {
        return res.status(400).json({ error: "Anamnese é necessária para gerar o treino." });
      }

      // Lazy initialization of GoogleGenAI
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
Você é um Personal Trainer profissional de alto nível. Com base na anamnese abaixo, gere um programa de treinos personalizado e estruturado na divisão ${division || "A/B"}.
Notas/instruções extras: ${notes || "Nenhuma"}

DADOS DA ANAMNESE:
- Objetivo Principal: ${anamnese.objetivoPrincipal || "Hipertrofia/Condicionamento"}
- Experiência: ${anamnese.experiencia || "Intermediário"}
- Restrições Médicas/Lesões: ${anamnese.lesoes || "Nenhuma"}
- Frequência Semanal Desejada: ${anamnese.disponibilidade || "3-4 vezes na semana"}
- Nível de Estresse: ${anamnese.estresse || "5"}
- Peso Atual: ${anamnese.pesoAtual || "75"} kg, Altura: ${anamnese.altura || "175"} cm

Por favor, gere uma divisão de treinos adequada. Cada treino na divisão deve ter um nome de identificação (ex: "Treino A - Membros Superiores"), foco do dia, e de 4 a 6 exercícios.
Para cada exercício, especifique:
1. Nome do exercício (em português de preferência)
2. Grupo muscular
3. Séries (ex: "4")
4. Repetições (ex: "10 a 12")
5. Tempo de descanso (ex: "60 segundos" ou "90 segundos")
6. Carga sugerida (ex: "Carga moderada a pesada", "Carga leve")
7. Método (ex: "Pirâmide", "Drop-set", "Rest-pause" ou "Direto")
8. Dica de execução curta e segurança.

Responda rigorosamente no formato JSON de acordo com o esquema solicitado.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              divisao: {
                type: Type.STRING,
                description: "Divisão do treino gerado (ex: A/B, A/B/C)"
              },
              focoGeral: {
                type: Type.STRING,
                description: "Foco principal do programa com base no objetivo"
              },
              observacoesGerais: {
                type: Type.STRING,
                description: "Mensagem motivacional ou observações de segurança do Personal Trainer"
              },
              treinos: {
                type: Type.ARRAY,
                description: "Lista de treinos na divisão",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Identificador (ex: A, B, C)" },
                    titulo: { type: Type.STRING, description: "Título do treino (ex: Treino A - Peito e Tríceps)" },
                    foco: { type: Type.STRING, description: "Foco do treino" },
                    duracaoEstimada: { type: Type.STRING, description: "Duração estimada em minutos (ex: '50-60 min')" },
                    exercicios: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          nome: { type: Type.STRING },
                          grupoMuscular: { type: Type.STRING },
                          series: { type: Type.STRING },
                          repeticoes: { type: Type.STRING },
                          descanso: { type: Type.STRING },
                          cargaSugerida: { type: Type.STRING },
                          metodo: { type: Type.STRING },
                          dicaExecucao: { type: Type.STRING }
                        },
                        required: ["nome", "grupoMuscular", "series", "repeticoes", "descanso", "cargaSugerida", "metodo", "dicaExecucao"]
                      }
                    }
                  },
                  required: ["id", "titulo", "foco", "duracaoEstimada", "exercicios"]
                }
              }
            },
            required: ["divisao", "focoGeral", "observacoesGerais", "treinos"]
          }
        }
      });

      const responseText = response.text || "{}";
      const workoutPlan = JSON.parse(responseText.trim());
      res.json(workoutPlan);

    } catch (error: any) {
      console.error("Erro ao gerar treino com Gemini:", error);
      res.status(500).json({
        error: "GEMINI_ERROR",
        message: "Ocorreu um erro ao comunicar com a inteligência artificial do Gemini.",
        details: error.message
      });
    }
  });

  // API Route for health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for any remaining requests (SPA fallback)
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
