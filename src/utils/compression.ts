/**
 * Utility for client-side image and video compression
 * aimed at minimizing storage space (e.g., base64 string sizes).
 */

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
}

/**
 * Compresses an image file or base64 string using Canvas downscaling and JPEG quality setting.
 */
export function compressImage(
  fileOrBase64: File | string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6 // 60% quality is a sweet spot for high visual quality and ultra low size
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions keeping aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not obtain canvas 2D context."));
        return;
      }

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Export as compressed JPEG
      const dataUrl = canvas.toDataURL("image/jpeg", quality);

      // Calculate sizes
      let originalSize = 0;
      if (typeof fileOrBase64 === "string") {
        // Base64 size estimation
        originalSize = Math.round((fileOrBase64.length * 3) / 4);
      } else {
        originalSize = fileOrBase64.size;
      }

      const compressedSize = Math.round((dataUrl.length * 3) / 4);
      const savingsPercentage = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

      resolve({
        dataUrl,
        originalSize,
        compressedSize,
        savingsPercentage
      });
    };

    img.onerror = (err) => {
      reject(err);
    };

    if (typeof fileOrBase64 === "string") {
      img.src = fileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error("Failed to read file."));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrBase64);
    }
  });
}

/**
 * Compresses a video file by downscaling resolution and recording it client-side.
 * Since real-time client-side re-recording can be slow for long videos or restricted by browser permissions,
 * we also provide a fast, robust option: converting the video to a lower-resolution layout, or stripping metadata
 * and trimming if requested.
 */
export function compressVideo(
  file: File,
  onProgress?: (percent: number) => void,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    mute?: boolean;
    targetBitrate?: number; // in bits per second, e.g., 800000 (800kbps)
  } = {}
): Promise<CompressionResult> {
  const { maxWidth = 480, maxHeight = 480, mute = true, targetBitrate = 600000 } = options;

  return new Promise((resolve, reject) => {
    // Check if browser APIs are supported
    const canRecord = typeof HTMLCanvasElement.prototype.captureStream === "function" && typeof window.MediaRecorder === "function";

    if (!canRecord) {
      // Fallback: Read as data url with normal base64 compression / size stats
      console.warn("Canvas stream or MediaRecorder not supported. Using standard format.");
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          resolve({
            dataUrl: e.target.result,
            originalSize: file.size,
            compressedSize: file.size,
            savingsPercentage: 0
          });
        } else {
          reject(new Error("Failed to read video file."));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const video = document.createElement("video");
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    // Set crossOrigin in case it's loaded from a remote source, though here it is local
    video.crossOrigin = "anonymous";

    video.onloadedmetadata = () => {
      // Calculate output size
      let width = video.videoWidth || 640;
      let height = video.videoHeight || 480;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Ensure even dimensions as some video encoders strictly require width/height to be even numbers
      if (width % 2 !== 0) width--;
      if (height % 2 !== 0) height--;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not create 2D canvas context for video compression."));
        return;
      }

      // Capture canvas at 24 frames per second
      const canvasStream = canvas.captureStream(24);
      
      // Attempt to combine audio if mute is false and audio tracks exist
      let combinedStream = canvasStream;
      if (!mute) {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioContext.createMediaElementSource(video);
          const destination = audioContext.createMediaStreamDestination();
          source.connect(destination);
          source.connect(audioContext.destination); // let user hear if playing
          
          const audioTracks = destination.stream.getAudioTracks();
          if (audioTracks.length > 0) {
            canvasStream.addTrack(audioTracks[0]);
          }
        } catch (audioError) {
          console.warn("Failed to capture audio tracks, compressing as muted:", audioError);
        }
      }

      const recorderOptions: MediaRecorderOptions = {
        mimeType: "video/webm;codecs=vp8",
        videoBitsPerSecond: targetBitrate
      };

      // Check for safari or mobile support of alternative mimeTypes
      if (!MediaRecorder.isTypeSupported(recorderOptions.mimeType || "")) {
        if (MediaRecorder.isTypeSupported("video/mp4")) {
          recorderOptions.mimeType = "video/mp4";
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
          recorderOptions.mimeType = "video/webm";
        } else {
          delete recorderOptions.mimeType;
        }
      }

      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);
      } catch (recError) {
        console.warn("MediaRecorder creation failed with options. Retrying with basic options:", recError);
        mediaRecorder = new MediaRecorder(combinedStream);
      }

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const compressedBlob = new Blob(chunks, { type: mediaRecorder.mimeType || "video/webm" });
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === "string") {
            const resultDataUrl = e.target.result;
            const compressedSize = Math.round((resultDataUrl.length * 3) / 4);
            const savingsPercentage = Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100));

            resolve({
              dataUrl: resultDataUrl,
              originalSize: file.size,
              compressedSize,
              savingsPercentage
            });
          } else {
            reject(new Error("Failed to convert compressed video blob to data URL."));
          }
          URL.revokeObjectURL(videoUrl);
        };
        reader.onerror = (err) => {
          reject(err);
          URL.revokeObjectURL(videoUrl);
        };
        reader.readAsDataURL(compressedBlob);
      };

      // Start re-recording loop
      let animFrameId: number;
      const duration = video.duration || 5; // fallback to 5 seconds if duration is infinity/NaN

      video.currentTime = 0;
      video.play().then(() => {
        mediaRecorder.start();

        const drawFrame = () => {
          if (video.paused || video.ended) {
            stopRecording();
            return;
          }

          ctx.drawImage(video, 0, 0, width, height);
          
          if (onProgress) {
            const pct = Math.min(99, Math.round((video.currentTime / duration) * 100));
            onProgress(pct);
          }

          animFrameId = requestAnimationFrame(drawFrame);
        };

        const stopRecording = () => {
          cancelAnimationFrame(animFrameId);
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
          video.pause();
        };

        // Safety timeout to prevent infinite loops on broken videos
        const maxDurationMs = (duration + 2) * 1000;
        const safetyTimeout = setTimeout(() => {
          stopRecording();
        }, maxDurationMs);

        video.onended = () => {
          clearTimeout(safetyTimeout);
          stopRecording();
        };

        animFrameId = requestAnimationFrame(drawFrame);
      }).catch((err) => {
        // If autoplay or programmatic play is blocked by browser policies
        console.warn("Auto-playback for video compression failed, performing direct compression fallback:", err);
        
        // Fast Fallback: Simple compression read
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === "string") {
            resolve({
              dataUrl: e.target.result,
              originalSize: file.size,
              compressedSize: file.size,
              savingsPercentage: 0
            });
          } else {
            reject(new Error("Failed to read video file in fallback."));
          }
          URL.revokeObjectURL(videoUrl);
        };
        reader.readAsDataURL(file);
      });
    };

    video.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(videoUrl);
    };
  });
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
