import React, { useState, useRef } from "react";
import { Film, Trash2, Video, AlertCircle, RefreshCw, Play, Zap, VolumeX, Volume2 } from "lucide-react";
import { compressVideo, formatBytes } from "../utils/compression";

interface VideoUploadWidgetProps {
  videoUrl?: string;
  videoFileName?: string;
  onVideoUploaded: (url: string, fileName: string) => void;
  onVideoRemoved: () => void;
}

export default function VideoUploadWidget({
  videoUrl,
  videoFileName,
  onVideoUploaded,
  onVideoRemoved
}: VideoUploadWidgetProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compression config and stats states
  const [compressWithMute, setCompressWithMute] = useState(true);
  const [compressionPercent, setCompressionPercent] = useState<number | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    original: number;
    compressed: number;
    percent: number;
  } | null>(null);

  const processFile = async (file: File) => {
    setErrorMsg("");
    setCompressionStats(null);
    setCompressionPercent(0);

    // 1. Validate format
    if (!file.type.startsWith("video/")) {
      setErrorMsg("Formato inválido! Por favor, selecione apenas arquivos de vídeo (MP4, MOV, WEBM, etc.).");
      return;
    }

    // 2. Validate size (100MB = 100 * 1024 * 1024 bytes)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMsg(`Arquivo muito grande! O limite de tamanho é de 100MB (seu arquivo possui ${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    setIsReading(true);

    try {
      // Compress video to 480p width/height, 600kbps bitrate, and optional audio stripping
      const result = await compressVideo(
        file,
        (percent) => {
          setCompressionPercent(percent);
        },
        {
          maxWidth: 480,
          maxHeight: 480,
          mute: compressWithMute,
          targetBitrate: 600000 // 600 kbps
        }
      );

      onVideoUploaded(result.dataUrl, file.name);
      setCompressionStats({
        original: result.originalSize,
        compressed: result.compressedSize,
        percent: result.savingsPercentage
      });
    } catch (err) {
      console.error("Erro ao comprimir vídeo, usando original como fallback:", err);
      // Fallback standard reader if browser media recording API triggers an issue
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          onVideoUploaded(e.target.result, file.name);
        } else {
          setErrorMsg("Falha ao processar o arquivo de vídeo.");
        }
      };
      reader.onerror = () => {
        setErrorMsg("Erro ao ler o arquivo de vídeo original.");
      };
      reader.readAsDataURL(file);
    } finally {
      setIsReading(false);
      setCompressionPercent(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center gap-1">
          <Video className="w-3.5 h-3.5 text-zinc-400" /> Vídeo Demonstrativo Individual
        </label>
        {videoUrl ? (
          <button
            type="button"
            onClick={() => {
              onVideoRemoved();
              setCompressionStats(null);
            }}
            className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors cursor-pointer animate-fade-in"
          >
            <Trash2 className="w-3 h-3" /> Remover Vídeo
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[9px] animate-fade-in">
            <span className="text-zinc-500 font-bold uppercase mr-1">Otimização:</span>
            <button
              type="button"
              onClick={() => setCompressWithMute(!compressWithMute)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-extrabold transition-all cursor-pointer ${
                compressWithMute
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-zinc-950 text-zinc-500 border-zinc-800"
              }`}
              title="Remover áudio do vídeo para máxima economia de dados"
            >
              {compressWithMute ? <VolumeX className="w-3 h-3 text-emerald-400" /> : <Volume2 className="w-3 h-3 text-zinc-600" />}
              {compressWithMute ? "Mudo (Máxima econ.)" : "Com Áudio"}
            </button>
          </div>
        )}
      </div>

      {videoUrl ? (
        <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 space-y-2 animate-fade-in">
          {/* Active Preview */}
          <div className="relative aspect-video w-full max-w-sm mx-auto bg-black rounded-lg overflow-hidden border border-zinc-900 group">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
            />
            <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[9px] font-bold text-emerald-400 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-emerald-400" /> Prévia Ativa
            </div>
          </div>
          <div className="text-center space-y-2">
            <span className="text-[10px] text-zinc-400 truncate max-w-xs block mx-auto font-mono">
              📂 {videoFileName || "video_demonstrativo.mp4"}
            </span>
            {compressionStats && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 flex items-center justify-center gap-2 max-w-sm mx-auto">
                <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />
                <div className="text-left leading-tight">
                  <span className="text-[9px] font-black text-emerald-400 block uppercase">Vídeo Compactado com Sucesso!</span>
                  <span className="text-[8px] text-zinc-400 font-mono block">
                    Tamanho: {formatBytes(compressionStats.original)} → <strong className="text-white">{formatBytes(compressionStats.compressed)}</strong> (Redução de {compressionStats.percent}%)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerInputClick}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
            isDragActive
              ? "border-emerald-500 bg-emerald-500/5"
              : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {isReading ? (
            <div className="flex flex-col items-center space-y-2 py-2">
              <div className="relative">
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                <Zap className="w-3.5 h-3.5 text-emerald-400 absolute inset-0 m-auto" />
              </div>
              <p className="text-[11px] text-emerald-400 font-bold animate-pulse">
                Comprimindo vídeo... {compressionPercent !== null && compressionPercent > 0 ? `(${compressionPercent}%)` : ""}
              </p>
              <p className="text-[9px] text-zinc-500">Otimizando resolução de frames e bitrate</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-zinc-300">
                <Film className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-300">
                  Arrastar e soltar arquivo de vídeo ou <span className="text-emerald-400 underline">clicar para buscar</span>
                </p>
                <p className="text-[9px] text-zinc-500 mt-1 font-medium">
                  Limitação de 100MB • Compactação de alta eficiência ativada
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/20 border border-red-900/50 p-2.5 rounded-lg flex items-center gap-2 text-[10px] text-red-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
