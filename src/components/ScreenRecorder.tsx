import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Square, Download, Circle } from 'lucide-react';

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        // Mic access denied — continue with display audio only
      }

      const tracks = [...displayStream.getTracks()];
      if (audioStream) {
        audioStream.getAudioTracks().forEach(t => tracks.push(t));
      }
      const combinedStream = new MediaStream(tracks);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : 'video/webm',
      });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        // Stop all tracks
        combinedStream.getTracks().forEach(t => t.stop());
      };

      // If user stops sharing via browser UI
      displayStream.getVideoTracks()[0].onended = () => {
        if (recorder.state === 'recording') recorder.stop();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordedUrl(null);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (err) {
      console.error('Recording failed:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (!recordedUrl) return;
    const a = document.createElement('a');
    a.href = recordedUrl;
    a.download = `invoca-demo-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    a.click();
  }, [recordedUrl]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {!isRecording && !recordedUrl && (
          <motion.button
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(220,14%,18%)] text-white/70 hover:text-white border border-[hsl(220,14%,22%)] text-sm font-medium transition-all"
          >
            <Video className="w-4 h-4" />
            Record Pitch
          </motion.button>
        )}

        {isRecording && (
          <motion.div
            key="recording"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="flex items-center gap-3 pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
            onHoverStart={(e) => { (e.target as HTMLElement).closest('.recorder-fade')?.classList.add('recorder-visible'); }}
          >
            <div className="text-xs text-muted-foreground">Recording… hover here to stop</div>
          </motion.div>
        )}

        {!isRecording && recordedUrl && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={downloadRecording}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => { setRecordedUrl(null); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(220,14%,18%)] text-white/70 hover:text-white border border-[hsl(220,14%,22%)] text-sm font-medium transition-all"
            >
              <Video className="w-4 h-4" />
              New Recording
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
