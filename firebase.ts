import { jsPDF } from "jspdf";
import { Aluno, Anamnese, ProgramaTreinos, AvaliacaoFisica } from "../types";

export function generateStudentReportPDF(
  student: Aluno,
  anamnese: Anamnese | undefined,
  activeWorkout: ProgramaTreinos | undefined,
  assessments: AvaliacaoFisica[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let y = 15;
  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Helper to safely add text and handle page overflow
  const addText = (text: string, x: number, height: number, options: { fontStyle?: string; fontSize?: number; color?: [number, number, number] } = {}) => {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      drawPageFooter(doc.getNumberOfPages());
      y = margin + 10;
    }
    
    if (options.fontSize) doc.setFontSize(options.fontSize);
    if (options.fontStyle) doc.setFont("helvetica", options.fontStyle);
    else doc.setFont("helvetica", "normal");
    
    if (options.color) {
      doc.setTextColor(options.color[0], options.color[1], options.color[2]);
    } else {
      doc.setTextColor(39, 39, 42); // slate-800 default
    }

    doc.text(text, x, y);
    y += height;
  };

  const drawPageFooter = (pageNum: number) => {
    const originalSize = doc.getFontSize();
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(113, 113, 122); // zinc-500
    doc.text(`Relatório de Evolução Corporal - Gerado em ${new Date().toLocaleDateString("pt-BR")} | Página ${pageNum}`, margin, pageHeight - 8);
    // Restoration
    doc.setFont("helvetica", "normal");
    doc.setFontSize(originalSize);
  };

  const drawDivider = () => {
    if (y + 4 > pageHeight - margin) {
      doc.addPage();
      drawPageFooter(doc.getNumberOfPages());
      y = margin + 10;
    }
    doc.setDrawColor(228, 228, 231); // zinc-200
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  const drawHeaderBanner = () => {
    // Elegant deep slate/emerald block for title
    doc.setFillColor(24, 24, 27); // zinc-900
    doc.rect(margin, y, contentWidth, 24, "F");
    
    // Emerald color strip
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(margin, y + 23, contentWidth, 1, "F");

    // Title text inside banner
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("PRONTUÁRIO DE EVOLUÇÃO E TREINO", margin + 6, y + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129); // emerald-400
    doc.text("SISTEMA DE ACOMPANHAMENTO PERSONALIZADO", margin + 6, y + 17);

    // Right-aligned branding text
    doc.setTextColor(161, 161, 170); // zinc-400
    doc.setFontSize(8);
    doc.text("PLATAFORMA DIGITAL PERSONAL", pageWidth - margin - 6, y + 10, { align: "right" });
    
    y += 30;
  };

  // --- BEGIN DOCUMENT GENERATION ---
  
  // 1. Initial Header
  drawHeaderBanner();

  // 2. Student Profile Section
  addText("1. PERFIL DO ALUNO", margin, 6, { fontSize: 11, fontStyle: "bold", color: [16, 185, 129] });
  
  const colWidth = contentWidth / 2;
  const startProfileY = y;
  
  // Column 1: Info Cadastral
  addText(`Nome Completo: ${student.nome}`, margin + 2, 5, { fontSize: 9, fontStyle: "bold" });
  addText(`E-mail: ${student.email}`, margin + 2, 5, { fontSize: 9 });
  addText(`Telefone: ${student.telefone || "Não informado"}`, margin + 2, 5, { fontSize: 9 });
  addText(`Status da Matrícula: ${student.status.toUpperCase()}`, margin + 2, 5, { fontSize: 9, fontStyle: "bold" });

  const endCol1Y = y;
  y = startProfileY;

  // Column 2: Objective & Experience (from anamnese)
  if (anamnese) {
    addText(`Objetivo Principal: ${anamnese.objetivoPrincipal.toUpperCase()}`, margin + colWidth, 5, { fontSize: 9, fontStyle: "bold", color: [16, 185, 129] });
    addText(`Experiência: ${anamnese.experienciaMusculacao.toUpperCase()}`, margin + colWidth, 5, { fontSize: 9 });
    addText(`Condições Clínicas: ${anamnese.condicoesMedicas.join(", ") || "Nenhuma relatada"}`, margin + colWidth, 5, { fontSize: 9 });
    addText(`Restrições/Lesões: ${anamnese.lesoes || "Nenhuma relatada"}`, margin + colWidth, 5, { fontSize: 9, color: [220, 38, 38] });
  } else {
    addText("Anamnese: Não preenchida pelo aluno.", margin + colWidth, 5, { fontSize: 9, fontStyle: "italic", color: [113, 113, 122] });
  }
  
  const endCol2Y = y;
  // Choose the lower Y value to resume layout safely
  y = Math.max(endCol1Y, endCol2Y) + 6;

  drawDivider();

  // 3. Active Workout Program Section
  addText("2. PROGRAMA DE TREINOS ATIVO", margin, 6, { fontSize: 11, fontStyle: "bold", color: [16, 185, 129] });

  if (activeWorkout) {
    addText(`Título do Programa: ${activeWorkout.titulo}`, margin + 2, 5, { fontSize: 9, fontStyle: "bold" });
    addText(`Estrutura de Divisão: ${activeWorkout.divisao}  |  Vigência: de ${new Date(activeWorkout.dataInicio + "T00:00:00").toLocaleDateString("pt-BR")} até ${new Date(activeWorkout.dataTermino + "T00:00:00").toLocaleDateString("pt-BR")}`, margin + 2, 5, { fontSize: 9 });
    if (activeWorkout.notasMotivacionais) {
      addText(`Mensagem do Coach: "${activeWorkout.notasMotivacionais}"`, margin + 2, 6, { fontSize: 8.5, fontStyle: "italic", color: [113, 113, 122] });
    }
    y += 2;

    // Render each workout division
    for (const treino of activeWorkout.treinos) {
      if (y + 35 > pageHeight - margin) {
        doc.addPage();
        drawPageFooter(doc.getNumberOfPages());
        y = margin + 10;
      }

      // Title header for individual training division (A, B, C...)
      doc.setFillColor(244, 244, 245); // zinc-100
      doc.rect(margin, y, contentWidth, 7, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(24, 24, 27); // zinc-900
      doc.text(`Treino ${treino.id} - ${treino.titulo} (Foco: ${treino.foco})`, margin + 3, y + 5);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text(`Duração estimada: ${treino.duracaoEstimada}`, pageWidth - margin - 3, y + 5, { align: "right" });
      y += 9;

      // Table Header of Exercises
      doc.setFillColor(63, 63, 70); // zinc-700
      doc.rect(margin, y, contentWidth, 5.5, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("Exercício / Grupo Muscular", margin + 2, y + 4);
      doc.text("Séries", margin + 65, y + 4);
      doc.text("Reps", margin + 82, y + 4);
      doc.text("Carga", margin + 98, y + 4);
      doc.text("Descanso", margin + 118, y + 4);
      doc.text("Método & Dica Técnica de Execução", margin + 135, y + 4);
      y += 5.5;

      // Exercise Rows
      if (treino.exercicios.length === 0) {
        addText("Sem exercícios cadastrados para este bloco.", margin + 4, 5, { fontSize: 8, fontStyle: "italic", color: [113, 113, 122] });
      } else {
        treino.exercicios.forEach((ex, idx) => {
          if (y + 12 > pageHeight - margin) {
            doc.addPage();
            drawPageFooter(doc.getNumberOfPages());
            y = margin + 10;
            
            // Re-draw simple table headers on new page
            doc.setFillColor(63, 63, 70); // zinc-700
            doc.rect(margin, y, contentWidth, 5.5, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(255, 255, 255);
            doc.text("Exercício / Grupo Muscular", margin + 2, y + 4);
            doc.text("Séries", margin + 65, y + 4);
            doc.text("Reps", margin + 82, y + 4);
            doc.text("Carga", margin + 98, y + 4);
            doc.text("Descanso", margin + 118, y + 4);
            doc.text("Método & Dica Técnica de Execução", margin + 135, y + 4);
            y += 5.5;
          }

          // Row Alternating background color
          if (idx % 2 === 1) {
            doc.setFillColor(250, 250, 250); // very light grey
            doc.rect(margin, y, contentWidth, 9, "F");
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(24, 24, 27);
          
          // Truncate name if too long
          const exName = ex.nome.length > 32 ? ex.nome.substring(0, 30) + "..." : ex.nome;
          doc.text(exName, margin + 2, y + 4.5);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(113, 113, 122);
          doc.text(ex.grupoMuscular, margin + 2, y + 7.5);

          doc.setFontSize(7.5);
          doc.setTextColor(39, 39, 42);
          doc.text(ex.series, margin + 65, y + 5);
          doc.text(ex.repeticoes, margin + 82, y + 5);
          doc.text(ex.cargaSugerida || "---", margin + 98, y + 5);
          doc.text(ex.descanso || "---", margin + 118, y + 5);

          // Render execution tip & method
          const fullTip = [
            ex.metodo ? `[${ex.metodo}]` : "",
            ex.dicaExecucao
          ].filter(Boolean).join(" ");
          
          const maxTipLen = 35;
          const formattedTip = fullTip.length > maxTipLen ? fullTip.substring(0, maxTipLen - 3) + "..." : fullTip;
          doc.setFontSize(7);
          doc.setTextColor(82, 82, 91); // zinc-600
          doc.text(formattedTip || "Execução padrão supervisionada.", margin + 135, y + 5);

          // Bottom thin separator line
          doc.setDrawColor(244, 244, 245); // zinc-100
          doc.setLineWidth(0.1);
          doc.line(margin, y + 9, pageWidth - margin, y + 9);
          y += 9;
        });
      }
      y += 4; // Spacing after a division block
    }
  } else {
    addText("Nenhum programa de musculação ativo associado ao prontuário deste aluno.", margin + 2, 5, { fontSize: 8.5, fontStyle: "italic", color: [113, 113, 122] });
  }

  y += 4;
  drawDivider();

  // 4. Physical Evaluation History Section
  addText("3. HISTÓRICO DE EVOLUÇÃO CORPORAL E BIOPRESENCIAL", margin, 6, { fontSize: 11, fontStyle: "bold", color: [16, 185, 129] });

  if (assessments.length > 0) {
    const sortedAssessments = [...assessments].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    
    // Summary evolution indicators text
    const first = sortedAssessments[0];
    const last = sortedAssessments[sortedAssessments.length - 1];
    const diffWeight = last.peso - first.peso;
    const diffFat = last.percentualGordura - first.percentualGordura;
    
    let evoPhrase = `Acompanhamento de ${sortedAssessments.length} avaliações físicas. `;
    if (diffWeight !== 0) {
      evoPhrase += `Variação ponderal líquida total: ${diffWeight > 0 ? "+" : ""}${diffWeight.toFixed(1)} kg. `;
    }
    if (diffFat !== 0) {
      evoPhrase += `Variação de adiposidade estimada: ${diffFat > 0 ? "+" : ""}${diffFat.toFixed(1)}%.`;
    }
    
    addText(evoPhrase, margin + 2, 6, { fontSize: 8.5, fontStyle: "bold", color: [39, 39, 42] });
    y += 2;

    if (y + 25 > pageHeight - margin) {
      doc.addPage();
      drawPageFooter(doc.getNumberOfPages());
      y = margin + 10;
    }

    // Historical Table Header
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(margin, y, contentWidth, 5.5, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text("Data", margin + 2, y + 4);
    doc.text("Peso (kg)", margin + 25, y + 4);
    doc.text("Altura (cm)", margin + 45, y + 4);
    doc.text("IMC (kg/m²)", margin + 68, y + 4);
    doc.text("Gordura %", margin + 92, y + 4);
    doc.text("Massa Magra", margin + 115, y + 4);
    doc.text("Cintura", margin + 138, y + 4);
    doc.text("Quadril", margin + 155, y + 4);
    doc.text("Braço D/E", margin + 172, y + 4);
    y += 5.5;

    // Table Rows
    sortedAssessments.forEach((av, idx) => {
      if (y + 8 > pageHeight - margin) {
        doc.addPage();
        drawPageFooter(doc.getNumberOfPages());
        y = margin + 10;
        
        // Re-draw table header
        doc.setFillColor(16, 185, 129); // emerald-500
        doc.rect(margin, y, contentWidth, 5.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text("Data", margin + 2, y + 4);
        doc.text("Peso (kg)", margin + 25, y + 4);
        doc.text("Altura (cm)", margin + 45, y + 4);
        doc.text("IMC (kg/m²)", margin + 68, y + 4);
        doc.text("Gordura %", margin + 92, y + 4);
        doc.text("Massa Magra", margin + 115, y + 4);
        doc.text("Cintura", margin + 138, y + 4);
        doc.text("Quadril", margin + 155, y + 4);
        doc.text("Braço D/E", margin + 172, y + 4);
        y += 5.5;
      }

      // Alternating row color
      if (idx % 2 === 1) {
        doc.setFillColor(244, 244, 245); // zinc-100
        doc.rect(margin, y, contentWidth, 6.5, "F");
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(39, 39, 42);

      const parsedDate = new Date(av.data + "T00:00:00").toLocaleDateString("pt-BR");
      doc.text(parsedDate, margin + 2, y + 4.5);
      
      doc.setFont("helvetica", "bold");
      doc.text(`${av.peso} kg`, margin + 25, y + 4.5);
      doc.setFont("helvetica", "normal");
      doc.text(`${av.altura} cm`, margin + 45, y + 4.5);
      doc.text(av.imc.toFixed(1), margin + 68, y + 4.5);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129); // emerald accent for body fat
      doc.text(`${av.percentualGordura}%`, margin + 92, y + 4.5);
      
      doc.setTextColor(39, 39, 42);
      doc.setFont("helvetica", "normal");
      doc.text(`${av.massaMagra.toFixed(1)} kg`, margin + 115, y + 4.5);
      doc.text(`${av.medidas.cintura} cm`, margin + 138, y + 4.5);
      doc.text(`${av.medidas.quadril} cm`, margin + 155, y + 4.5);
      doc.text(`${av.medidas.braçoDireito}/${av.medidas.braçoEsquerdo} cm`, margin + 172, y + 4.5);

      // Border line
      doc.setDrawColor(228, 228, 231); // zinc-200
      doc.setLineWidth(0.1);
      doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);
      y += 6.5;
    });

  } else {
    addText("Nenhuma avaliação antropométrica registrada até o momento no prontuário.", margin + 2, 5, { fontSize: 8.5, fontStyle: "italic", color: [113, 113, 122] });
  }

  y += 6;
  if (y + 25 > pageHeight - margin) {
    doc.addPage();
    drawPageFooter(doc.getNumberOfPages());
    y = margin + 10;
  }

  // Draw Coach Signature area
  y += 4;
  doc.setDrawColor(161, 161, 170); // zinc-400
  doc.setLineWidth(0.3);
  doc.line(margin + 5, y, margin + 75, y);
  doc.line(pageWidth - margin - 75, y, pageWidth - margin - 5, y);
  
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(63, 63, 70);
  doc.text("Assinatura do Coach / Personal", margin + 40, y + 4, { align: "center" });
  doc.text("Assinatura do Aluno", pageWidth - margin - 40, y + 4, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(113, 113, 122);
  doc.text("Documento emitido digitalmente pela plataforma Personal Coach.", pageWidth / 2, y + 10, { align: "center" });

  // Final draw page numbers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(i);
  }

  // Save the PDF locally on student name
  const safeName = student.nome.toLowerCase().replace(/[^a-z0-9]/g, "_");
  doc.save(`relatorio_${safeName}.pdf`);
}
