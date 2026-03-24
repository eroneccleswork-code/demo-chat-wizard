import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      let audioStream: MediaStream | null = null;
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        // Mic denied
      }

      const tracks = [...displayStream.getTracks()];
      if (audioStream) {
        audioStream.getAudioTracks().forEach(t => tracks.push(t));
      }
      const combinedStream = new MediaStream(tracks);

      // Prefer MP4 (H.264) for LinkedIn/email compatibility, fall back to WebM
      const mp4Supported = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2');
      const mimeType = mp4Supported
        ? 'video/mp4;codecs=avc1,mp4a.40.2'
        : MediaRecorder.isTypeSupported('video/mp4')
          ? 'video/mp4'
          : MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
            ? 'video/webm;codecs=vp9,opus'
            : 'video/webm';

      const recorder = new MediaRecorder(combinedStream, { mimeType });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const isMP4 = recorder.mimeType.includes('mp4');
        const blob = new Blob(chunksRef.current, { type: isMP4 ? 'video/mp4' : 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setFileExt(isMP4 ? 'mp4' : 'webm');
        setIsRecording(false);
        combinedStream.getTracks().forEach(t => t.stop());
      };

      displayStream.getVideoTracks()[0].onended = () => {
        if (recorder.state === 'recording') recorder.stop();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordedUrl(null);
    } catch (err) {
      console.error('Recording failed:', err);
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (!recordedUrl) return;
    const a = document.createElement('a');
    a.href = recordedUrl;
    a.download = `invoca-demo-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    a.click();
  }, [recordedUrl]);

  // Hidden while recording
  if (isRecording) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2">
      <AnimatePresence mode="wait">
        {!recordedUrl && (
          <motion.button
            key="rec"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.15 }}
            onClick={startRecording}
            title="Record Pitch"
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 shadow-lg shadow-red-500/30 flex items-center justify-center transition-colors"
          >
            <div className="w-3 h-3 rounded-full bg-white" />
          </motion.button>
        )}

        {recordedUrl && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={downloadRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <button
              onClick={() => setRecordedUrl(null)}
              title="New Recording"
              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 shadow-lg shadow-red-500/30 flex items-center justify-center transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
