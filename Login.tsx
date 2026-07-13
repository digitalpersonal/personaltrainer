import React, { useState, useRef } from "react";
import { ProgressPhoto, Aluno } from "../types";
import { Camera, Calendar, Trash2, Sparkles, Upload, Plus, Eye, Image, Info, ArrowLeftRight, Check, X, Zap } from "lucide-react";
import { compressImage, formatBytes } from "../utils/compression";

interface ProgressPhotoGalleryProps {
  aluno: Aluno;
  photos: ProgressPhoto[];
  onAddPhoto: (photo: ProgressPhoto) => void;
  onDeletePhoto: (photoId: string) => void;
  isTrainer: boolean;
}

export default function ProgressPhotoGallery({
  aluno,
  photos,
  onAddPhoto,
  onDeletePhoto,
  isTrainer
}: ProgressPhotoGalleryProps) {
  // Filter photos to only those belonging to the current student
  const studentPhotos = photos
    .filter((p) => p.alunoId === aluno.id)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Component States
  const [activeCategory, setActiveCategory] = useState<"Todos" | "Frente" | "Lateral" | "Costas" | "Livre">("Todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<ProgressPhoto | null>(null);

  // Form states for uploading
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split("T")[0]);
  const [uploadCategory, setUploadCategory] = useState<"Frente" | "Lateral" | "Costas" | "Livre">("Frente");
  const [uploadLegend, setUploadLegend] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Compression UI states
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    original: number;
    compressed: number;
    percent: number;
  } | null>(null);

  // Before & After comparison states
  const [beforePhotoId, setBeforePhotoId] = useState<string>("");
  const [afterPhotoId, setAfterPhotoId] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill comparison default values when studentPhotos list updates
  React.useEffect(() => {
    if (studentPhotos.length >= 2) {
      // Set the oldest as "before" and the newest as "after"
      setBeforePhotoId(studentPhotos[studentPhotos.length - 1].id);
      setAfterPhotoId(studentPhotos[0].id);
    } else {
      setBeforePhotoId("");
      setAfterPhotoId("");
    }
  }, [aluno.id, studentPhotos.length]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    setIsCompressing(true);
    setCompressionStats(null);

    try {
      // Compress to maximum 800x800 resolution at 60% JPEG quality
      const result = await compressImage(file, 800, 800, 0.6);
      setUploadUrl(result.dataUrl);
      setCompressionStats({
        original: result.originalSize,
        compressed: result.compressedSize,
        percent: result.savingsPercentage
      });
    } catch (err) {
      console.error("Erro ao comprimir imagem, usando original:", err);
      // Fallback to standard reader if compression fails
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) {
      alert("Por favor, selecione ou envie uma foto de progresso.");
      return;
    }

    const defaultLegenda = uploadLegend.trim() || `${uploadCategory} - ${new Date(uploadDate + "T00:00:00").toLocaleDateString("pt-BR")}`;

    const newPhoto: ProgressPhoto = {
      id: "photo_" + Math.random().toString(36).substring(2, 11),
      alunoId: aluno.id,
      data: uploadDate,
      legenda: defaultLegenda,
      url: uploadUrl,
      categoria: uploadCategory
    };

    onAddPhoto(newPhoto);
    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setUploadDate(new Date().toISOString().split("T")[0]);
    setUploadCategory("Frente");
    setUploadLegend("");
    setUploadUrl("");
    setCompressionStats(null);
  };

  const filteredPhotos = activeCategory === "Todos" 
    ? studentPhotos 
    : studentPhotos.filter(p => p.categoria === activeCategory);

  const beforePhoto = studentPhotos.find(p => p.id === beforePhotoId);
  const afterPhoto = studentPhotos.find(p => p.id === afterPhotoId);

  // Preset stock models to simulate photo updates easily if the user doesn't have real files
  const selectPresetMock = (presetNum: number) => {
    const presets = [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop", // Male workout front
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop", // Male athlete post
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400&auto=format&fit=crop", // Female workout
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop"  // Male flex back
    ];
    setUploadUrl(presets[presetNum]);
  };

  return (
    <div id="progress-photo-gallery-module" className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-4.5 space-y-5">
      
      {/* Module Title Header */}
      <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
        <div className="flex items-center gap-2.5">
          <Camera id="gallery-camera-icon" className="w-4.5 h-4.5 text-emerald-400" />
          <div>
            <h4 className="text-xs font-black text-zinc-200 uppercase tracking-wider">Galeria de Fotos de Progresso</h4>
            <p className="text-[10px] text-zinc-500 font-medium">Arquive e compare registros visuais do aluno por data</p>
          </div>
        </div>

        <button
          id="gallery-add-photo-btn"
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Registrar Foto
        </button>
      </div>

      {/* Before & After Comparator Block */}
      {studentPhotos.length >= 2 && (
        <div id="gallery-comparator-panel" className="bg-zinc-900/60 rounded-xl border border-zinc-800 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h5 className="text-[11px] font-extrabold text-zinc-300 uppercase tracking-wider">Comparador Antes & Depois</h5>
            </div>
            
            <button
              id="toggle-comparison-btn"
              type="button"
              onClick={() => setIsComparing(!isComparing)}
              className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${
                isComparing 
                  ? "bg-emerald-500 text-black font-black shadow-lg" 
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> 
              {isComparing ? "Modo Ativo" : "Ativar Comparação"}
            </button>
          </div>

          {/* Selectors for comparison */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label htmlFor="compare-before-select" className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide block">Foto &quot;Antes&quot;</label>
              <select
                id="compare-before-select"
                value={beforePhotoId}
                onChange={(e) => setBeforePhotoId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 font-medium focus:outline-none focus:border-emerald-500"
              >
                {studentPhotos.map(p => (
                  <option key={p.id} value={p.id}>
                    {new Date(p.data + "T00:00:00").toLocaleDateString("pt-BR")} - {p.legenda}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="compare-after-select" className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide block">Foto &quot;Depois&quot;</label>
              <select
                id="compare-after-select"
                value={afterPhotoId}
                onChange={(e) => setAfterPhotoId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 font-medium focus:outline-none focus:border-emerald-500"
              >
                {studentPhotos.map(p => (
                  <option key={p.id} value={p.id}>
                    {new Date(p.data + "T00:00:00").toLocaleDateString("pt-BR")} - {p.legenda}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparative visual layout */}
          {isComparing && beforePhoto && afterPhoto && (
            <div id="comparison-display-stage" className="grid grid-cols-2 gap-3 mt-1 pt-1 border-t border-zinc-850/40">
              
              {/* Before card */}
              <div id="before-stage-card" className="relative rounded-xl overflow-hidden aspect-[4/5] bg-zinc-950 border border-zinc-850">
                <img
                  src={beforePhoto.url}
                  alt={beforePhoto.legenda}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-lg">
                  Antes
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent p-2 text-center">
                  <span className="text-[10px] text-white font-extrabold block truncate">{beforePhoto.legenda}</span>
                  <span className="text-[8px] text-zinc-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5 text-zinc-500" /> {new Date(beforePhoto.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* After card */}
              <div id="after-stage-card" className="relative rounded-xl overflow-hidden aspect-[4/5] bg-zinc-950 border border-zinc-850">
                <img
                  src={afterPhoto.url}
                  alt={afterPhoto.legenda}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-emerald-500 text-black font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-lg">
                  Depois
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent p-2 text-center">
                  <span className="text-[10px] text-white font-extrabold block truncate">{afterPhoto.legenda}</span>
                  <span className="text-[8px] text-emerald-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5 text-emerald-500/50" /> {new Date(afterPhoto.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Main photo filter controls */}
      <div id="gallery-filter-rail" className="flex flex-wrap gap-1.5 border-b border-zinc-850 pb-2">
        {(["Todos", "Frente", "Lateral", "Costas", "Livre"] as const).map(cat => (
          <button
            key={cat}
            id={`filter-photo-cat-${cat}`}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-zinc-800 text-white font-black shadow"
                : "bg-zinc-950/50 hover:bg-zinc-900 text-zinc-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid Section */}
      {filteredPhotos.length === 0 ? (
        <div id="empty-photos-alert" className="text-center py-10 border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20 text-zinc-500 text-xs italic flex flex-col items-center justify-center space-y-2">
          <Image className="w-8 h-8 text-zinc-700" />
          <span>Nenhuma foto arquivada {activeCategory !== "Todos" ? `na categoria ${activeCategory}` : ""}.</span>
          <p className="text-[10px] text-zinc-600 max-w-[280px]">Clique em &quot;Registrar Foto&quot; para fazer o upload e iniciar o acompanhamento visual do aluno.</p>
        </div>
      ) : (
        <div id="gallery-photo-grid" className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              id={`photo-card-${photo.id}`}
              className="group bg-zinc-950/80 border border-zinc-850 rounded-xl overflow-hidden flex flex-col relative transition-all duration-300 hover:border-zinc-750 hover:translate-y-[-2px] shadow-sm"
            >
              
              {/* Category Badge overlay */}
              <span className="absolute top-2 left-2 z-10 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-zinc-950/80 text-zinc-300 border border-zinc-800 rounded-md backdrop-blur-sm">
                {photo.categoria}
              </span>

              {/* Image box */}
              <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden cursor-pointer" onClick={() => setFullscreenPhoto(photo)}>
                <img
                  src={photo.url}
                  alt={photo.legenda}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual view overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] text-zinc-200 font-bold">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Ampliar
                  </div>
                </div>
              </div>

              {/* Caption and action panel */}
              <div className="p-2.5 space-y-1 bg-zinc-950 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-zinc-300 block truncate leading-tight">{photo.legenda}</span>
                  <span className="text-[8px] text-zinc-500 font-mono flex items-center gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5" /> {new Date(photo.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className="flex justify-end pt-2 border-t border-zinc-900 mt-1">
                  <button
                    id={`delete-photo-${photo.id}-btn`}
                    type="button"
                    onClick={() => {
                      if (window.confirm("Deseja realmente excluir esta foto de progresso do prontuário?")) {
                        onDeletePhoto(photo.id);
                      }
                    }}
                    className="text-zinc-600 hover:text-red-500 p-1 rounded hover:bg-red-500/10 cursor-pointer transition-colors"
                    title="Excluir do Registro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- MODAL 1: ADD NEW PROGRESS PHOTO --- */}
      {showAddModal && (
        <div id="add-photo-modal-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div id="add-photo-modal-card" className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-left animate-fade-in">
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-zinc-200 uppercase tracking-wider">Novo Registro Visual</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Drag-and-drop or select file box */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wide">Arquivo de Imagem</span>
                
                {uploadUrl ? (
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                      <img
                        src={uploadUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadUrl("");
                          setCompressionStats(null);
                        }}
                        className="absolute top-2 right-2 bg-black/75 hover:bg-red-600 hover:text-white text-zinc-400 p-1.5 rounded-lg border border-zinc-800 transition-all cursor-pointer"
                        title="Remover Foto Selecionada"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {compressionStats && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
                        <div className="text-left leading-tight">
                          <span className="text-[10px] font-black text-emerald-400 block uppercase">Foto Compactada com Sucesso!</span>
                          <span className="text-[9px] text-zinc-400 font-mono">
                            Tamanho: {formatBytes(compressionStats.original)} → <strong className="text-white">{formatBytes(compressionStats.compressed)}</strong> (Redução de {compressionStats.percent}%)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : isCompressing ? (
                  <div className="border-2 border-dashed border-emerald-500/50 rounded-xl p-10 flex flex-col items-center justify-center space-y-2 text-center bg-emerald-500/5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                      <Zap className="w-3.5 h-3.5 text-emerald-400 absolute inset-0 m-auto" />
                    </div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider animate-pulse">Comprimindo Foto...</span>
                    <span className="text-[9px] text-zinc-500">Otimizando dimensões e limpando metadados de espaço</span>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center space-y-2 text-center cursor-pointer transition-all duration-300 ${
                      dragActive 
                        ? "border-emerald-500 bg-emerald-500/5 text-emerald-400" 
                        : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950 text-zinc-500 hover:text-zinc-400"
                    }`}
                  >
                    <Upload className="w-6 h-6" />
                    <div className="text-[11px] leading-tight font-medium">
                      <span className="font-bold text-zinc-300 underline block mb-0.5">Clique para carregar</span>
                      ou arraste a foto do progresso aqui
                    </div>
                    <span className="text-[9px] text-zinc-600 font-mono">PNG, JPG ou JPEG (Compactação automática)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Quick Preset Picker for Demonstration */}
              {!uploadUrl && (
                <div className="space-y-1.5 bg-zinc-950/50 p-2 border border-zinc-850/60 rounded-lg">
                  <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Inserir Demo / Modelo Stock Rápido:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => selectPresetMock(0)}
                      className="flex-1 text-[9px] bg-zinc-900 border border-zinc-800 rounded py-1 px-1.5 hover:border-emerald-500 transition-colors text-zinc-300 font-bold cursor-pointer"
                    >
                      Modelo Masc 1
                    </button>
                    <button
                      type="button"
                      onClick={() => selectPresetMock(1)}
                      className="flex-1 text-[9px] bg-zinc-900 border border-zinc-800 rounded py-1 px-1.5 hover:border-emerald-500 transition-colors text-zinc-300 font-bold cursor-pointer"
                    >
                      Modelo Masc 2
                    </button>
                    <button
                      type="button"
                      onClick={() => selectPresetMock(2)}
                      className="flex-1 text-[9px] bg-zinc-900 border border-zinc-800 rounded py-1 px-1.5 hover:border-emerald-500 transition-colors text-zinc-300 font-bold cursor-pointer"
                    >
                      Modelo Fem 1
                    </button>
                  </div>
                </div>
              )}

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="upload-date-input" className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide block">Data do Registro</label>
                  <input
                    id="upload-date-input"
                    type="date"
                    required
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="upload-category-select" className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide block">Categoria Visual</label>
                  <select
                    id="upload-category-select"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Frente">Frente</option>
                    <option value="Lateral">Lateral</option>
                    <option value="Costas">Costas</option>
                    <option value="Livre">Livre (Outros)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="upload-legend-input" className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide block">Legenda / Fase do Treino</label>
                <input
                  id="upload-legend-input"
                  type="text"
                  placeholder="Ex: Após 4 semanas do programa de hipertrofia"
                  value={uploadLegend}
                  onChange={(e) => setUploadLegend(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Submitting Actions */}
              <div className="flex gap-2.5 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black cursor-pointer transition-colors"
                >
                  Salvar Registro
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: FULLSCREEN PHOTO VIEWER --- */}
      {fullscreenPhoto && (
        <div id="photo-fullscreen-overlay" className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setFullscreenPhoto(null)}>
          <div id="photo-fullscreen-card" className="relative w-full max-w-xl max-h-[85vh] flex flex-col space-y-4 text-center items-center" onClick={(e) => e.stopPropagation()}>
            
            <button
              type="button"
              onClick={() => setFullscreenPhoto(null)}
              className="absolute top-[-30px] right-0 text-zinc-400 hover:text-white font-bold flex items-center gap-1 text-xs cursor-pointer"
            >
              <X className="w-4 h-4" /> Fechar
            </button>

            <div className="w-full h-full aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
              <img
                src={fullscreenPhoto.url}
                alt={fullscreenPhoto.legenda}
                className="max-w-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-left w-full space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-zinc-200">{fullscreenPhoto.legenda}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-zinc-950 text-emerald-400 border border-zinc-800">
                  {fullscreenPhoto.categoria}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono">
                <Calendar className="w-3 h-3" /> Registrada em {new Date(fullscreenPhoto.data + "T00:00:00").toLocaleDateString("pt-BR")}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
